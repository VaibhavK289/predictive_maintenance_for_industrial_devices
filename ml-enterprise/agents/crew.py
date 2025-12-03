"""
Enterprise Predictive Maintenance - CrewAI Agents
Multi-agent system for predictive maintenance analysis (Simplified version)
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
import structlog
from pydantic import BaseModel, Field

from config.settings import get_settings
from schemas.models import (
    SensorReading, PredictionResult, MaintenanceRecommendation,
    MaintenanceAlert, MaintenanceUrgency
)

logger = structlog.get_logger()
settings = get_settings()


class SensorDataInput(BaseModel):
    """Input model for sensor data tool"""
    machine_id: str = Field(description="The machine identifier")
    sensor_data: Dict[str, float] = Field(description="Sensor readings dictionary")


class KnowledgeQueryInput(BaseModel):
    """Input model for knowledge base query"""
    query: str = Field(description="The query to search in knowledge base")
    machine_type: Optional[str] = Field(default=None, description="Machine type for filtering")


class PredictionAnalysisInput(BaseModel):
    """Input model for prediction analysis"""
    prediction_probability: float = Field(description="Failure probability from ML model")
    feature_importance: Dict[str, float] = Field(description="Feature importance scores")


class MaintenanceCrewAI:
    """Multi-agent system for predictive maintenance analysis
    
    This is a simplified version that works without external LLM APIs.
    For full CrewAI functionality, set GOOGLE_API_KEY environment variable.
    """
    
    def __init__(self, knowledge_base=None):
        self.knowledge_base = knowledge_base
        self._llm_available = bool(settings.llm.google_api_key)
        
        if self._llm_available:
            self._init_full_agents()
        else:
            logger.info("LLM API key not configured, using rule-based analysis")
        
        logger.info("MaintenanceCrewAI initialized", llm_available=self._llm_available)
    
    def _init_full_agents(self):
        """Initialize full CrewAI agents with LLM"""
        try:
            from crewai import Agent, Task, Crew, Process
            from langchain_google_genai import ChatGoogleGenerativeAI
            
            self.llm = ChatGoogleGenerativeAI(
                model=settings.llm.model_name,
                google_api_key=settings.llm.google_api_key,
                temperature=settings.llm.temperature,
                max_tokens=settings.llm.max_tokens
            )
            self._crew_available = True
        except Exception as e:
            logger.warning("Could not initialize CrewAI agents", error=str(e))
            self._crew_available = False
    
    def analyze_machine(
        self,
        sensor_reading: SensorReading,
        prediction_result: PredictionResult
    ) -> MaintenanceRecommendation:
        """Run analysis on a machine"""
        
        logger.info(
            "Starting analysis",
            machine_id=sensor_reading.machine_id,
            failure_probability=prediction_result.failure_probability
        )
        
        # Use rule-based analysis
        return self._rule_based_analysis(sensor_reading, prediction_result)
    
    def _rule_based_analysis(
        self,
        sensor_reading: SensorReading,
        prediction_result: PredictionResult
    ) -> MaintenanceRecommendation:
        """Rule-based analysis when LLM is not available"""
        
        # Calculate metrics
        temp_diff = sensor_reading.process_temperature - sensor_reading.air_temperature
        power = 2 * 3.14159 * sensor_reading.rotational_speed * sensor_reading.torque / 60
        
        # Determine priority based on risk level
        prob = prediction_result.failure_probability
        if prob >= 0.7:
            priority = MaintenanceUrgency.IMMEDIATE
        elif prob >= 0.5:
            priority = MaintenanceUrgency.HIGH
        elif prob >= 0.3:
            priority = MaintenanceUrgency.MEDIUM
        else:
            priority = MaintenanceUrgency.LOW
        
        # Build recommendations
        actions = []
        components = []
        
        if sensor_reading.tool_wear > 180:
            actions.append("CRITICAL: Replace cutting tool immediately - wear exceeds safe limit")
            components.append("tool_assembly")
        elif sensor_reading.tool_wear > 120:
            actions.append("Schedule tool replacement within next shift")
            components.append("tool_assembly")
        
        if temp_diff < 8.6:
            actions.append("Check cooling system - insufficient heat dissipation")
            components.append("cooling_system")
        elif temp_diff > 15:
            actions.append("Monitor temperature differential - approaching critical levels")
            components.append("cooling_system")
        
        if power < 3500:
            actions.append("Check drive system - power output below optimal range")
            components.append("spindle_motor")
        elif power > 9000:
            actions.append("Reduce load - power consumption exceeding limits")
            components.append("spindle_motor")
        
        if sensor_reading.torque > 60:
            actions.append("Inspect for overstrain conditions - high torque detected")
            components.append("drive_mechanism")
        
        # Add general recommendations
        actions.append("Review maintenance logs for recent patterns")
        actions.append("Document current conditions for trend analysis")
        
        # Estimate timeframe
        timeframe_map = {
            MaintenanceUrgency.IMMEDIATE: "Immediate action required",
            MaintenanceUrgency.HIGH: "Within 4 hours",
            MaintenanceUrgency.MEDIUM: "Within 24 hours",
            MaintenanceUrgency.LOW: "Next scheduled maintenance window"
        }
        
        # Estimate costs
        estimated_cost = settings.ml.maintenance_cost
        if priority == MaintenanceUrgency.IMMEDIATE:
            estimated_cost *= 1.5  # Emergency premium
        
        # Build recommendation summary
        summary = f"""
