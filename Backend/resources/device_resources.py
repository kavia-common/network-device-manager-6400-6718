from flask import current_app, request
from flask_restful import Resource
from pythonping import ping
from db import DeviceRepository


def _repo() -> DeviceRepository:
    cfg = current_app.config
    return DeviceRepository(cfg["MONGO_URI"], cfg["DB_NAME"], cfg["COLLECTION_NAME"])


class DeviceListResource(Resource):
    """Devices
    ---
    summary: List and create devices
    """

    # PUBLIC_INTERFACE
    def get(self):
        """List all devices.

        Returns:
            tuple: (json body, status code)
        """
        try:
            repo = _repo()
            devices = repo.list_devices()
            return {"devices": devices}, 200
        except Exception as ex:
            return {"error": f"Internal error: {ex}"}, 500

    # PUBLIC_INTERFACE
    def post(self):
        """Create a new device.

        Body:
            name (str): unique device name
            ip (str): IPv4/IPv6 address
            type (str): Router|Switch|Server
            location (str): any text

        Returns:
            tuple: (created device json, status code)
        """
        data = request.get_json(force=True, silent=True) or {}
        repo = _repo()
        err = repo.validate_device_payload(data, require_name=True)
        if err:
            return {"error": err}, 400
        try:
            created = repo.add_device(
                {
                    "name": data["name"].strip(),
                    "ip": data["ip"].strip(),
                    "type": data["type"],
                    "location": data["location"].strip(),
                }
            )
            return created, 201
        except ValueError as ve:
            if str(ve) == "duplicate":
                return {"error": "Device with this name already exists"}, 409
            return {"error": "Invalid data"}, 400
        except Exception as ex:
            return {"error": f"Internal error: {ex}"}, 500


class DeviceResource(Resource):
    """Devices
    ---
    summary: Retrieve, update, delete a device by name
    """

    # PUBLIC_INTERFACE
    def get(self, name: str):
        """Get device by name."""
        try:
            repo = _repo()
            dev = repo.get_device(name)
            if not dev:
                return {"error": "Device not found"}, 404
            return dev, 200
        except Exception as ex:
            return {"error": f"Internal error: {ex}"}, 500

    # PUBLIC_INTERFACE
    def put(self, name: str):
        """Update device fields (ip, type, location)."""
        data = request.get_json(force=True, silent=True) or {}
        repo = _repo()
        # For update, do not require 'name'
        err = repo.validate_device_payload(data, require_name=False)
        if err:
            return {"error": err}, 400
        try:
            update_doc = {
                "ip": data["ip"].strip(),
                "type": data["type"],
                "location": data["location"].strip(),
            }
            updated = repo.update_device(name, update_doc)
            if not updated:
                return {"error": "Device not found"}, 404
            return updated, 200
        except Exception as ex:
            return {"error": f"Internal error: {ex}"}, 500

    # PUBLIC_INTERFACE
    def delete(self, name: str):
        """Delete a device by name."""
        try:
            repo = _repo()
            ok = repo.delete_device(name)
            if not ok:
                return {"error": "Device not found"}, 404
            # 204 no content
            return "", 204
        except Exception as ex:
            return {"error": f"Internal error: {ex}"}, 500


class PingResource(Resource):
    """Ping
    ---
    summary: Ping a device by name and return health
    """

    # PUBLIC_INTERFACE
    def get(self, name: str):
        """Ping the device IP associated with name.

        Returns:
            tuple: (json body with name, status, details), status code
        """
        try:
            repo = _repo()
            dev = repo.get_device(name)
            if not dev:
                return {"error": "Device not found"}, 404

            try:
                resp = ping(dev["ip"], count=2, timeout=1)
                if resp.success():
                    status = "success"
                    details = f"avg_rtt_ms={resp.rtt_avg_ms:.2f}, packets_lost={resp.packets_lost}"
                else:
                    status = "failure"
                    details = f"packets_lost={resp.packets_lost}"
            except Exception as ex:
                status = "timeout"
                details = f"Ping error: {ex}"

            return {"name": name, "status": status, "details": details}, 200
        except Exception as ex:
            return {"error": f"Internal error: {ex}"}, 500
