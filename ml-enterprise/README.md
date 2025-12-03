# Enterprise Predictive Maintenance ML System

## 🚀 Overview

A state-of-the-art predictive maintenance system combining advanced machine learning with AI agents for industrial equipment monitoring and failure prediction.

### Key Technologies

| Technology | Purpose |
|------------|---------|
| **CrewAI** | Multi-agent orchestration for comprehensive maintenance analysis |
| **LangChain** | LLM integration and chain management |
| **LangGraph** | State machine workflows for complex analysis pipelines |
| **Gemini Pro** | Google's advanced LLM for intelligent recommendations |
| **Pydantic** | Data validation and settings management |
| **ChromaDB** | Vector database for RAG-based knowledge retrieval |
| **FastAPI** | High-performance REST API serving |
| **MLflow** | Experiment tracking and model registry |
| **XGBoost/LightGBM** | Ensemble models for accurate predictions |

## 📁 Project Structure

```
ml-enterprise/
├── main.py                 # CLI entry point
├── requirements.txt        # Python dependencies
├── README.md              # This file
│
├── config/
│   └── settings.py        # Pydantic settings management
│
├── schemas/
│   └── models.py          # Pydantic data models
│
├── ml/
│   └── engine.py          # Core ML training & prediction
│
├── rag/
│   └── knowledge_base.py  # ChromaDB vector store
│
├── agents/
│   └── crew.py            # CrewAI multi-agent system
│
├── orchestration/
│   └── workflow.py        # LangGraph state machines
│
└── api/
    └── server.py          # FastAPI REST endpoints
```

## 🔧 Installation

### Prerequisites

- Python 3.10+
- Google Cloud API key (for Gemini Pro)
- PostgreSQL (optional, for production)

### Setup

```bash
# Navigate to project directory
cd ml-enterprise

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Windows PowerShell:
$env:GOOGLE_API_KEY = "your-api-key-here"
# Linux/Mac:
export GOOGLE_API_KEY="your-api-key-here"
```

## 🚀 Quick Start

### 1. Train the Model

```bash
# Train with ensemble model (recommended)
python main.py train --model-type ensemble --balance-classes

# Train with specific model
python main.py train --model-type xgboost --cross-validate
```

### 2. Start the API Server

```bash
# Start server
python main.py serve --port 8000

# With auto-reload for development
python main.py serve --port 8000 --reload
```

### 3. Make Predictions

```bash
# CLI prediction
python main.py predict \
    --machine-id M001 \
    --machine-type M \
    --air-temp 298.5 \
    --process-temp 308.7 \
    --rpm 1500 \
    --torque 42.3 \
    --tool-wear 150

# API prediction
curl -X POST "http://localhost:8000/api/predict" \
    -H "Content-Type: application/json" \
    -d '{
        "machine_id": "M001",
        "machine_type": "M",
        "air_temperature": 298.5,
        "process_temperature": 308.7,
        "rotational_speed": 1500,
        "torque": 42.3,
        "tool_wear": 150
    }'
```

### 4. Run Full Analysis

```bash
# CLI analysis with AI agents
python main.py analyze \
    --machine-id M001 \
    --air-temp 300 \
    --process-temp 315 \
    --rpm 1400 \
    --torque 50 \
    --tool-wear 200

# API analysis
curl -X POST "http://localhost:8000/api/analyze" \
    -H "Content-Type: application/json" \
    -d '{
        "machine_id": "M001",
        "machine_type": "M",
        "air_temperature": 300,
        "process_temperature": 315,
        "rotational_speed": 1400,
        "torque": 50,
        "tool_wear": 200
    }'
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/api/predict` | POST | Single prediction |
| `/api/predict/batch` | POST | Batch predictions |
| `/api/predict/quick` | POST | Heuristic prediction (no model) |
| `/api/analyze` | POST | Full LangGraph workflow analysis |
| `/api/analyze/quick` | POST | Quick analysis without agents |
| `/api/analyze/crew` | POST | CrewAI multi-agent analysis |
| `/api/train` | POST | Train/retrain model |
| `/api/model/info` | GET | Current model information |
| `/api/knowledge/query` | GET | Query knowledge base |
| `/api/knowledge/add` | POST | Add to knowledge base |
| `/api/alerts/check` | POST | Check for alerts |

## 🤖 AI Agents (CrewAI)

The system includes four specialized AI agents:

1. **Data Analyst Agent**
   - Analyzes raw sensor data
   - Identifies anomalies and patterns
   - Expert in industrial metrics

2. **ML Prediction Specialist**
   - Interprets model outputs
   - Explains feature importance
   - Bridges ML to action

3. **Maintenance Expert**
   - Provides maintenance recommendations
   - Queries knowledge base
   - Safety-focused decisions

4. **Operations Coordinator**
   - Synthesizes all inputs
   - Generates comprehensive reports
   - Prioritizes actions

## 📚 RAG Knowledge Base

The ChromaDB-powered knowledge base includes:

- Preventive maintenance schedules
- Tool wear analysis guidelines
- Temperature management procedures
- Power consumption monitoring
- Emergency response protocols

Query the knowledge base:
```bash
curl "http://localhost:8000/api/knowledge/query?query=tool%20wear%20replacement"
```

## 🔄 LangGraph Workflow

The analysis workflow follows this state machine:

```
validate_input → run_prediction → fetch_knowledge → assess_risk
                                                         ↓
                                              [high risk] → create_alert
                                              [normal]   ↓
                                         generate_recommendations
                                                         ↓
                                                 compile_report → END
```

## 📈 Model Performance

The ensemble model achieves:

| Metric | Score |
|--------|-------|
| Accuracy | ~97% |
| AUC-ROC | ~99% |
| Precision | ~85% |
| Recall | ~75% |
| F1 Score | ~80% |

With cost-benefit optimization:
- Maintenance cost: $2,050
- Failure cost: $10,300
- Optimal threshold: ~0.20 (for cost minimization)

## 🛡️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Gemini Pro API key | Required |
| `DATABASE_URL` | PostgreSQL connection | localhost |
| `ML_MODEL_PATH` | Model storage path | ./models |
| `CHROMA_PERSIST_DIR` | ChromaDB storage | ./chroma_db |
| `MLFLOW_TRACKING_URI` | MLflow server | ./mlruns |

## 🐳 Docker Deployment

```dockerfile
# Build
docker build -t predictive-maintenance-ml .

# Run
docker run -p 8000:8000 \
    -e GOOGLE_API_KEY=your-key \
    predictive-maintenance-ml
```

## 📝 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

Built with ❤️ for predictive maintenance excellence.