Machine Analysis Report: {sensor_reading.machine_id}
============================================

Risk Assessment: {priority.value.upper()}
Failure Probability: {prediction_result.failure_probability:.1%}

Sensor Readings:
- Air Temperature: {sensor_reading.air_temperature}K
- Process Temperature: {sensor_reading.process_temperature}K
- Temperature Differential: {temp_diff:.2f}K
- Rotational Speed: {sensor_reading.rotational_speed} RPM
- Torque: {sensor_reading.torque} Nm
- Power Output: {power:.0f}W
- Tool Wear: {sensor_reading.tool_wear} min

Recommended Actions:
{chr(10).join(f'  {i+1}. {action}' for i, action in enumerate(actions[:5]))}

Timeframe: {timeframe_map.get(priority, 'Within 7 days')}
Estimated Cost: ${estimated_cost:,.2f}
"""
        
        return MaintenanceRecommendation(
            machine_id=sensor_reading.machine_id,
            urgency=priority,
            recommended_actions=actions[:5],
            affected_components=list(set(components)) if components else ["general"],
            estimated_downtime_hours=4.0 if priority in [MaintenanceUrgency.IMMEDIATE, MaintenanceUrgency.HIGH] else 2.0,
            estimated_cost=estimated_cost,
            detailed_report=summary,
            confidence_score=prediction_result.confidence if hasattr(prediction_result, 'confidence') else 0.8
        )
    
    def generate_alert(
        self,
        sensor_reading: SensorReading,
        prediction_result: PredictionResult
    ) -> Optional[MaintenanceAlert]:
        """Generate alert if prediction exceeds threshold"""
        
        if prediction_result.failure_probability < settings.ml.alert_threshold:
            return None
        
        # Determine severity
        prob = prediction_result.failure_probability
        if prob >= 0.7:
            severity = MaintenanceUrgency.IMMEDIATE
        elif prob >= 0.5:
            severity = MaintenanceUrgency.HIGH
        else:
            severity = MaintenanceUrgency.MEDIUM
        
        # Get failure type if available
        failure_type = None
        if hasattr(prediction_result, 'predicted_failure_type'):
            failure_type = prediction_result.predicted_failure_type
        
        return MaintenanceAlert(
            machine_id=sensor_reading.machine_id,
            severity=severity,
            title=f"{severity.value.upper()} Risk: Machine {sensor_reading.machine_id}",
            description=f"ML model predicts {prediction_result.failure_probability:.1%} failure probability. "
                       f"Immediate attention recommended.",
            failure_probability=prediction_result.failure_probability,
            predicted_failure_type=failure_type
        )


def quick_analysis(
    sensor_reading: SensorReading,
    prediction_result: PredictionResult
) -> Dict[str, Any]:
    """Quick analysis without running full CrewAI workflow"""
    
    # Calculate key metrics
    temp_diff = sensor_reading.process_temperature - sensor_reading.air_temperature
    power = 2 * 3.14159 * sensor_reading.rotational_speed * sensor_reading.torque / 60
    
    # Determine risk factors
    risk_factors = []
    if sensor_reading.tool_wear > 150:
        risk_factors.append(("High tool wear", "Replace tool soon"))
    if temp_diff > 12:
        risk_factors.append(("High temperature differential", "Check cooling system"))
    if temp_diff < 8.6:
        risk_factors.append(("Low temperature differential", "Check cooling - possible HDF risk"))
    if power > 9000:
        risk_factors.append(("High power consumption", "Reduce load or check drive system"))
    if power < 3500:
        risk_factors.append(("Low power output", "Check motor and drive components"))
    
    # Determine risk level
    prob = prediction_result.failure_probability
    if prob >= 0.7:
        risk_level = "critical"
    elif prob >= 0.5:
        risk_level = "high"
    elif prob >= 0.3:
        risk_level = "medium"
    else:
        risk_level = "low"
    
    return {
        "machine_id": sensor_reading.machine_id,
        "risk_level": risk_level,
        "failure_probability": prediction_result.failure_probability,
        "temperature_differential": temp_diff,
        "power_consumption": power,
        "tool_wear_status": "critical" if sensor_reading.tool_wear > 200 else "warning" if sensor_reading.tool_wear > 150 else "normal",
        "risk_factors": risk_factors,
        "recommendation": "Schedule immediate maintenance" if prob > 0.5 else "Continue monitoring",
        "timestamp": datetime.utcnow().isoformat()
    }
