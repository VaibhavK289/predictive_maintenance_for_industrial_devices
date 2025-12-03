"""
Enterprise Predictive Maintenance - FastAPI Server
High-performance REST API for ML predictions and maintenance analysis
"""
from typing import Dict, Any, List, Optional
from datetime import datetime
from contextlib import asynccontextmanager
import os
import structlog

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import pandas as pd

from config.settings import get_settings
from schemas.models import (
    SensorReading, PredictionResult, PredictionInput,
    MaintenanceRecommendation, BatchPredictionRequest,
    TrainingConfig, TrainingMetrics, HealthCheck, APIResponse,
    MachineType, MaintenanceUrgency
)
from ml.engine import PredictiveMaintenanceModel

logger = structlog.get_logger()
settings = get_settings()

# Global instances
model: Optional[PredictiveMaintenanceModel] = None
knowledge_base = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global model, knowledge_base
    
    logger.info("Starting Enterprise Predictive Maintenance API")
    
    # Try to initialize knowledge base
    try:
        from rag.knowledge_base import MaintenanceKnowledgeBase
        knowledge_base = MaintenanceKnowledgeBase()
        logger.info("Knowledge base initialized", docs=knowledge_base.document_count())
    except Exception as e:
        logger.warning("Could not initialize knowledge base", error=str(e))
        knowledge_base = None
    
    # Check if we have a pre-trained model
    model_path = os.path.join(settings.ml.model_path, "latest_model.joblib")
    if os.path.exists(model_path):
        logger.info("Loading pre-trained model", path=model_path)
        model = PredictiveMaintenanceModel.load(model_path)
    else:
        logger.info("No pre-trained model found, initializing empty model")
        model = PredictiveMaintenanceModel(model_type="ensemble")
    
    yield
    
    # Cleanup
    logger.info("Shutting down API")


