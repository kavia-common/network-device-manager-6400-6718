# Network Device Manager - React Frontend

This repository workspace contains the React frontend for the Network Device Manager application.

The frontend communicates with a separate Flask backend container via REST APIs. This workspace should only contain frontend code. Backend code and instructions are managed in the dedicated Backend container.

Quick Start (Frontend)
1. cd ReactFrontend
2. npm install
3. Set environment variables (preferably via a .env file handled by the orchestrator):
   - REACT_APP_API_BASE=http://localhost:5000
   - Optionally:
     - REACT_APP_BACKEND_URL
     - REACT_APP_FRONTEND_URL
4. npm start
   - UI runs at http://localhost:3000

Environment Variables
- REACT_APP_API_BASE (recommended): Base URL for the backend API (e.g., http://localhost:5000).
- REACT_APP_BACKEND_URL: Alternate variable supported for backwards compatibility.
- REACT_APP_FRONTEND_URL: May be used by the backend for CORS origin configuration.

Notes
- Only frontend code is present in this workspace.
- API calls in src/api.js respect REACT_APP_API_BASE (preferred) falling back to REACT_APP_BACKEND_URL, then http://localhost:5000.
- Ensure the corresponding backend container is running and accessible at the URL configured above.
