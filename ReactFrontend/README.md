# React Frontend - Network Device Manager

This UI communicates with the Flask backend via Axios.

Environment
- Preferred: REACT_APP_API_BASE (e.g., https://22e544ff.api.kavia.app/ or http://localhost:5000)
- If REACT_APP_API_BASE is not set, the app defaults to: https://22e544ff.api.kavia.app/

Other helpful values:
- REACT_APP_FRONTEND_URL to assist backend CORS origin

Run
- npm install
- npm start
  - Optionally override: REACT_APP_API_BASE=http://localhost:5000 npm start

The UI provides:
- Device list
- Add/Edit forms with validation
- Delete and Ping actions
- Status messages and error handling
