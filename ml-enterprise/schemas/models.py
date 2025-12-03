"""
Enterprise Predictive Maintenance ML System - Pydantic Schemas
Comprehensive data validation models for type-safe ML operations
"""
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime
from enum import Enum
import numpy as np


# ============================================================================
# Enums for Type Safety
# ============================================================================

class MachineType(str, Enum):
    """Machine quality type categories"""
    HIGH = "H"
    MEDIUM = "M"
    LOW = "L"


class FailureType(str, Enum):
    """Machine failure type categories"""
    NO_FAILURE = "No Failure"
    TOOL_WEAR_FAILURE = "Tool Wear Failure"
    HEAT_DISSIPATION_FAILURE = "Heat Dissipation Failure"
    POWER_FAILURE = "Power Failure"
    OVERSTRAIN_FAILURE = "Overstrain Failure"
    RANDOM_FAILURES = "Random Failures"


class PredictionStatus(str, Enum):
    """Prediction status"""
    NORMAL = "normal"
    WARNING = "warning"
    CRITICAL = "critical"
    FAILURE_PREDICTED = "failure_predicted"


class MaintenanceUrgency(str, Enum):
    """Maintenance urgency levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    IMMEDIATE = "immediate"


# ============================================================================
# Input Schemas
# ============================================================================

class SensorReading(BaseModel):
    """Individual sensor reading from industrial equipment"""
    machine_id: str = Field(..., description="Unique machine identifier", min_length=1, max_length=50)
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Reading timestamp")
    
    # Temperature sensors
    air_temperature: float = Field(..., ge=250, le=350, description="Air temperature in Kelvin")
    process_temperature: float = Field(..., ge=250, le=400, description="Process temperature in Kelvin")
    
    # Mechanical sensors
    rotational_speed: float = Field(..., ge=0, le=5000, description="Rotational speed in RPM")
    torque: float = Field(..., ge=0, le=200, description="Torque in Newton-meters")
    tool_wear: float = Field(..., ge=0, le=300, description="Tool wear in minutes")
    
    # Machine metadata
    machine_type: MachineType = Field(..., description="Machine quality type (H/M/L)")
    
    @field_validator('process_temperature')
    @classmethod
    def validate_process_temp(cls, v: float, info) -> float:
        """Process temperature should be higher than air temperature"""
        air_temp = info.data.get('air_temperature')
        if air_temp and v < air_temp:
            raise ValueError('Process temperature must be >= air temperature')
        return v
    
    @property
    def temperature_difference(self) -> float:
        """Calculate temperature difference"""
        return self.process_temperature - self.air_temperature
    
    @property
    def power(self) -> float:
        """Calculate power in Watts"""
        return 2 * np.pi * self.rotational_speed * self.torque / 60
    
    class Config:
        json_schema_extra = {
            "example": {
                "machine_id": "M14860",
                "air_temperature": 298.1,
                "process_temperature": 308.6,
                "rotational_speed": 1551,
                "torque": 42.8,
                "tool_wear": 100,
                "machine_type": "M"
            }
        }


class BatchSensorReadings(BaseModel):
    """Batch of sensor readings for bulk processing"""
    readings: List[SensorReading] = Field(..., min_length=1, max_length=10000)
    batch_id: Optional[str] = Field(default=None, description="Batch identifier")
    source: Optional[str] = Field(default="api", description="Data source")
    
    @property
    def count(self) -> int:
        return len(self.readings)


class FeatureVector(BaseModel):
    """Processed feature vector for ML model input"""
    type_h: int = Field(..., ge=0, le=1, description="High quality type flag")
    type_l: int = Field(..., ge=0, le=1, description="Low quality type flag")
    type_m: int = Field(..., ge=0, le=1, description="Medium quality type flag")
    tool_wear: float = Field(..., ge=0, description="Tool wear in minutes")
    power: float = Field(..., ge=0, description="Calculated power in Watts")
    temp_diff: float = Field(..., description="Temperature difference in Kelvin")
    
    @model_validator(mode='after')
    def validate_type_flags(self) -> 'FeatureVector':
        """Exactly one type flag should be set"""
        type_sum = self.type_h + self.type_l + self.type_m
        if type_sum != 1:
            raise ValueError('Exactly one machine type must be selected')
        return self
    
    def to_numpy(self) -> np.ndarray:
        """Convert to numpy array for model prediction"""
        return np.array([[
            self.type_h, self.type_l, self.type_m,
            self.tool_wear, self.power, self.temp_diff
        ]])
    
    @classmethod
    def from_sensor_reading(cls, reading: SensorReading) -> 'FeatureVector':
        """Create feature vector from sensor reading"""
        return cls(
            type_h=1 if reading.machine_type == MachineType.HIGH else 0,
            type_l=1 if reading.machine_type == MachineType.LOW else 0,
            type_m=1 if reading.machine_type == MachineType.MEDIUM else 0,
            tool_wear=reading.tool_wear,
            power=reading.power,
            temp_diff=reading.temperature_difference
        )


# ============================================================================
# Output Schemas
# ============================================================================

class PredictionResult(BaseModel):
    """Single prediction result"""
    machine_id: str = Field(..., description="Machine identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Prediction outputs
    failure_predicted: bool = Field(..., description="Whether failure is predicted")
    failure_probability: float = Field(..., ge=0, le=1, description="Probability of failure")
    
    # Risk assessment
    risk_score: float = Field(..., ge=0, le=100, description="Risk score 0-100")
    status: PredictionStatus = Field(..., description="Overall status")
    urgency: MaintenanceUrgency = Field(..., description="Maintenance urgency")
    
    # Confidence metrics
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    model_version: str = Field(..., description="Model version used")
    
    # Explanation
    contributing_factors: List[Dict[str, Any]] = Field(default_factory=list)
    recommendation: Optional[str] = Field(default=None)
    
    @classmethod
    def from_model_output(
        cls,
        machine_id: str,
        probability: float,
        model_version: str,
        feature_importance: Optional[Dict[str, float]] = None
    ) -> 'PredictionResult':
        """Create prediction result from model output"""
        # Determine status and urgency based on probability
        if probability >= 0.8:
            status = PredictionStatus.FAILURE_PREDICTED
            urgency = MaintenanceUrgency.IMMEDIATE
        elif probability >= 0.6:
            status = PredictionStatus.CRITICAL
            urgency = MaintenanceUrgency.HIGH
        elif probability >= 0.4:
            status = PredictionStatus.WARNING
            urgency = MaintenanceUrgency.MEDIUM
        else:
            status = PredictionStatus.NORMAL
            urgency = MaintenanceUrgency.LOW
        
        # Build contributing factors from feature importance
        factors = []
        if feature_importance:
            for feature, importance in sorted(feature_importance.items(), key=lambda x: -x[1])[:5]:
                factors.append({
                    "feature": feature,
                    "importance": round(importance, 4),
                    "contribution": "high" if importance > 0.2 else "medium" if importance > 0.1 else "low"
                })
        
        return cls(
            machine_id=machine_id,
            failure_predicted=probability >= 0.5,
            failure_probability=round(probability, 4),
            risk_score=round(probability * 100, 2),
            status=status,
            urgency=urgency,
            confidence=min(0.95, abs(probability - 0.5) * 2 + 0.5),
            model_version=model_version,
            contributing_factors=factors
        )


class BatchPredictionResult(BaseModel):
    """Batch prediction results"""
    batch_id: str
    total_predictions: int
    predictions: List[PredictionResult]
    
    # Summary statistics
    failure_count: int = Field(default=0)
    warning_count: int = Field(default=0)
    avg_risk_score: float = Field(default=0.0)
    processing_time_ms: float = Field(default=0.0)
    
    @model_validator(mode='after')
    def compute_summary(self) -> 'BatchPredictionResult':
        """Compute summary statistics"""
        if self.predictions:
            self.failure_count = sum(1 for p in self.predictions if p.failure_predicted)
            self.warning_count = sum(1 for p in self.predictions if p.status == PredictionStatus.WARNING)
            self.avg_risk_score = sum(p.risk_score for p in self.predictions) / len(self.predictions)
        return self


class MaintenanceRecommendation(BaseModel):
    """AI-generated maintenance recommendation"""
    machine_id: str
    recommendation_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Recommendation details
    summary: str = Field(..., max_length=500)
    detailed_analysis: str = Field(..., max_length=5000)
    
    # Action items
    immediate_actions: List[str] = Field(default_factory=list)
    scheduled_actions: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Cost analysis
    estimated_cost: Optional[float] = Field(default=None)
    cost_if_ignored: Optional[float] = Field(default=None)
    roi_if_actioned: Optional[float] = Field(default=None)
    
    # Confidence and sources
    confidence_score: float = Field(..., ge=0, le=1)
    data_sources: List[str] = Field(default_factory=list)
    similar_cases_referenced: int = Field(default=0)


# ============================================================================
# Model Training Schemas
# ============================================================================

class TrainingConfig(BaseModel):
    """Configuration for model training"""
    model_type: Literal["xgboost", "lightgbm", "catboost", "random_forest", "ensemble"]
    hyperparameters: Dict[str, Any] = Field(default_factory=dict)
    
    # Data configuration
    test_size: float = Field(default=0.2, ge=0.1, le=0.4)
    validation_size: float = Field(default=0.1, ge=0.05, le=0.2)
    stratify: bool = Field(default=True)
    
    # Training options
    cross_validation: bool = Field(default=True)
    cv_folds: int = Field(default=5, ge=3, le=10)
    early_stopping: bool = Field(default=True)
    
    # Class imbalance
    handle_imbalance: bool = Field(default=True)
    imbalance_method: Literal["smote", "adasyn", "class_weight", "none"] = Field(default="smote")
    
    # Feature selection
    feature_selection: bool = Field(default=True)
    importance_threshold: float = Field(default=0.01)


class TrainingMetrics(BaseModel):
    """Training results and metrics"""
    model_id: str
    model_type: str
    trained_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Performance metrics
    accuracy: float = Field(..., ge=0, le=1)
    precision: float = Field(..., ge=0, le=1)
    recall: float = Field(..., ge=0, le=1)
    f1_score: float = Field(..., ge=0, le=1)
    auc_roc: float = Field(..., ge=0, le=1)
    
    # Cost-benefit metrics
    cost_benefit_score: Optional[float] = Field(default=None)
    
    # Confusion matrix
    true_positives: int
    true_negatives: int
    false_positives: int
    false_negatives: int
    
    # Training info
    training_samples: int
    test_samples: int
    training_time_seconds: float
    
    # Feature importance
    feature_importances: Dict[str, float] = Field(default_factory=dict)


class ModelInfo(BaseModel):
    """Model metadata and version info"""
    model_id: str
    version: str
    model_type: str
    
    created_at: datetime
    updated_at: datetime
    
    # Model status
    is_active: bool = Field(default=False)
    is_production: bool = Field(default=False)
    
    # Performance summary
    metrics: TrainingMetrics
    
    # Model artifacts
    artifact_path: str
    config: TrainingConfig


# ============================================================================
# Knowledge Base Schemas
# ============================================================================

class KnowledgeDocument(BaseModel):
    """Document for RAG knowledge base"""
    doc_id: str
    title: str
    content: str
    
    # Metadata
    doc_type: Literal["manual", "case_study", "research", "sop", "incident_report"]
    machine_types: List[MachineType] = Field(default_factory=list)
    failure_types: List[FailureType] = Field(default_factory=list)
    
    # Source info
    source: str
    author: Optional[str] = Field(default=None)
    created_at: datetime
    
    # Embedding info (populated after processing)
    embedding_id: Optional[str] = Field(default=None)
    chunk_ids: List[str] = Field(default_factory=list)


class QueryResult(BaseModel):
    """RAG query result"""
    query: str
    results: List[Dict[str, Any]]
    
    # Answer generation
    generated_answer: str
    sources: List[str]
    
    # Metadata
    processing_time_ms: float
    retrieval_scores: List[float]


# ============================================================================
# API Request/Response Models
# ============================================================================

class PredictionInput(BaseModel):
    """Input for single prediction request"""
    machine_id: str = Field(..., description="Unique machine identifier")
    machine_type: MachineType = Field(default=MachineType.LOW, description="Machine type")
    air_temperature: float = Field(..., description="Air temperature in Kelvin")
    process_temperature: float = Field(..., description="Process temperature in Kelvin")
    rotational_speed: float = Field(..., description="Rotational speed in RPM")
    torque: float = Field(..., description="Torque in Nm")
    tool_wear: float = Field(..., description="Tool wear in minutes")
    
    def to_sensor_reading(self) -> SensorReading:
        """Convert to SensorReading"""
        return SensorReading(
            machine_id=self.machine_id,
            machine_type=self.machine_type,
            air_temperature=self.air_temperature,
            process_temperature=self.process_temperature,
            rotational_speed=self.rotational_speed,
            torque=self.torque,
            tool_wear=self.tool_wear
        )


class BatchPredictionRequest(BaseModel):
    """Request for batch predictions"""
    readings: List[PredictionInput] = Field(..., min_length=1)
    include_recommendations: bool = Field(default=True)


class MaintenanceAlert(BaseModel):
    """Maintenance alert notification"""
    alert_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    machine_id: str
    severity: MaintenanceUrgency
    
    # Alert details
    title: str
    description: str
    failure_probability: float
    predicted_failure_type: Optional[FailureType] = None
    
    # Timing
    created_at: datetime = Field(default_factory=datetime.now)
    estimated_failure_time: Optional[datetime] = None
    recommended_action_deadline: Optional[datetime] = None
    
    # Status
    acknowledged: bool = False
    resolved: bool = False


class HealthCheck(BaseModel):
    """API health check response"""
    status: str = "healthy"
    version: str = "1.0.0"
    model_loaded: bool = False
    knowledge_base_ready: bool = False
    agents_initialized: bool = False
    timestamp: datetime = Field(default_factory=datetime.now)


class APIResponse(BaseModel):
    """Standard API response wrapper"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    errors: Optional[List[str]] = None
    timestamp: datetime = Field(default_factory=datetime.now)
