import { rest } from "msw";

// Resolve API base URL from env; default to localhost:5000 for frontend
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:5000";

// In-memory store to simulate backend state during tests
let devices = [
  { name: "r1", ip: "10.0.0.1", type: "Router", location: "lab" },
  { name: "s1", ip: "10.0.0.2", type: "Switch", location: "dc1" },
];

// Helper to clone data safely
const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const resetMocks = () => {
  devices = [
    { name: "r1", ip: "10.0.0.1", type: "Router", location: "lab" },
    { name: "s1", ip: "10.0.0.2", type: "Switch", location: "dc1" },
  ];
};

export const handlers = [
  // GET /devices
  rest.get(`${API_BASE}/devices`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        devices: clone(devices),
      })
    );
  }),

  // POST /devices
  rest.post(`${API_BASE}/devices`, async (req, res, ctx) => {
    const body = await req.json();
    const { name, ip, type, location } = body || {};
    if (!name || !ip || !type || !location) {
      return res(ctx.status(400), ctx.json({ error: "Invalid payload" }));
    }
    if (devices.find((d) => d.name === name)) {
      return res(ctx.status(409), ctx.json({ error: "Duplicate device name" }));
    }
    const d = { name, ip, type, location };
    devices.push(d);
    return res(ctx.status(201), ctx.json(clone(d)));
  }),

  // GET /devices/:name
  rest.get(`${API_BASE}/devices/:name`, (req, res, ctx) => {
    const { name } = req.params;
    const d = devices.find((x) => x.name === name);
    if (!d) return res(ctx.status(404), ctx.json({ error: "Not found" }));
    return res(ctx.status(200), ctx.json(clone(d)));
  }),

  // PUT /devices/:name
  rest.put(`${API_BASE}/devices/:name`, async (req, res, ctx) => {
    const { name } = req.params;
    const idx = devices.findIndex((x) => x.name === name);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: "Not found" }));
    const body = await req.json();
    const { ip, type, location } = body || {};
    if (!ip || !type || !location) {
      return res(ctx.status(400), ctx.json({ error: "Invalid payload" }));
    }
    devices[idx] = { ...devices[idx], ip, type, location };
    return res(ctx.status(200), ctx.json(clone(devices[idx])));
  }),

  // DELETE /devices/:name
  rest.delete(`${API_BASE}/devices/:name`, (req, res, ctx) => {
    const { name } = req.params;
    const before = devices.length;
    devices = devices.filter((d) => d.name !== name);
    if (devices.length === before) {
      return res(ctx.status(404), ctx.json({ error: "Not found" }));
    }
    return res(ctx.status(204));
  }),

  // GET /ping/:name
  rest.get(`${API_BASE}/ping/:name`, (req, res, ctx) => {
    const { name } = req.params;
    const exists = devices.find((d) => d.name === name);
    if (!exists) return res(ctx.status(404), ctx.json({ error: "Not found" }));
    // Deterministic "success" for tests
    return res(
      ctx.status(200),
      ctx.json({ name, status: "success", details: "icmp_ok" })
    );
  }),
];
