# Flask Backend - Network Device Manager

Implements the REST API per the OpenAPI spec with Flask-RESTful, using MongoDB via pymongo (no separate DB container required). Supports CRUD for devices and a ping endpoint using pythonping. CORS is enabled for local development so the React app (port 3000) can call the backend.

Run
- python3 -m venv venv && . venv/bin/activate
- pip install -r requirements.txt
- export MONGO_URI="mongodb://localhost:27017"
- export DB_NAME="network_device_manager"
- export COLLECTION_NAME="devices"
- Optional for CORS: export REACT_APP_FRONTEND_URL="http://localhost:3000"
- python app.py  (runs at http://localhost:5000)

Environment Variables
- MONGO_URI: Mongo connection string (e.g., mongodb://localhost:27017)
- DB_NAME: Database name (default: network_device_manager)
- COLLECTION_NAME: Collection name (default: devices)
- REACT_APP_FRONTEND_URL: Frontend origin allowed for CORS (optional)

Endpoints
- GET /devices -> { "devices": [Device, ...] }
- POST /devices -> 201 Device; 400 validation error; 409 duplicate
- GET /devices/{name} -> 200 Device; 404 not found
- PUT /devices/{name} -> 200 Device; 400 validation error; 404 not found
- DELETE /devices/{name} -> 204 No Content; 404 not found
- GET /ping/{name} -> 200 { name, status: success|failure|timeout, details }; 404 not found

Notes
- Unique device name is enforced via a unique index on the "name" field.
- Error responses are {"error": "..."} as per spec.
