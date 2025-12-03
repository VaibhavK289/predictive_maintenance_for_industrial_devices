"""
Enterprise Predictive Maintenance - Main Entry Point
"""
import os
import sys
import argparse
import structlog
from pathlib import Path

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.dev.ConsoleRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


def train_command(args):
    """Train the ML model"""
    import pandas as pd
    from ml.engine import PredictiveMaintenanceModel
    from schemas.models import TrainingConfig
    from config.settings import get_settings
    
    settings = get_settings()
    
    logger.info("Starting model training", model_type=args.model_type)
    
    # Load data
    if args.data_path:
        data_path = args.data_path
    else:
        data_path = os.path.join(settings.ml.training_data_path, "predictive_maintenance.csv")
    
    if not os.path.exists(data_path):
        logger.error("Training data not found", path=data_path)
        sys.exit(1)
    
    data = pd.read_csv(data_path)
    logger.info("Loaded training data", samples=len(data))
    
    # Create config
    config = TrainingConfig(
        model_type=args.model_type,
        cross_validation=args.cross_validate,
        handle_imbalance=args.balance_classes
    )
    
    # Train model
    model = PredictiveMaintenanceModel(model_type=args.model_type)
    metrics = model.train(data, config)
    
    # Save model
    output_path = args.output or os.path.join(settings.ml.model_path, "latest_model.joblib")
    model.save(output_path)
    
    logger.info(
        "Training complete",
        accuracy=metrics.accuracy,
        auc_roc=metrics.auc_roc,
        f1_score=metrics.f1_score,
        output_path=output_path
    )
    
    print(f"\n{'='*50}")
    print("Training Results")
    print(f"{'='*50}")
    print(f"Model Type: {metrics.model_type}")
    print(f"Accuracy: {metrics.accuracy:.4f}")
    print(f"Precision: {metrics.precision:.4f}")
    print(f"Recall: {metrics.recall:.4f}")
    print(f"F1 Score: {metrics.f1_score:.4f}")
    print(f"AUC-ROC: {metrics.auc_roc:.4f}")
    print(f"Cost-Benefit Score: ${metrics.cost_benefit_score:,.2f}")
    print(f"{'='*50}")


def serve_command(args):
    """Start the API server"""
    from api.server import start_server
    
    logger.info("Starting API server", host=args.host, port=args.port)
    start_server(host=args.host, port=args.port, reload=args.reload)


