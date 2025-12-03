# EPICS Backend - Legacy Node.js API

A Node.js Express backend service for the Predictive Maintenance for Industrial Devices project. This service provides REST API endpoints to fetch sensor data from a PostgreSQL database and import CSV data.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [API Reference](#api-reference)
7. [Database Schema](#database-schema)
8. [Development](#development)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)

---

## Overview

This backend serves as the data layer for the Predictive Maintenance system. It provides:

- REST API endpoints for sensor data retrieval
- CSV file import functionality for batch data loading
- PostgreSQL database integration for persistent storage
- CORS-enabled endpoints for cross-origin requests

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 4.21.x |
| Database | PostgreSQL | 14+ |
| Database Driver | node-pg | 8.14.x |
| CSV Parser | csv-parser | 3.2.x |

---

## Architecture

```
epics-backend/
|-- index.js                    # Application entry point
|-- package.json                # Dependencies and scripts
|-- .env                        # Environment variables (not in repo)
|-- .gitignore                  # Git ignore rules
|-- LICENSE                     # MIT License
|-- README.md                   # This file
|
|-- controllers/
|   |-- sensor.controller.js    # Sensor data controller
|   +-- csvDB.controller.js     # CSV import controller
|
|-- db/
|   |-- pool.js                 # PostgreSQL connection pool
|   |-- queries.js              # Database query functions
|   +-- fetch.js                # Data fetching utilities
|
+-- routes/
    |-- sensor.route.js         # Sensor data routes
    +-- csv.route.js            # CSV import routes
```

### Request Flow

```
Client Request
     |
     v
Express Router (/api, /csv)
     |
     v
Controller (business logic)
     |
     v
Database Queries (db/queries.js)
     |
     v
PostgreSQL Database
     |
     v
Response to Client
```

---

## Prerequisites

Before installation, ensure you have:

1. Node.js 18 or higher installed
2. PostgreSQL 14 or higher running
3. A PostgreSQL database created for the project
4. Git for version control

### Verify Prerequisites

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL connection
psql --version
```

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Epics-IoT-Project-Devs/epics-backend.git
cd epics-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following variables:

```env
# Server Configuration
PORT=5000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=predictive_maintenance
```

### Step 4: Set Up the Database

Connect to PostgreSQL and create the required table:

```sql
CREATE TABLE IF NOT EXISTS process_data (
    id SERIAL PRIMARY KEY,
    type_h INTEGER DEFAULT 0,
    type_l INTEGER DEFAULT 0,
    type_m INTEGER DEFAULT 0,
    tool_wear FLOAT,
    rotation_speed FLOAT,
    torque FLOAT,
    air_temp FLOAT,
    process_temp FLOAT,
    temp_diff FLOAT,
    power FLOAT,
    prediction_label VARCHAR(50),
    prediction_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 5: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
node index.js
```

The server will start at `http://localhost:5000`

---

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port number | 5000 | No |
| DB_HOST | PostgreSQL host | localhost | Yes |
| DB_PORT | PostgreSQL port | 5432 | Yes |
| DB_USER | Database username | - | Yes |
| DB_PASSWORD | Database password | - | Yes |
| DB_NAME | Database name | - | Yes |

### CORS Configuration

CORS is enabled for all origins by default. To restrict origins, modify `index.js`:

```javascript
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-domain.com'],
    credentials: true
}));
```

---

## API Reference

### Base URL

```
http://localhost:5000
```

### Endpoints

#### GET /

Health check endpoint.

**Response:**
```json
{
    "message": "Sensors"
}
```

---

#### GET /api/

Retrieve all sensor data from the database.

**Response:**
```json
[
    {
        "id": 1,
        "type_h": 0,
        "type_l": 1,
        "type_m": 0,
        "tool_wear": 150.5,
        "rotation_speed": 1500,
        "torque": 42.3,
        "air_temp": 298.5,
        "process_temp": 308.7,
        "temp_diff": 10.2,
        "power": 6650.5,
        "prediction_label": "No Failure",
        "prediction_score": 0.95,
        "created_at": "2025-12-03T10:30:00Z"
    }
]
```

**Status Codes:**
- 200: Success
- 500: Database error

---

#### POST /csv/upload

Import sensor data from a CSV file.

**Prerequisites:**
- Place `sensor_data.csv` in the root directory

**CSV Format:**
```csv
type_h,type_l,type_m,tool_wear,rotation_speed,torque,air_temp,process_temp,temp_diff,power,prediction_label,prediction_score
0,1,0,150.5,1500,42.3,298.5,308.7,10.2,6650.5,No Failure,0.95
```

**Response:**
```json
{
    "message": "CSV data imported successfully",
    "recordsAdded": 100
}
```

---

## Database Schema

### Table: process_data

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| type_h | INTEGER | High-quality machine type flag |
| type_l | INTEGER | Low-quality machine type flag |
| type_m | INTEGER | Medium-quality machine type flag |
| tool_wear | FLOAT | Tool wear in minutes |
| rotation_speed | FLOAT | Rotational speed in RPM |
| torque | FLOAT | Torque in Nm |
| air_temp | FLOAT | Air temperature in Kelvin |
| process_temp | FLOAT | Process temperature in Kelvin |
| temp_diff | FLOAT | Temperature difference (process - air) |
| power | FLOAT | Power consumption in Watts |
| prediction_label | VARCHAR | ML model prediction label |
| prediction_score | FLOAT | ML model confidence score |
| created_at | TIMESTAMP | Record creation timestamp |

### Indexes

Consider adding indexes for frequently queried columns:

```sql
CREATE INDEX idx_prediction_label ON process_data(prediction_label);
CREATE INDEX idx_created_at ON process_data(created_at);
```

---

## Development

### Project Scripts

```json
{
    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

### Code Structure Guidelines

1. Controllers handle business logic
2. Routes define API endpoints
3. Database queries are centralized in `db/queries.js`
4. Use ES modules (import/export)

### Adding New Endpoints

1. Create a controller in `controllers/`
2. Create a route in `routes/`
3. Register the route in `index.js`

Example:

```javascript
// controllers/machine.controller.js
export async function getMachineById(req, res) {
    // Implementation
}

// routes/machine.route.js
import express from "express";
import { getMachineById } from "../controllers/machine.controller.js";

const router = express.Router();
router.get("/:id", getMachineById);

export default router;

// index.js
import machineRoutes from "./routes/machine.route.js";
app.use('/machines', machineRoutes);
```

---

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use environment variables for all secrets
3. Configure CORS for production domains
4. Set up SSL/TLS
5. Use a process manager (PM2)

### Deploy with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start index.js --name epics-backend

# Save process list
pm2 save

# Enable startup script
pm2 startup
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

Build and run:

```bash
docker build -t epics-backend .
docker run -p 5000:5000 --env-file .env epics-backend
```

---

## Troubleshooting

### Common Issues

**Issue: Cannot connect to database**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
Solution: Ensure PostgreSQL is running and credentials are correct.

**Issue: CORS errors**
```
Access to fetch at 'http://localhost:5000' has been blocked by CORS policy
```
Solution: Verify CORS configuration matches your frontend origin.

**Issue: CSV import fails**
```
Error: ENOENT: no such file or directory
```
Solution: Ensure `sensor_data.csv` exists in the root directory.

### Logs

Enable detailed logging by setting:

```bash
DEBUG=express:* npm run dev
```

---

## Contributing

### Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add new feature'`)
5. Push (`git push origin feature/new-feature`)
6. Open a Pull Request

### Code Style

- Use ES modules (import/export)
- Follow Express.js best practices
- Add comments for complex logic
- Handle errors appropriately

---

## Related Projects

- [epics-frontend](https://github.com/Epics-IoT-Project-Devs/epics-frontend) - React frontend
- [ml-enterprise](../ml-enterprise/) - Enterprise ML backend
- [predictive-care-next](../predictive-care-next/) - Next.js frontend
- [iot](https://github.com/Epics-IoT-Project-Devs/iot) - Arduino IoT sensors

