"""
Enterprise Predictive Maintenance - LangGraph Orchestration
State machine for complex maintenance analysis workflows (Simplified version)
"""
from typing import Dict, Any, List, Optional, TypedDict
from datetime import datetime
import structlog

from langgraph.graph import StateGraph, END

from config.settings import get_settings
from schemas.models import (
    SensorReading, PredictionResult, MaintenanceRecommendation,
    MaintenanceUrgency
)

logger = structlog.get_logger()
settings = get_settings()


# State definitions for LangGraph
class MaintenanceState(TypedDict):
    """State for maintenance analysis workflow"""
    # Input
    sensor_reading: Dict[str, Any]
    machine_id: str
    
    # Processing
    prediction_result: Optional[Dict[str, Any]]
    knowledge_context: Optional[str]
    risk_assessment: Optional[Dict[str, Any]]
    
    # Output
    recommendation: Optional[Dict[str, Any]]
    alert: Optional[Dict[str, Any]]
    final_report: Optional[str]
    
    # Control
    current_step: str
    error: Optional[str]
    completed: bool


class MaintenanceWorkflow:
    """LangGraph-based maintenance analysis workflow
    
    This is a simplified version that works without external LLM APIs.
    Uses rule-based logic for analysis.
    """
    
    def __init__(
        self,
        model=None,
        knowledge_base=None
    ):
        self.model = model
        self.knowledge_base = knowledge_base
        
        # Build the workflow graph
        self.workflow = self._build_workflow()
        self.app = self.workflow.compile()
        
        logger.info("MaintenanceWorkflow initialized")
    
    def _build_workflow(self) -> StateGraph:
        """Build the LangGraph workflow"""
        workflow = StateGraph(MaintenanceState)
        
        # Add nodes
        workflow.add_node("validate_input", self._validate_input)
        workflow.add_node("run_prediction", self._run_prediction)
        workflow.add_node("fetch_knowledge", self._fetch_knowledge)
        workflow.add_node("assess_risk", self._assess_risk)
        workflow.add_node("generate_recommendations", self._generate_recommendations)
        workflow.add_node("create_alert", self._create_alert)
        workflow.add_node("compile_report", self._compile_report)
        workflow.add_node("handle_error", self._handle_error)
        
        # Set entry point
        workflow.set_entry_point("validate_input")
        
        # Add edges
        workflow.add_conditional_edges(
            "validate_input",
            self._check_validation,
            {
                "valid": "run_prediction",
                "invalid": "handle_error"
            }
        )
        
        workflow.add_edge("run_prediction", "fetch_knowledge")
        workflow.add_edge("fetch_knowledge", "assess_risk")
        
        workflow.add_conditional_edges(
            "assess_risk",
            self._check_risk_level,
            {
                "high_risk": "create_alert",
                "normal": "generate_recommendations"
            }
        )
        
        workflow.add_edge("create_alert", "generate_recommendations")
        workflow.add_edge("generate_recommendations", "compile_report")
        workflow.add_edge("compile_report", END)
        workflow.add_edge("handle_error", END)
        
        return workflow
    
    def _validate_input(self, state: MaintenanceState) -> Dict[str, Any]:
        """Validate input sensor reading"""
        logger.info("Validating input", machine_id=state.get("machine_id"))
        
        sensor_data = state.get("sensor_reading", {})
        
        required_fields = ["air_temperature", "process_temperature", "rotational_speed", "torque", "tool_wear"]
        missing_fields = [f for f in required_fields if f not in sensor_data]
        
        if missing_fields:
            return {
                "current_step": "validate_input",
                "error": f"Missing required fields: {missing_fields}"
            }
        
        return {
            "current_step": "validate_input",
            "error": None
        }
    
    def _check_validation(self, state: MaintenanceState) -> str:
        """Check if validation passed"""
        return "invalid" if state.get("error") else "valid"
    
    def _run_prediction(self, state: MaintenanceState) -> Dict[str, Any]:
        """Run ML model prediction"""
        logger.info("Running prediction", machine_id=state.get("machine_id"))
        
        sensor_data = state["sensor_reading"]
        
        # Calculate derived features
        temp_diff = sensor_data["process_temperature"] - sensor_data["air_temperature"]
        power = 2 * 3.14159 * sensor_data["rotational_speed"] * sensor_data["torque"] / 60
        
        # Simple heuristic prediction
        risk_score = 0.0
        risk_score += min(sensor_data["tool_wear"] / 250, 0.4)
        risk_score += min(max(temp_diff - 8, 0) / 12, 0.3)
        risk_score += min(power / 15000, 0.3)
        
        if risk_score > 0.7:
            risk_level = "critical"
        elif risk_score > 0.5:
            risk_level = "high"
        elif risk_score > 0.3:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        prediction_dict = {
            "machine_id": state["machine_id"],
            "failure_probability": min(risk_score, 0.99),
            "risk_level": risk_level,
            "confidence": 0.85,
            "feature_importance": {
                "tool_wear": 0.35,
                "temp_diff": 0.25,
                "power": 0.20,
                "torque": 0.10,
                "rotational_speed": 0.10
            },
            "temp_diff": temp_diff,
            "power": power
        }
        
        return {
            "current_step": "run_prediction",
            "prediction_result": prediction_dict
        }
    
    def _fetch_knowledge(self, state: MaintenanceState) -> Dict[str, Any]:
        """Fetch relevant knowledge from RAG system"""
        logger.info("Fetching knowledge context", machine_id=state.get("machine_id"))
        
        prediction = state.get("prediction_result", {})
        sensor_data = state["sensor_reading"]
        
        # Build context based on conditions
        context_parts = []
        
        if sensor_data["tool_wear"] > 150:
            context_parts.append("Tool wear is high - monitor for Tool Wear Failure (TWF). Tools should be replaced when wear approaches 200 minutes.")
        
        temp_diff = prediction.get("temp_diff", sensor_data["process_temperature"] - sensor_data["air_temperature"])
        if temp_diff < 8.6:
            context_parts.append("Temperature differential is low - risk of Heat Dissipation Failure (HDF). Check cooling system.")
        
        power = prediction.get("power", 0)
        if power < 3500 or power > 9000:
            context_parts.append("Power output is outside optimal range (3500-9000W) - risk of Power Failure (PWF).")
        
        if sensor_data["torque"] > 60:
            context_parts.append("High torque detected - monitor for Overstrain Failure (OSF).")
        
        if not context_parts:
            context_parts.append("All parameters within normal operating ranges.")
        
        context = "\n".join(context_parts)
        
        return {
            "current_step": "fetch_knowledge",
            "knowledge_context": context
        }
    
    def _assess_risk(self, state: MaintenanceState) -> Dict[str, Any]:
        """Assess risk using rule-based logic"""
        logger.info("Assessing risk", machine_id=state.get("machine_id"))
        
        prediction = state.get("prediction_result", {})
        sensor_data = state["sensor_reading"]
        
        # Identify concerns
        concerns = []
        factors = []
        
        if sensor_data["tool_wear"] > 180:
            concerns.append("Critical tool wear level")
            factors.append("tool_wear")
        elif sensor_data["tool_wear"] > 120:
            concerns.append("Elevated tool wear")
            factors.append("tool_wear")
        
        temp_diff = prediction.get("temp_diff", 10)
        if temp_diff < 8.6:
            concerns.append("Insufficient heat dissipation")
            factors.append("temperature_differential")
        elif temp_diff > 15:
            concerns.append("High temperature differential")
            factors.append("temperature_differential")
        
        power = prediction.get("power", 5000)
        if power > 9000:
            concerns.append("Excessive power consumption")
            factors.append("power_output")
        elif power < 3500:
            concerns.append("Low power output")
            factors.append("power_output")
        
        if sensor_data["torque"] > 60:
            concerns.append("High torque stress")
            factors.append("torque")
        
        assessment = {
            "risk_level": prediction.get("risk_level", "medium"),
            "primary_concerns": concerns if concerns else ["No immediate concerns"],
            "contributing_factors": factors if factors else ["normal_operation"],
            "confidence": prediction.get("confidence", 0.85)
        }
        
        return {
            "current_step": "assess_risk",
            "risk_assessment": assessment
        }
    
    def _check_risk_level(self, state: MaintenanceState) -> str:
        """Check if risk level requires alert"""
        assessment = state.get("risk_assessment", {})
        risk_level = assessment.get("risk_level", "low")
        
        if risk_level in ["high", "critical"]:
            return "high_risk"
        return "normal"
    
    def _create_alert(self, state: MaintenanceState) -> Dict[str, Any]:
        """Create maintenance alert"""
        logger.info("Creating alert", machine_id=state.get("machine_id"))
        
        prediction = state.get("prediction_result", {})
        assessment = state.get("risk_assessment", {})
        
        severity = "critical" if assessment.get("risk_level") == "critical" else "high"
        
        alert = {
            "alert_id": f"ALT-{state['machine_id']}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "machine_id": state["machine_id"],
            "severity": severity,
            "title": f"{severity.upper()} Risk Alert: Machine {state['machine_id']}",
            "description": f"ML prediction: {prediction.get('failure_probability', 0):.1%} failure probability. "
                          f"Concerns: {', '.join(assessment.get('primary_concerns', [])[:3])}",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return {
            "current_step": "create_alert",
            "alert": alert
        }
    
    def _generate_recommendations(self, state: MaintenanceState) -> Dict[str, Any]:
        """Generate maintenance recommendations"""
        logger.info("Generating recommendations", machine_id=state.get("machine_id"))
        
        assessment = state.get("risk_assessment", {})
        prediction = state.get("prediction_result", {})
        sensor_data = state["sensor_reading"]
        
        # Generate recommendations based on risk assessment
        actions = []
        safety_notes = ["Follow lockout/tagout procedures", "Wear appropriate PPE"]
        
        if sensor_data["tool_wear"] > 150:
            actions.append("Replace cutting tool - wear exceeds safe threshold")
        
        temp_diff = prediction.get("temp_diff", 10)
        if temp_diff < 8.6 or temp_diff > 15:
            actions.append("Inspect and service cooling system")
        
        power = prediction.get("power", 5000)
        if power < 3500 or power > 9000:
            actions.append("Check motor and drive components")
        
        if sensor_data["torque"] > 60:
            actions.append("Reduce load and check for overstrain conditions")
        
        # Add general recommendations
        actions.append("Document current conditions for trend analysis")
        actions.append("Review maintenance logs for patterns")
        
        # Determine timeframe and downtime
        risk_level = assessment.get("risk_level", "medium")
        if risk_level == "critical":
            timeframe = "Immediate - within 1 hour"
            downtime = 4.0
        elif risk_level == "high":
            timeframe = "Urgent - within 4 hours"
            downtime = 3.0
        elif risk_level == "medium":
            timeframe = "Soon - within 24 hours"
            downtime = 2.0
        else:
            timeframe = "Scheduled - next maintenance window"
            downtime = 1.0
        
        recommendation = {
            "machine_id": state["machine_id"],
            "priority": risk_level,
            "recommended_actions": actions[:5],
            "estimated_downtime_hours": downtime,
            "recommended_timeframe": timeframe,
            "safety_notes": safety_notes,
            "confidence_score": assessment.get("confidence", 0.85),
            "estimated_cost": settings.ml.maintenance_cost * (1.5 if risk_level == "critical" else 1.0)
        }
        
        return {
            "current_step": "generate_recommendations",
            "recommendation": recommendation
        }
    
    def _compile_report(self, state: MaintenanceState) -> Dict[str, Any]:
        """Compile final maintenance report"""
        logger.info("Compiling report", machine_id=state.get("machine_id"))
        
        prediction = state.get("prediction_result", {})
        assessment = state.get("risk_assessment", {})
        recommendation = state.get("recommendation", {})
        alert = state.get("alert")
        sensor_data = state["sensor_reading"]
        knowledge = state.get("knowledge_context", "")
        
        temp_diff = prediction.get("temp_diff", sensor_data["process_temperature"] - sensor_data["air_temperature"])
        
        report = f"""
================================================================================
                    MAINTENANCE ANALYSIS REPORT
================================================================================
Machine ID: {state['machine_id']}
Generated: {datetime.utcnow().isoformat()}

--------------------------------------------------------------------------------
                         EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Risk Level:           {assessment.get('risk_level', 'Unknown').upper()}
Failure Probability:  {prediction.get('failure_probability', 0):.1%}
Confidence:           {assessment.get('confidence', 0):.1%}
Priority:             {recommendation.get('priority', 'medium').upper()}

--------------------------------------------------------------------------------
                         SENSOR READINGS
--------------------------------------------------------------------------------
Air Temperature:      {sensor_data['air_temperature']}K
Process Temperature:  {sensor_data['process_temperature']}K
Temperature Diff:     {temp_diff:.1f}K {'⚠️ LOW' if temp_diff < 8.6 else '⚠️ HIGH' if temp_diff > 15 else '✓'}
Rotational Speed:     {sensor_data['rotational_speed']} RPM
Torque:               {sensor_data['torque']} Nm {'⚠️' if sensor_data['torque'] > 60 else '✓'}
Power Output:         {prediction.get('power', 0):.0f}W
Tool Wear:            {sensor_data['tool_wear']} min {'🔴 CRITICAL' if sensor_data['tool_wear'] > 200 else '🟠 HIGH' if sensor_data['tool_wear'] > 150 else '✓'}

--------------------------------------------------------------------------------
                         RISK ASSESSMENT
--------------------------------------------------------------------------------
Primary Concerns:
{chr(10).join(f"  • {c}" for c in assessment.get('primary_concerns', ['None']))}

Contributing Factors:
{chr(10).join(f"  • {f}" for f in assessment.get('contributing_factors', ['None']))}

Knowledge Context:
{knowledge}

--------------------------------------------------------------------------------
                       RECOMMENDED ACTIONS
--------------------------------------------------------------------------------
Timeframe:            {recommendation.get('recommended_timeframe', 'As scheduled')}
Estimated Downtime:   {recommendation.get('estimated_downtime_hours', 0)} hours
Estimated Cost:       ${recommendation.get('estimated_cost', 0):,.2f}

Actions:
{chr(10).join(f"  {i+1}. {a}" for i, a in enumerate(recommendation.get('recommended_actions', [])))}

Safety Notes:
{chr(10).join(f"  • {n}" for n in recommendation.get('safety_notes', []))}

{'--------------------------------------------------------------------------------' + chr(10) + '                         ⚠️ ALERT GENERATED' + chr(10) + '--------------------------------------------------------------------------------' + chr(10) + f"Alert ID:    {alert['alert_id']}" + chr(10) + f"Severity:    {alert['severity'].upper()}" + chr(10) + f"Description: {alert['description']}" + chr(10) if alert else ''}
================================================================================
          Report generated by Enterprise Predictive Maintenance System
================================================================================
"""
        
        return {
            "current_step": "compile_report",
            "final_report": report,
            "completed": True
        }
    
    def _handle_error(self, state: MaintenanceState) -> Dict[str, Any]:
        """Handle workflow errors"""
        logger.error("Workflow error", error=state.get("error"))
        
        return {
            "current_step": "error",
            "completed": True,
            "final_report": f"Error in maintenance analysis: {state.get('error')}"
        }
    
    def run(
        self,
        machine_id: str,
        sensor_reading: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Run the maintenance analysis workflow"""
        
        initial_state = {
            "sensor_reading": sensor_reading,
            "machine_id": machine_id,
            "prediction_result": None,
            "knowledge_context": None,
            "risk_assessment": None,
            "recommendation": None,
            "alert": None,
            "final_report": None,
            "current_step": "start",
            "error": None,
            "completed": False
        }
        
        # Run workflow
        final_state = self.app.invoke(initial_state)
        
        return {
            "machine_id": machine_id,
            "prediction": final_state.get("prediction_result"),
            "risk_assessment": final_state.get("risk_assessment"),
            "recommendation": final_state.get("recommendation"),
            "alert": final_state.get("alert"),
            "report": final_state.get("final_report"),
            "completed": final_state.get("completed"),
            "error": final_state.get("error")
        }


# Convenience function for quick workflow execution
def analyze_machine(
    machine_id: str,
    sensor_data: Dict[str, Any],
    model=None
) -> Dict[str, Any]:
    """Quick function to run maintenance analysis workflow"""
    workflow = MaintenanceWorkflow(model=model)
    return workflow.run(machine_id, sensor_data)