def predict_command(args):
    """Make a single prediction"""
    from ml.engine import PredictiveMaintenanceModel
    from schemas.models import SensorReading
    from config.settings import get_settings
    
    settings = get_settings()
    
    # Load model
    model_path = args.model or os.path.join(settings.ml.model_path, "latest_model.joblib")
    
    if not os.path.exists(model_path):
        logger.error("Model not found", path=model_path)
        print("Model not found. Please train a model first using: python main.py train")
        sys.exit(1)
    
    model = PredictiveMaintenanceModel.load(model_path)
    
    # Create sensor reading
    reading = SensorReading(
        machine_id=args.machine_id,
        machine_type=args.machine_type,
        air_temperature=args.air_temp,
        process_temperature=args.process_temp,
        rotational_speed=args.rpm,
        torque=args.torque,
        tool_wear=args.tool_wear
    )
    
    # Make prediction
    result = model.predict(reading)
    
    print(f"\n{'='*50}")
    print(f"Prediction for Machine: {args.machine_id}")
    print(f"{'='*50}")
    print(f"Failure Probability: {result.failure_probability:.1%}")
    print(f"Risk Level: {result.risk_level.upper()}")
    print(f"Confidence: {result.confidence:.1%}")
    print(f"\nTop Contributing Factors:")
    for factor, importance in sorted(result.feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  - {factor}: {importance:.1%}")
    print(f"{'='*50}")


def analyze_command(args):
    """Run full analysis with agents"""
    from ml.engine import PredictiveMaintenanceModel
    from orchestration.workflow import MaintenanceWorkflow
    from rag.knowledge_base import MaintenanceKnowledgeBase
    from config.settings import get_settings
    
    settings = get_settings()
    
    # Load model
    model_path = args.model or os.path.join(settings.ml.model_path, "latest_model.joblib")
    model = None
    if os.path.exists(model_path):
        model = PredictiveMaintenanceModel.load(model_path)
    
    # Initialize knowledge base
    kb = MaintenanceKnowledgeBase()
    if kb.get_stats()["document_count"] == 0:
        kb.initialize_with_default_knowledge()
    
    # Create workflow
    workflow = MaintenanceWorkflow(model=model, knowledge_base=kb)
    
    # Prepare sensor data
    sensor_data = {
        "machine_type": args.machine_type,
        "air_temperature": args.air_temp,
        "process_temperature": args.process_temp,
        "rotational_speed": args.rpm,
        "torque": args.torque,
        "tool_wear": args.tool_wear
    }
    
    # Run analysis
    result = workflow.run(args.machine_id, sensor_data)
    
    print("\n" + result.get("report", "Analysis failed"))


def init_knowledge_command(args):
    """Initialize the knowledge base"""
    from rag.knowledge_base import MaintenanceKnowledgeBase
    
    logger.info("Initializing knowledge base")
    
    kb = MaintenanceKnowledgeBase()
    
    if args.clear:
        kb.clear()
        logger.info("Knowledge base cleared")
    
    kb.initialize_with_default_knowledge()
    kb.persist()
    
    stats = kb.get_stats()
    print(f"\nKnowledge base initialized:")
    print(f"  Documents: {stats['document_count']}")
    print(f"  Location: {stats['persist_directory']}")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Enterprise Predictive Maintenance System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Train a model
  python main.py train --model-type ensemble
  
  # Start API server
  python main.py serve --port 8000
  
  # Make a prediction
  python main.py predict --machine-id M001 --tool-wear 150 --air-temp 300 --process-temp 310 --rpm 1500 --torque 40
  
  # Run full analysis
  python main.py analyze --machine-id M001 --tool-wear 200 --air-temp 298 --process-temp 312 --rpm 1400 --torque 45
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Train command
    train_parser = subparsers.add_parser("train", help="Train the ML model")
    train_parser.add_argument("--model-type", choices=["ensemble", "xgboost", "lightgbm", "catboost", "random_forest"], default="ensemble")
    train_parser.add_argument("--data-path", help="Path to training CSV file")
    train_parser.add_argument("--output", help="Output path for trained model")
    train_parser.add_argument("--cross-validate", action="store_true", help="Enable cross-validation")
    train_parser.add_argument("--balance-classes", action="store_true", help="Balance classes using SMOTE")
    
    # Serve command
    serve_parser = subparsers.add_parser("serve", help="Start the API server")
    serve_parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    serve_parser.add_argument("--port", type=int, default=8000, help="Port to listen on")
    serve_parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    
    # Predict command
    predict_parser = subparsers.add_parser("predict", help="Make a prediction")
    predict_parser.add_argument("--machine-id", required=True, help="Machine identifier")
    predict_parser.add_argument("--machine-type", default="M", choices=["H", "L", "M"], help="Machine type")
    predict_parser.add_argument("--air-temp", type=float, required=True, help="Air temperature (K)")
    predict_parser.add_argument("--process-temp", type=float, required=True, help="Process temperature (K)")
    predict_parser.add_argument("--rpm", type=float, required=True, help="Rotational speed (RPM)")
    predict_parser.add_argument("--torque", type=float, required=True, help="Torque (Nm)")
    predict_parser.add_argument("--tool-wear", type=float, required=True, help="Tool wear (min)")
    predict_parser.add_argument("--model", help="Path to model file")
    
    # Analyze command
    analyze_parser = subparsers.add_parser("analyze", help="Run full analysis")
    analyze_parser.add_argument("--machine-id", required=True, help="Machine identifier")
    analyze_parser.add_argument("--machine-type", default="M", choices=["H", "L", "M"], help="Machine type")
    analyze_parser.add_argument("--air-temp", type=float, required=True, help="Air temperature (K)")
    analyze_parser.add_argument("--process-temp", type=float, required=True, help="Process temperature (K)")
    analyze_parser.add_argument("--rpm", type=float, required=True, help="Rotational speed (RPM)")
    analyze_parser.add_argument("--torque", type=float, required=True, help="Torque (Nm)")
    analyze_parser.add_argument("--tool-wear", type=float, required=True, help="Tool wear (min)")
    analyze_parser.add_argument("--model", help="Path to model file")
    
    # Init knowledge command
    init_kb_parser = subparsers.add_parser("init-knowledge", help="Initialize knowledge base")
    init_kb_parser.add_argument("--clear", action="store_true", help="Clear existing knowledge")
    
    args = parser.parse_args()
    
    if args.command is None:
        parser.print_help()
        sys.exit(0)
    
    # Execute command
    if args.command == "train":
        train_command(args)
    elif args.command == "serve":
        serve_command(args)
    elif args.command == "predict":
        predict_command(args)
    elif args.command == "analyze":
        analyze_command(args)
    elif args.command == "init-knowledge":
        init_knowledge_command(args)


if __name__ == "__main__":
    main()
