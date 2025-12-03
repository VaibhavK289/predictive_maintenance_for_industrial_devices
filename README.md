# 🏭 Predictive Maintenance for Industrial Devices

A comprehensive enterprise-level IoT solution for predictive maintenance of industrial machinery, featuring real-time monitoring, machine learning predictions, and intelligent alerts.

## 📁 Project Structure

```
predictive_maintenance/
├── predictive-care-next/    # Next.js 16 Frontend (Modern UI)
├── ml-enterprise/           # Enterprise ML Backend (FastAPI + AI)
├── epics-frontend/          # Original React Frontend
├── epics-backend/           # Original Node.js Backend
├── iot/                     # Arduino IoT Sensor Code
└── ML-Model/                # Original ML Notebook
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (optional)

### 1. Start the ML Backend
```bash
cd ml-enterprise
python -m venv predictive_maintenance_env
.\predictive_maintenance_env\Scripts\Activate.ps1  # Windows
# source predictive_maintenance_env/bin/activate   # Linux/Mac

pip install -r requirements.txt
python main.py train --model-type ensemble
python main.py serve --port 8000
```

### 2. Start the Next.js Frontend
```bash
cd predictive-care-next
npm install
npm run dev
```

Visit: http://localhost:3000

## 🎯 Features

### Frontend (Next.js 16)
- ✨ Modern UI with Tailwind CSS v4
- 📊 Real-time Dashboard with Charts
- 🎨 Glass Morphism Design
- 📱 Fully Responsive
- ⚡ Framer Motion Animations

### ML Backend (FastAPI)
- 🤖 Ensemble ML Model (XGBoost, LightGBM, CatBoost)
- 🧠 RAG System with ChromaDB
- 📈 Real-time Predictions
- 🔧 Maintenance Recommendations
- 📊 Feature Importance Analysis

### API Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `POST /api/predict` | Get failure prediction |
| `POST /api/predict/batch` | Batch predictions |
| `POST /api/analyze` | Full machine analysis |
| `GET /api/recommendations` | Maintenance recommendations |
| `GET /api/knowledge/stats` | Knowledge base statistics |

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|-------------|
| Frontend | Next.js 16, React 19, Tailwind v4, Framer Motion |
| Backend | FastAPI, Uvicorn, Pydantic |
| ML | XGBoost, LightGBM, CatBoost, Scikit-learn |
| RAG | ChromaDB, Sentence-Transformers |
| IoT | Arduino, DHT Sensors |

## 📊 Model Performance

- **Model Type**: Ensemble (XGBoost + LightGBM + CatBoost)
- **Features**: Temperature, Rotational Speed, Torque, Tool Wear
- **Top Feature**: Tool Wear (35% importance)

## 🧪 Testing

```bash
cd ml-enterprise
python tests/test_api.py          # API tests
python tests/test_integration.py  # Integration tests
```

## 👥 Team

**Epics IoT Project Devs**

## 📄 License

MIT License
