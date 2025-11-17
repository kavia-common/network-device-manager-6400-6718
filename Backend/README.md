# Flask Backend - Network Device Manager

This backend provides a RESTful API (Flask-RESTful) to manage network devices stored in MongoDB using `pymongo`, and to ping devices using `pythonping`.

## Configuration

Config is provided via environment variables (see `.env.example` in repo root):

- MONGO_URI: MongoDB connection string (e.g., mongodb://localhost:27017)
- DB_NAME: Database name (default: network_devices_db)
- COLLECTION_NAME: Mongo collection (default: devices)
- PORT: Flask port (default: 5000)
- FLASK_DEBUG: 1 to enable debug

`config.py` reads these env vars and injects them into the Flask app.

## Install and Run

1. Create and activate a virtual environment
   - python -m venv .venv
   - source .venv/bin/activate  (Windows: .venv\\Scripts\\activate)

2. Install dependencies
   - pip install -r requirements.txt

3. Export environment variables (or use a .env manager in your environment)
   - export MONGO_URI="mongodb://localhost:27017"
   - export DB_NAME="network_devices_db"
   - export COLLECTION_NAME="devices"
   - export FLASK_DEBUG=1

4. Start the API
   - python app.py

The API runs at http://localhost:5000.

## Endpoints

- GET /devices — list devices
- POST /devices — create a device (name, ip, type, location)
- GET /devices/{name} — read one device
- PUT /devices/{name} — update device (ip, type, location)
- DELETE /devices/{name} — delete by name
- GET /ping/{name} — ping the device IP, returns status and details

## CORS

CORS is enabled. You can set REACT_APP_FRONTEND_URL to restrict allowed origin.
