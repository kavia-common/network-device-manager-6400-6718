import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// PUBLIC_INTERFACE
export async function listDevices() {
  /** Fetch all devices. */
  const res = await api.get("/devices");
  return res.data.devices || [];
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
