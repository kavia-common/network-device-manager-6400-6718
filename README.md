# Network Device Manager - Full Stack

This workspace now contains:
- ReactFrontend/: React UI (port 3000) using Axios to call the backend.
- Backend/: Flask-RESTful API (port 5000) with MongoDB via pymongo and pythonping.

Quick Start (Frontend)
1. cd ReactFrontend
2. npm install
3. (Optional) Set environment variables (preferably via a .env handled by the orchestrator):
   - REACT_APP_API_BASE=<your backend base> (defaults to https://22e544ff.api.kavia.app/)
   - Optionally:
     - REACT_APP_FRONTEND_URL
4. npm start
   - UI runs at http://localhost:3000

Quick Start (Backend)
1. cd Backend
2. python3 -m venv venv && . venv/bin/activate
3. pip install -r requirements.txt
4. export MONGO_URI="mongodb://localhost:27017"
5. export DB_NAME="network_device_manager"
6. export COLLECTION_NAME="devices"
7. Optional for CORS: export REACT_APP_FRONTEND_URL="http://localhost:3000"
8. python app.py
   - API runs at http://localhost:5000

Environment Variables
Frontend:
- REACT_APP_API_BASE (recommended): Base URL for the backend API (e.g., http://localhost:5000).
- REACT_APP_BACKEND_URL: Alternate variable supported for backwards compatibility.
- REACT_APP_FRONTEND_URL: May be used by the backend for CORS origin configuration.

Backend:
- MONGO_URI: MongoDB URI (no separate DB container assumed).
- DB_NAME: Database name (default: network_device_manager).
- COLLECTION_NAME: Collection name (default: devices).
- REACT_APP_FRONTEND_URL: Allowed CORS origin (optional).

Notes
- API calls in React respect REACT_APP_API_BASE (preferred) falling back to REACT_APP_BACKEND_URL, then http://localhost:5000.
- Backend enforces unique device names; duplicates return 409.
- CRUD routes and ping are implemented per the provided OpenAPI spec.
