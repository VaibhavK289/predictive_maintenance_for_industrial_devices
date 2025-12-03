# Enterprise Predictive Maintenance ML System
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories for models and data
RUN mkdir -p /app/models /app/data /app/chroma_db /app/mlruns

# Set environment variables
ENV PYTHONPATH=/app
ENV ML_MODEL_PATH=/app/models
ENV CHROMA_PERSIST_DIR=/app/chroma_db
ENV MLFLOW_TRACKING_URI=/app/mlruns

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command
CMD ["python", "main.py", "serve", "--host", "0.0.0.0", "--port", "8000"]
