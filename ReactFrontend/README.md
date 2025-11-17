# React Frontend - Network Device Manager

This UI communicates with the Flask backend via Axios.

## Environment

Set one of:
- `REACT_APP_API_BASE` (recommended) — e.g., http://localhost:5000
or
- `REACT_APP_BACKEND_URL`

Other helpful values:
- `REACT_APP_FRONTEND_URL` to assist backend CORS origin

## Run

- npm install
- REACT_APP_API_BASE=http://localhost:5000 npm start

The UI provides:
- Device list
- Add/Edit forms with validation
- Delete and Ping actions
- Status messages and error handling
