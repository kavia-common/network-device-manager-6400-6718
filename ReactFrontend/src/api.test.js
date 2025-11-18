import axios from "axios";
import {
  listDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  pingDevice,
  api,
} from "./api";

jest.mock("axios");

describe("api.js http wrappers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("listDevices returns devices array", async () => {
    axios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { devices: [{ name: "r1" }] } }),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    });
    const devices = await listDevices();
    expect(Array.isArray(devices)).toBe(true);
    expect(devices[0].name).toBe("r1");
  });

  test("getDevice calls correct path", async () => {
    const getMock = jest.fn().mockResolvedValue({ data: { name: "r1" } });
    axios.create.mockReturnValue({ get: getMock, post: jest.fn(), put: jest.fn(), delete: jest.fn() });
    const result = await getDevice("r1");
    expect(getMock).toHaveBeenCalledWith("/devices/r1");
    expect(result.name).toBe("r1");
  });

  test("createDevice posts payload", async () => {
    const postMock = jest.fn().mockResolvedValue({ data: { name: "n1" } });
    axios.create.mockReturnValue({ get: jest.fn(), post: postMock, put: jest.fn(), delete: jest.fn() });
    const payload = { name: "n1", ip: "1.1.1.1", type: "Router", location: "lab" };
    const res = await createDevice(payload);
    expect(postMock).toHaveBeenCalledWith("/devices", payload);
    expect(res.name).toBe("n1");
  });

  test("updateDevice puts to correct path", async () => {
    const putMock = jest.fn().mockResolvedValue({ data: { name: "n1", ip: "2.2.2.2" } });
    axios.create.mockReturnValue({ get: jest.fn(), post: jest.fn(), put: putMock, delete: jest.fn() });
    const res = await updateDevice("n1", { ip: "2.2.2.2" });
    expect(putMock).toHaveBeenCalledWith("/devices/n1", { ip: "2.2.2.2" });
    expect(res.ip).toBe("2.2.2.2");
  });

  test("deleteDevice returns true when status 204", async () => {
    const delMock = jest.fn().mockResolvedValue({ status: 204 });
    axios.create.mockReturnValue({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: delMock });
    const ok = await deleteDevice("n1");
    expect(delMock).toHaveBeenCalledWith("/devices/n1");
    expect(ok).toBe(true);
  });

  test("pingDevice calls correct path", async () => {
    const getMock = jest.fn().mockResolvedValue({ data: { name: "n1", status: "success" } });
    axios.create.mockReturnValue({ get: getMock, post: jest.fn(), put: jest.fn(), delete: jest.fn() });
    const res = await pingDevice("n1");
    expect(getMock).toHaveBeenCalledWith("/ping/n1");
    expect(res.status).toBe("success");
  });
});
