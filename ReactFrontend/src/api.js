import axios from "axios";

/**
 * Base URL resolution order for the backend API:
 * 1. REACT_APP_API_BASE (preferred)
 * 2. Fallback to the provided default deployment URL
 *
 * Note:
 * - We intentionally avoid defaulting to window.location.origin to prevent
 *   preview/hosting origins from being used accidentally.
 * - REACT_APP_BACKEND_URL is no longer used for fallback to keep configuration explicit.
 */
const DEFAULT_API_BASE = "https://8d8f8324.api.kavia.app/";
const baseURL = process.env.REACT_APP_API_BASE || DEFAULT_API_BASE;

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