# Create FastAPI app
app = FastAPI(
    title="Enterprise Predictive Maintenance API",
    description="""
    Advanced ML-powered predictive maintenance system with:
    - Real-time failure prediction using ensemble models
    - RAG-based maintenance knowledge retrieval
    - Multi-agent analysis capabilities
    - Orchestrated workflows
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoints
@app.get("/health", response_model=HealthCheck, tags=["System"])
async def health_check():
    """Check system health and component status"""
    return HealthCheck(
        status="healthy",
        version="1.0.0",
        model_loaded=model is not None and model.is_trained,
        knowledge_base_ready=knowledge_base is not None,
        agents_initialized=True
    )


@app.get("/", tags=["System"])
async def root():
    """API root endpoint"""
    return {
        "name": "Enterprise Predictive Maintenance API",
        "version": "1.0.0",
        "status": "running",
        "model_trained": model is not None and model.is_trained,
        "endpoints": {
            "health": "/health",
            "predict": "/api/predict",
            "analyze": "/api/analyze",
            "train": "/api/train",
            "knowledge": "/api/knowledge"
        }
    }


# Prediction endpoints
@app.post("/api/predict", tags=["Predictions"])
async def predict(input_data: PredictionInput):
    """
    Make a single prediction for machine failure.
    
    Returns probability of failure and risk assessment.
    """
    global model
    
    if model is None or not model.is_trained:
        # Use heuristic prediction
        return await quick_predict(input_data)
    
    try:
        # Convert input to SensorReading
        reading = input_data.to_sensor_reading()
        result = model.predict(reading)
        logger.info(
            "Prediction made",
            machine_id=reading.machine_id,
            probability=result.failure_probability
        )
        return result.model_dump()
    except Exception as e:
        logger.error("Prediction failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict/quick", tags=["Predictions"])
async def quick_predict(input_data: PredictionInput):
    """
    Quick prediction without full model (heuristic-based).
    
    Useful when model is not yet trained or for rapid prototyping.
    """
    # Calculate derived features
    temp_diff = input_data.process_temperature - input_data.air_temperature
    power = 2 * 3.14159 * input_data.rotational_speed * input_data.torque / 60
    
    # Simple heuristic scoring
    risk_score = 0.0
    risk_score += min(input_data.tool_wear / 250, 0.4)
    risk_score += min(max(temp_diff - 8, 0) / 12, 0.3)
    risk_score += min(power / 15000, 0.3)
    
    # Determine risk level
    if risk_score >= 0.7:
        risk_level = "critical"
    elif risk_score >= 0.5:
        risk_level = "high"
    elif risk_score >= 0.3:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    # Feature importance (heuristic)
    feature_importance = {
        "tool_wear": 0.35,
        "temperature_diff": 0.25,
        "power": 0.20,
        "torque": 0.10,
        "rotational_speed": 0.10
    }
    
    return {
        "machine_id": input_data.machine_id,
        "failure_probability": min(risk_score, 0.99),
        "risk_level": risk_level,
        "confidence": 0.85,
        "feature_importance": feature_importance,
        "prediction_time": datetime.utcnow().isoformat(),
        "model_type": "heuristic"
    }


@app.post("/api/predict/batch", tags=["Predictions"])
async def predict_batch(request: BatchPredictionRequest):
    """
    Make predictions for multiple sensor readings.
    """
    results = []
    for reading in request.readings:
        result = await quick_predict(reading)
        results.append(result)
    
    return {
        "predictions": results,
        "count": len(results),
        "timestamp": datetime.utcnow().isoformat()
    }


# Analysis endpoints
@app.post("/api/analyze", tags=["Analysis"])
async def analyze_machine(input_data: PredictionInput):
    """
    Full machine analysis using AI agents and knowledge base.
    """
    # Get prediction
    prediction = await quick_predict(input_data)
    
    # Get knowledge context if available
    context = ""
    recommendations = []
    
    if knowledge_base:
        try:
            sensor_data = {
                "air_temperature": input_data.air_temperature,
                "process_temperature": input_data.process_temperature,
                "rotational_speed": input_data.rotational_speed,
                "torque": input_data.torque,
                "tool_wear": input_data.tool_wear
            }
            context = knowledge_base.get_relevant_context(
                input_data.machine_type.value,
                sensor_data
            )
            recommendations = knowledge_base.get_maintenance_recommendations(
                input_data.machine_id,
                sensor_data
            )
        except Exception as e:
            logger.warning("Knowledge retrieval failed", error=str(e))
    
    # Generate analysis
    temp_diff = input_data.process_temperature - input_data.air_temperature
    power = 2 * 3.14159 * input_data.rotational_speed * input_data.torque / 60
    
    concerns = []
    if input_data.tool_wear > 150:
        concerns.append("High tool wear - replacement recommended")
    if temp_diff < 8.6:
        concerns.append("Low temperature differential - check cooling system")
    if power > 9000:
        concerns.append("High power consumption - reduce load")
    if input_data.torque > 60:
        concerns.append("High torque - check for overstrain")
    
    return {
        "machine_id": input_data.machine_id,
        "prediction": prediction,
        "analysis": {
            "temperature_differential": temp_diff,
            "power_output": power,
            "concerns": concerns if concerns else ["No immediate concerns"],
            "knowledge_context": context if context else "Knowledge base not available",
            "recommendations": recommendations if recommendations else ["Continue normal monitoring"]
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/api/analyze/workflow", tags=["Analysis"])
async def run_workflow_analysis(input_data: PredictionInput):
    """
    Run full LangGraph workflow analysis.
    """
    try:
        from orchestration.workflow import analyze_machine as wf_analyze
        
        sensor_data = {
            "machine_type": input_data.machine_type.value,
            "air_temperature": input_data.air_temperature,
            "process_temperature": input_data.process_temperature,
            "rotational_speed": input_data.rotational_speed,
            "torque": input_data.torque,
            "tool_wear": input_data.tool_wear
        }
        
        result = wf_analyze(input_data.machine_id, sensor_data, model)
        return result
        
    except Exception as e:
        logger.error("Workflow analysis failed", error=str(e))
        # Fallback to simple analysis
        return await analyze_machine(input_data)


# Training endpoints
@app.post("/api/train", tags=["Training"])
async def train_model(
    background_tasks: BackgroundTasks,
    model_type: str = "ensemble",
    balance_classes: bool = True
):
    """
    Train or retrain the ML model.
    
    Runs in background to avoid blocking the API.
    """
    global model
    
    data_path = os.path.join(settings.ml.training_data_path, "predictive_maintenance.csv")
    
    if not os.path.exists(data_path):
        raise HTTPException(
            status_code=404,
            detail=f"Training data not found at {data_path}"
        )
    
    # Start training in background
    background_tasks.add_task(
        train_model_background,
        data_path,
        model_type,
        balance_classes
    )
    
    return {
        "status": "training_started",
        "message": "Model training started in background",
        "model_type": model_type,
        "data_path": data_path
    }


async def train_model_background(data_path: str, model_type: str, balance_classes: bool):
    """Background task for model training"""
    global model
    
    try:
        logger.info("Starting background training", model_type=model_type)
        
        data = pd.read_csv(data_path)
        
        config = TrainingConfig(
            model_type=model_type,
            handle_imbalance=balance_classes
        )
        
        model = PredictiveMaintenanceModel(model_type=model_type)
        metrics = model.train(data, config)
        
        # Save model
        output_path = os.path.join(settings.ml.model_path, "latest_model.joblib")
        model.save(output_path)
        
        logger.info(
            "Background training complete",
            accuracy=metrics.accuracy,
            f1_score=metrics.f1_score
        )
    except Exception as e:
        logger.error("Background training failed", error=str(e))


@app.get("/api/model/status", tags=["Training"])
async def model_status():
    """Get current model status"""
    global model
    
    if model is None:
        return {"status": "not_initialized", "trained": False}
    
    return {
        "status": "initialized",
        "trained": model.is_trained,
        "model_type": model.model_type,
        "model_id": model.model_id,
        "version": model.version,
        "training_metrics": model.training_metrics.model_dump() if model.training_metrics else None
    }


# Knowledge base endpoints
@app.get("/api/knowledge/query", tags=["Knowledge"])
async def query_knowledge(query: str, n_results: int = 5):
    """Query the maintenance knowledge base"""
    if knowledge_base is None:
        raise HTTPException(
            status_code=503,
            detail="Knowledge base not initialized"
        )
    
    try:
        result = knowledge_base.query(query, n_results)
        return result.model_dump()
    except Exception as e:
        logger.error("Knowledge query failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/knowledge/failure/{failure_type}", tags=["Knowledge"])
async def get_failure_info(failure_type: str):
    """Get information about a specific failure type"""
    if knowledge_base is None:
        raise HTTPException(
            status_code=503,
            detail="Knowledge base not initialized"
        )
    
    try:
        info = knowledge_base.get_failure_info(failure_type)
        if info is None:
            raise HTTPException(
                status_code=404,
                detail=f"No information found for failure type: {failure_type}"
            )
        return info
    except Exception as e:
        logger.error("Failure info retrieval failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/knowledge/stats", tags=["Knowledge"])
async def knowledge_stats():
    """Get knowledge base statistics"""
    if knowledge_base is None:
        return {"status": "not_initialized", "document_count": 0}
    
    return {
        "status": "initialized",
        "document_count": knowledge_base.document_count(),
        "collection_name": settings.vectordb.collection_name
    }


# Recommendation endpoints
@app.post("/api/recommendations", tags=["Recommendations"])
async def get_recommendations(input_data: PredictionInput):
    """Get maintenance recommendations for a machine"""
    
    # Get prediction first
    prediction = await quick_predict(input_data)
    
    # Build recommendations based on conditions
    recommendations = []
    
    if input_data.tool_wear > 180:
        recommendations.append({
            "action": "Replace cutting tool immediately",
            "priority": "critical",
            "timeframe": "within 1 hour"
        })
    elif input_data.tool_wear > 120:
        recommendations.append({
            "action": "Schedule tool replacement",
            "priority": "high",
            "timeframe": "next shift"
        })
    
    temp_diff = input_data.process_temperature - input_data.air_temperature
    if temp_diff < 8.6:
        recommendations.append({
            "action": "Check cooling system - insufficient heat dissipation",
            "priority": "high",
            "timeframe": "within 4 hours"
        })
    
    power = 2 * 3.14159 * input_data.rotational_speed * input_data.torque / 60
    if power > 9000:
        recommendations.append({
            "action": "Reduce machining load - power exceeds limits",
            "priority": "medium",
            "timeframe": "immediate"
        })
    
    if input_data.torque > 60:
        recommendations.append({
            "action": "Inspect for overstrain conditions",
            "priority": "medium",
            "timeframe": "within 24 hours"
        })
    
    if not recommendations:
        recommendations.append({
            "action": "Continue normal operation",
            "priority": "low",
            "timeframe": "next scheduled maintenance"
        })
    
    return {
        "machine_id": input_data.machine_id,
        "prediction": prediction,
        "recommendations": recommendations,
        "estimated_cost": settings.ml.maintenance_cost,
        "timestamp": datetime.utcnow().isoformat()
    }


def start_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = False):
    """Start the FastAPI server"""
    uvicorn.run(
        "api.server:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )


if __name__ == "__main__":
    start_server()
