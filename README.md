# Network Device Manager

Two-container app:
- React frontend (Network Device Manager UI)
- Flask backend (REST API using Flask-RESTful with MongoDB via pymongo and ping via pythonping)

## Quick Start

### Backend (Flask)
1. cd Backend
2. python -m venv .venv && source .venv/bin/activate
3. pip install -r requirements.txt
4. Set environment variables (see .env.example at repo root)
   - export MONGO_URI="mongodb://localhost:27017"
   - export DB_NAME="network_devices_db"
   - export COLLECTION_NAME="devices"
   - export FLASK_DEBUG=1
5. python app.py
   - API on http://localhost:5000
   - Health at /healthz

### Frontend (React)
1. cd ReactFrontend
2. npm install
3. Ensure .env values (REACT_APP_API_BASE=http://localhost:5000)
4. npm start
   - UI on http://localhost:3000

## API Summary
- GET /devices
- POST /devices
- GET /devices/{name}
- PUT /devices/{name}
- DELETE /devices/{name}
- GET /ping/{name}

## Configuration
- Backend uses config.py and env vars: MONGO_URI, DB_NAME, COLLECTION_NAME
- Frontend uses REACT_APP_API_BASE to reach backend