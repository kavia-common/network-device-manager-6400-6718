import axios from "axios";

/**
 * Backend API base URL is hardcoded to the deployment URI so all requests
 * consistently target the same backend regardless of environment.
 * Expected shape for GET /devices per OpenAPI and backend: { devices: [...] }
 */
const BASE_URL = "https://22e544ff.api.kavia.app/";

// Create a single Axios instance used across the app
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// PUBLIC_INTERFACE
export async function listDevices() {
  /** Fetch all devices. Returns Device[] from { devices: [...] } */
  const res = await api.get("/devices");
  const payload = res?.data;
  // Defensive parsing in case backend returns unexpected structure
  if (payload && Array.isArray(payload.devices)) {
    return payload.devices;
  }
  return Array.isArray(payload) ? payload : [];
}

// PUBLIC_INTERFACE
export async function getDevice(name) {
  /** Fetch device by name. */
  const res = await api.get(`/devices/${encodeURIComponent(name)}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function createDevice(payload) {
  /** Create a new device. */
  const res = await api.post("/devices", payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateDevice(name, payload) {
  /** Update an existing device. */
  const res = await api.put(`/devices/${encodeURIComponent(name)}`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteDevice(name) {
  /** Delete an existing device. */
  const res = await api.delete(`/devices/${encodeURIComponent(name)}`);
  return res.status === 204;
}

// PUBLIC_INTERFACE
export async function pingDevice(name) {
  /** Ping a device and return status. */
  const res = await api.get(`/ping/${encodeURIComponent(name)}`);
  return res.data;
}
