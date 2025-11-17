import React, { useEffect, useMemo, useState } from "react";
import "./deviceManager.css";
import {
  listDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  pingDevice,
} from "./api";

// PUBLIC_INTERFACE
function App() {
  /** Network Device Manager UI */
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [loadError, setLoadError] = useState(""); // track fetch error for table display
  const [form, setForm] = useState({
    name: "",
    ip: "",
    type: "Router",
    location: "",
  });
  const [editing, setEditing] = useState(null); // name when editing

  const types = useMemo(() => ["Router", "Switch", "Server"], []);

  const showStatus = (msg, timeout = 2500) => {
    setStatusMsg(msg);
    if (timeout) {
      setTimeout(() => setStatusMsg(""), timeout);
    }
  };

  // Fetch and populate devices; ensures we parse { devices: [...] } correctly
  const refresh = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const list = await listDevices(); // listDevices returns array from res.data.devices
      setDevices(Array.isArray(list) ? list : []);
    } catch (e) {
      const err = e?.response?.data?.error || e.message || "Unknown error";
      setLoadError(err);
      showStatus(`Failed to load devices: ${err}`);
      setDevices([]); // ensure UI reflects empty on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const resetForm = () => {
    setForm({ name: "", ip: "", type: "Router", location: "" });
    setEditing(null);
  };

  const validate = (f) => {
    if (!f.ip || !f.type || !f.location || (!editing && !f.name))
      return "All fields are required.";
    const ipv4 =
      /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
    if (!ipv4.test(f.ip)) return "Invalid IP format (expects IPv4).";
    if (!types.includes(f.type))
      return "Type must be Router, Switch, or Server.";
    if (!editing) {
      const nameValid = /^[a-zA-Z0-9_\-\.]+$/.test(f.name);
      if (!nameValid) return "Name may contain letters, numbers, _, -, .";
      if (devices.find((d) => d.name === f.name)) return "Name already exists.";
    }
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) {
      showStatus(err);
      return;
    }
    try {
      if (editing) {
        await updateDevice(editing, {
          ip: form.ip,
          type: form.type,
          location: form.location,
        });
        showStatus("Device updated.");
      } else {
        await createDevice(form);
        showStatus("Device created.");
      }
      await refresh(); // ensure table updates after write
      resetForm();
    } catch (e) {
      const code = e?.response?.status;
      if (code === 409) {
        showStatus("Duplicate device name.");
      } else {
        showStatus(e?.response?.data?.error || e.message);
      }
    }
  };

  const onEdit = (d) => {
    setEditing(d.name);
    setForm({ name: d.name, ip: d.ip, type: d.type, location: d.location });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (name) => {
    if (!window.confirm(`Delete device "${name}"?`)) return;
    try {
      await deleteDevice(name);
      showStatus("Device deleted.");
      await refresh();
      if (editing === name) resetForm();
    } catch (e) {
      showStatus(e?.response?.data?.error || e.message);
    }
  };

  const onPing = async (name) => {
    try {
      const res = await pingDevice(name);
      const badge = res.status === "success" ? "OK" : res.status.toUpperCase();
      showStatus(`Ping ${name}: ${badge} (${res.details})`);
    } catch (e) {
      showStatus(e?.response?.data?.error || e.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title">Network Device Manager</div>
        <div className="status" role="status" aria-live="polite">
          {loading ? "Loading..." : statusMsg}
        </div>
      </div>

      <div className="panel" aria-labelledby="form-title">
        <div id="form-title" className="helper" style={{ marginBottom: 8 }}>
          {editing ? `Editing: ${editing}` : "Add a new device"}
        </div>
        <form onSubmit={submit}>
          <div className="row" style={{ marginBottom: 8 }}>
            <input
              className="input"
              type="text"
              placeholder="Name (unique)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!!editing}
              aria-label="Device Name"
            />
            <input
              className="input"
              type="text"
              placeholder="IP (e.g., 192.168.1.1)"
              value={form.ip}
              onChange={(e) => setForm({ ...form, ip: e.target.value })}
              aria-label="Device IP"
            />
            <select
              className="select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              aria-label="Device Type"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              aria-label="Device Location"
            />
          </div>
          <div className="row">
            <button className="btn" type="submit">
              {editing ? "Save Changes" : "Add Device"}
            </button>
            {editing && (
              <button
                className="btn secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="helper" style={{ marginBottom: 8 }}>
          Devices
        </div>
        <table className="table" role="table" aria-busy={loading ? "true" : "false"}>
          <thead>
            <tr>
              <th>Name</th>
              <th>IP</th>
              <th>Type</th>
              <th>Location</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="helper">
                  Loading devices...
                </td>
              </tr>
            ) : loadError ? (
              <tr>
                <td colSpan="5" className="helper">
                  Error loading devices: {loadError}
                </td>
              </tr>
            ) : devices.length === 0 ? (
              <tr>
                <td colSpan="5" className="helper">
                  No devices yet. Add one above.
                </td>
              </tr>
            ) : (
              devices.map((d) => (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.ip}</td>
                  <td>
                    <span className="badge">{d.type}</span>
                  </td>
                  <td>{d.location}</td>
                  <td>
                    <div className="row">
                      <button className="btn" onClick={() => onPing(d.name)}>
                        Ping
                      </button>
                      <button
                        className="btn secondary"
                        onClick={() => onEdit(d)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => onDelete(d.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
