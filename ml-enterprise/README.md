# Enterprise Predictive Maintenance ML System

An enterprise-grade predictive maintenance system combining advanced machine learning with AI-powered analysis for industrial equipment monitoring and failure prediction.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Usage](#usage)
8. [API Reference](#api-reference)
9. [Machine Learning Models](#machine-learning-models)
10. [RAG Knowledge Base](#rag-knowledge-base)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Performance](#performance)
14. [Troubleshooting](#troubleshooting)
15. [Contributing](#contributing)

---

## Overview

This system provides real-time predictive maintenance capabilities for industrial machinery. It combines ensemble machine learning models with a Retrieval-Augmented Generation (RAG) knowledge base to deliver accurate failure predictions and actionable maintenance recommendations.

### Key Features

- Real-time failure prediction using ensemble ML models
- RAG-based knowledge retrieval for maintenance context
- Multi-endpoint REST API with FastAPI
- Heuristic fallback predictions when models are unavailable
- Batch prediction support for multiple machines
- Comprehensive maintenance recommendations
- Background model training capabilities
- Health monitoring and status endpoints

---

## Architecture

```
ml-enterprise/
|-- main.py                     # CLI entry point and orchestration
|-- requirements.txt            # Python dependencies
|-- Dockerfile                  # Container configuration
|-- docker-compose.yml          # Multi-container orchestration
|-- .env.example                # Environment template
|
|-- config/
|   |-- __init__.py
|   +-- settings.py             # Pydantic settings management
|
|-- schemas/
|   |-- __init__.py
|   +-- models.py               # Pydantic data models and validation
|
|-- ml/
|   |-- __init__.py
|   +-- engine.py               # ML training and prediction engine
|
|-- rag/
|   |-- __init__.py
|   +-- knowledge_base.py       # ChromaDB vector store and retrieval
|
|-- agents/
|   |-- __init__.py
|   +-- crew.py                 # Multi-agent analysis system
|
|-- orchestration/
|   |-- __init__.py
|   +-- workflow.py             # State machine workflows
|
|-- api/
|   |-- __init__.py
|   +-- server.py               # FastAPI REST endpoints
|
|-- models/
|   +-- latest_model.joblib     # Trained model artifacts
|
|-- data/
|   +-- predictive_maintenance.csv  # Training dataset
|
+-- tests/
    |-- __init__.py
    |-- test_api.py             # API endpoint tests
    +-- test_integration.py     # End-to-end integration tests
```

### System Flow

```
Sensor Data Input
        |
        v
+-------------------+
|   FastAPI Server  |
+-------------------+
        |
        +------------------------+
        |                        |
        v                        v
+---------------+      +------------------+
|  ML Engine    |      | Knowledge Base   |
| (Prediction)  |      | (RAG Retrieval)  |
+---------------+      +------------------+
        |                        |
        +------------------------+
                    |
                    v
        +-------------------+
        |  Recommendations  |
        +-------------------+
                    |
                    v
           Response to Client
```

---

## Technology Stack

### Core ML Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| XGBoost | 2.0+ | Gradient boosting classifier |
| LightGBM | 4.0+ | Light gradient boosting |
| CatBoost | 1.2+ | Categorical boosting |
| Scikit-learn | 1.3+ | ML utilities and preprocessing |
| Imbalanced-learn | 0.11+ | Handling class imbalance |

### AI and RAG

| Library | Version | Purpose |
|---------|---------|---------|
| ChromaDB | 0.4+ | Vector database for embeddings |
| Sentence-Transformers | 2.2+ | Text embeddings generation |
| LangChain | 0.1+ | LLM integration framework |
| LangGraph | 0.0.20+ | State machine workflows |

### API and Infrastructure

| Library | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.109+ | REST API framework |
| Uvicorn | 0.27+ | ASGI server |
| Pydantic | 2.5+ | Data validation |
| Structlog | 24.1+ | Structured logging |

---

## Prerequisites

### System Requirements

- Python 3.10 or higher
- 4GB RAM minimum (8GB recommended)
- 2GB disk space for models and data

### Software Dependencies

- pip (Python package manager)
- Virtual environment support (venv or conda)
- Git for version control

### Verify Prerequisites

```bash
# Check Python version
python --version

# Check pip version
pip --version
```

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd ml-enterprise
```

### Step 2: Create Virtual Environment

Windows PowerShell:
```powershell
python -m venv predictive_maintenance_env
.\predictive_maintenance_env\Scripts\Activate.ps1
```

Linux/macOS:
```bash
python -m venv predictive_maintenance_env
source predictive_maintenance_env/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see Configuration section).

### Step 5: Train the Model

```bash
python main.py train --model-type ensemble --balance-classes
```

### Step 6: Start the Server

```bash
python main.py serve --port 8000
```

The API will be available at `http://localhost:8000`

---

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false

# ML Configuration
MODEL_PATH=./models
TRAINING_DATA_PATH=./data
MODEL_TYPE=ensemble

# Cost Configuration
MAINTENANCE_COST=2050
FAILURE_COST=10300

# Vector Database
CHROMA_PERSIST_DIR=./chroma_db
COLLECTION_NAME=maintenance_knowledge
```

### Configuration Reference

| Variable | Description | Default |
|----------|-------------|---------|
| API_HOST | Server bind address | 0.0.0.0 |
| API_PORT | Server port | 8000 |
| DEBUG | Enable debug mode | false |
| MODEL_PATH | Model storage directory | ./models |
| TRAINING_DATA_PATH | Training data directory | ./data |
| MODEL_TYPE | ML model type | ensemble |
| MAINTENANCE_COST | Cost of maintenance | 2050 |
| FAILURE_COST | Cost of failure | 10300 |
| CHROMA_PERSIST_DIR | ChromaDB storage | ./chroma_db |
| COLLECTION_NAME | Vector collection name | maintenance_knowledge |

---

## Usage

### Command Line Interface

The `main.py` script provides a CLI for common operations:

#### Train Model

```bash
# Train ensemble model with class balancing
python main.py train --model-type ensemble --balance-classes

# Train specific model type
python main.py train --model-type xgboost

# Train with cross-validation
python main.py train --model-type lightgbm --cross-validate
```

Available model types:
- `ensemble` (recommended) - Combines XGBoost, LightGBM, CatBoost
- `xgboost` - XGBoost only
- `lightgbm` - LightGBM only
- `catboost` - CatBoost only

#### Start API Server

```bash
# Start server on default port
python main.py serve

# Start with custom port
python main.py serve --port 8080

# Start with auto-reload (development)
python main.py serve --port 8000 --reload
```

#### Make Prediction

```bash
python main.py predict \
    --machine-id M001 \
    --machine-type M \
    --air-temp 298.5 \
    --process-temp 308.7 \
    --rpm 1500 \
    --torque 42.3 \
    --tool-wear 150
```

---

## API Reference

### Base URL

```
http://localhost:8000
```

### System Endpoints

#### GET /

Root endpoint with API information.

**Response:**
```json
{
    "name": "Enterprise Predictive Maintenance API",
    "version": "1.0.0",
    "status": "running",
    "model_trained": true,
    "endpoints": {
        "health": "/health",
        "predict": "/api/predict",
        "analyze": "/api/analyze",
        "train": "/api/train",
        "knowledge": "/api/knowledge"
    }
}
```

---

#### GET /health

System health check.

**Response:**
```json
{
    "status": "healthy",
    "version": "1.0.0",
    "model_loaded": true,
    "knowledge_base_ready": true,
    "agents_initialized": true
}
```

---

### Prediction Endpoints

#### POST /api/predict

Make a failure prediction for a machine.

**Request Body:**
```json
{
    "machine_id": "M001",
    "machine_type": "M",
    "air_temperature": 298.5,
    "process_temperature": 308.7,
    "rotational_speed": 1500,
    "torque": 42.3,
    "tool_wear": 150
}
```

**Response:**
```json
{
    "machine_id": "M001",
    "failure_probability": 0.23,
    "risk_level": "medium",
    "confidence": 0.85,
    "feature_importance": {
        "tool_wear": 0.35,
        "temperature_diff": 0.25,
        "power": 0.20,
        "torque": 0.10,
        "rotational_speed": 0.10
    },
    "prediction_time": "2025-12-03T10:30:00Z",
    "model_type": "ensemble"
}
```

---

#### POST /api/predict/quick

Heuristic-based prediction without ML model.

**Request Body:** Same as `/api/predict`

**Response:** Same format as `/api/predict` with `model_type: "heuristic"`

---

#### POST /api/predict/batch

Batch predictions for multiple machines.

**Request Body:**
```json
{
    "readings": [
        {
            "machine_id": "M001",
            "machine_type": "M",
            "air_temperature": 298.5,
            "process_temperature": 308.7,
            "rotational_speed": 1500,
            "torque": 42.3,
            "tool_wear": 150
        },
        {
            "machine_id": "M002",
            "machine_type": "L",
            "air_temperature": 300.0,
            "process_temperature": 312.5,
            "rotational_speed": 1400,
            "torque": 50.0,
            "tool_wear": 200
        }
    ]
}
```

**Response:**
```json
{
    "predictions": [...],
    "count": 2,
    "timestamp": "2025-12-03T10:30:00Z"
}
```

---

### Analysis Endpoints

#### POST /api/analyze

Full machine analysis with recommendations.

**Request Body:** Same as `/api/predict`

**Response:**
```json
{
    "machine_id": "M001",
    "prediction": {...},
    "analysis": {
        "temperature_differential": 10.2,
        "power_output": 6597.0,
        "concerns": [
            "High tool wear - replacement recommended"
        ],
        "knowledge_context": "...",
        "recommendations": [...]
    },
    "timestamp": "2025-12-03T10:30:00Z"
}
```

---

#### POST /api/recommendations

Get maintenance recommendations.

**Request Body:** Same as `/api/predict`

**Response:**
```json
{
    "machine_id": "M001",
    "prediction": {...},
    "recommendations": [
        {
            "action": "Replace cutting tool immediately",
            "priority": "critical",
            "timeframe": "within 1 hour"
        },
        {
            "action": "Check cooling system",
            "priority": "high",
            "timeframe": "within 4 hours"
        }
    ],
    "estimated_cost": 2050,
    "timestamp": "2025-12-03T10:30:00Z"
}
```

---

### Knowledge Base Endpoints

#### GET /api/knowledge/stats

Get knowledge base statistics.

**Response:**
```json
{
    "status": "initialized",
    "document_count": 10,
    "collection_name": "maintenance_knowledge"
}
```

---

#### GET /api/knowledge/query?query=tool+wear

Query the knowledge base.

**Parameters:**
- `query` (required): Search query
- `n_results` (optional): Number of results (default: 5)

**Response:**
```json
{
    "query": "tool wear",
    "documents": [
        {
            "content": "Tool wear monitoring is critical...",
            "metadata": {...},
            "relevance_score": 0.92
        }
    ],
    "count": 3
}
```

---

### Training Endpoints

#### POST /api/train

Trigger model training (runs in background).

**Parameters:**
- `model_type` (optional): Model type (default: ensemble)
- `balance_classes` (optional): Handle imbalance (default: true)

**Response:**
```json
{
    "status": "training_started",
    "message": "Model training started in background",
    "model_type": "ensemble",
    "data_path": "./data/predictive_maintenance.csv"
}
```

---

#### GET /api/model/status

Get current model status.

**Response:**
```json
{
    "status": "initialized",
    "trained": true,
    "model_type": "ensemble",
    "model_id": "abc123",
    "version": "1.0.0",
    "training_metrics": {
        "accuracy": 0.42,
        "f1_score": 0.06,
        "auc_roc": 0.50
    }
}
```

---

## Machine Learning Models

### Ensemble Architecture

The system uses a voting ensemble combining three gradient boosting algorithms:

1. **XGBoost** - Extreme Gradient Boosting
   - Regularization to prevent overfitting
   - Handles missing values
   - Fast training on large datasets

2. **LightGBM** - Light Gradient Boosting Machine
   - Histogram-based algorithm
   - Memory efficient
   - Handles categorical features

3. **CatBoost** - Categorical Boosting
   - Native categorical feature support
   - Reduced overfitting
   - Ordered boosting

### Feature Engineering

The model uses the following engineered features:

| Feature | Formula | Description |
|---------|---------|-------------|
| temperature_diff | process_temp - air_temp | Temperature differential |
| power | 2 * pi * rpm * torque / 60 | Power output in watts |
| tool_wear_ratio | tool_wear / 250 | Normalized tool wear |
| heat_dissipation_issue | temp_diff < 8.6 | Cooling flag |
| overstrain | torque * rpm > threshold | Overstrain indicator |

### Class Imbalance Handling

The dataset has significant class imbalance (3.4% failure rate). The system uses:

- SMOTE (Synthetic Minority Over-sampling Technique)
- Class weights in model training
- Cost-sensitive threshold optimization

### Threshold Optimization

The prediction threshold is optimized based on cost:

```
Optimal Threshold = Maintenance Cost / (Maintenance Cost + Failure Cost)
                  = 2050 / (2050 + 10300)
                  = 0.166
```

---

## RAG Knowledge Base

### Overview

The RAG (Retrieval-Augmented Generation) system uses ChromaDB to store and retrieve maintenance knowledge. It provides contextual information for predictions and recommendations.

### Default Knowledge Documents

The system initializes with 10 knowledge documents covering:

1. Preventive maintenance scheduling
2. Tool wear analysis guidelines
3. Temperature management procedures
4. Power consumption monitoring
5. Failure mode identification
6. Emergency response protocols
7. Calibration procedures
8. Lubrication schedules
9. Safety guidelines
10. Troubleshooting guides

### Adding Custom Knowledge

```python
from rag.knowledge_base import MaintenanceKnowledgeBase

kb = MaintenanceKnowledgeBase()
kb.add_document(
    content="Custom maintenance procedure...",
    metadata={
        "type": "procedure",
        "category": "maintenance"
    }
)
```

### Querying Knowledge

```python
results = kb.query("tool replacement procedure", n_results=3)
for doc in results.documents:
    print(doc.content)
```

---

## Testing

### Running Tests

```bash
# Activate virtual environment
.\predictive_maintenance_env\Scripts\Activate.ps1  # Windows
source predictive_maintenance_env/bin/activate     # Linux/macOS

# Run API tests
python tests/test_api.py

# Run integration tests
python tests/test_integration.py

# Run all tests with pytest
pytest tests/ -v
```

### Test Coverage

The test suite covers:

- Health check endpoints
- Prediction endpoints (single and batch)
- Analysis endpoints
- Knowledge base operations
- Model status endpoints
- Error handling
- Response format validation
- Concurrent request handling

### Test Output

```
============================================================
  TEST SUMMARY
============================================================

Total Tests: 10
Passed: 9
Failed: 1
Success Rate: 90.0%
```

---

## Deployment

### Docker Deployment

Build the Docker image:

```bash
docker build -t predictive-maintenance-ml .
```

Run the container:

```bash
docker run -d \
    -p 8000:8000 \
    -v $(pwd)/models:/app/models \
    -v $(pwd)/data:/app/data \
    --name pm-ml-api \
    predictive-maintenance-ml
```

### Docker Compose

```bash
docker-compose up -d
```

### Production Checklist

1. Set `DEBUG=false` in environment
2. Configure proper CORS origins
3. Set up SSL/TLS termination
4. Configure logging to external service
5. Set up health check monitoring
6. Configure rate limiting
7. Set up backup for models and data

### Scaling Considerations

- Use multiple API instances behind a load balancer
- Consider Redis for caching predictions
- Use async workers for training tasks
- Monitor memory usage for large models

---

## Performance

### Metrics

| Metric | Value |
|--------|-------|
| Model Accuracy | ~42% |
| AUC-ROC | ~50% |
| F1 Score | ~6% |
| API Response Time | ~2 seconds |
| Batch Throughput | 5 readings/request |

Note: Model performance depends on training data quality and class balance handling.

### Optimization Tips

1. Use batch predictions for multiple machines
2. Enable model caching
3. Use async endpoints for long operations
4. Configure connection pooling for databases

---

## Troubleshooting

### Common Issues

**Issue: Model not loading**
```
Error: No pre-trained model found
```
Solution: Run `python main.py train` to train a model first.

**Issue: Knowledge base initialization fails**
```
Error: Could not initialize knowledge base
```
Solution: Ensure ChromaDB dependencies are installed and `chroma_db` directory is writable.

**Issue: Import errors**
```
ModuleNotFoundError: No module named 'xxx'
```
Solution: Ensure virtual environment is activated and all dependencies are installed.

**Issue: Port already in use**
```
Error: Address already in use
```
Solution: Change port with `--port` flag or stop the existing process.

### Logs

The system uses structured logging with structlog. Logs include:

- Request/response information
- Prediction details
- Training progress
- Error traces

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=true python main.py serve
```

---

## Contributing

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a virtual environment
4. Install development dependencies: `pip install -r requirements.txt`
5. Create a feature branch

### Code Style

- Follow PEP 8 guidelines
- Use type hints for function signatures
- Document functions with docstrings
- Write tests for new features

### Pull Request Process

1. Update documentation for new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update README if needed
5. Submit pull request with clear description

---

## Related Projects

- [epics-backend](../epics-backend/) - Legacy Node.js backend
- [predictive-care-next](../predictive-care-next/) - Next.js frontend
- [epics-frontend](../epics-frontend/) - Original React frontend
- [iot](../iot/) - Arduino IoT sensors
- [ML-Model](../ML-Model/) - Original Jupyter notebook
