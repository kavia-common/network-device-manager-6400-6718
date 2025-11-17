from flask import request, jsonify
from flask_restful import Resource
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from .utils import get_collection, validate_device_create, validate_device_update, clean_device_doc


class DevicesResource(Resource):
    """Devices collection resource: GET /devices, POST /devices"""

    # PUBLIC_INTERFACE
    def get(self):
        """List all devices.

        Returns:
            200 JSON: {"devices": [Device, ...]}
        """
        try:
            col = get_collection()
            devices = []
            for doc in col.find({}, {"_id": 0}):
                devices.append(clean_device_doc(doc))
            return jsonify({"devices": devices})
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500

    # PUBLIC_INTERFACE
    def post(self):
        """Create a new device.

        Request JSON: DeviceCreate
        Returns:
            201 JSON: Device
            400 JSON: {"error": "..."} on validation issues
            409 JSON: {"error": "..."} on duplicate name
        """
        try:
            data = request.get_json(force=True, silent=True)
            if not data:
                return jsonify({"error": "Invalid or missing JSON body"}), 400

            err = validate_device_create(data)
            if err:
                return jsonify({"error": err}), 400

            col = get_collection()
            device = {
                "name": data["name"],
                "ip": data["ip"],
                "type": data["type"],
                "location": data["location"],
            }
            try:
                col.insert_one(device)
            except DuplicateKeyError:
                return jsonify({"error": "Device name already exists"}), 409

            return jsonify(clean_device_doc(device)), 201
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500


class DeviceResource(Resource):
    """Single device resource: GET/PUT/DELETE /devices/<name>"""

    # PUBLIC_INTERFACE
    def get(self, name: str):
        """Retrieve a device by name.

        Path:
            name (str): Unique device name.

        Returns:
            200 JSON: Device
            404 JSON: {"error": "Device not found"}
        """
        try:
            col = get_collection()
            doc = col.find_one({"name": name}, {"_id": 0})
            if not doc:
                return jsonify({"error": "Device not found"}), 404
            return jsonify(clean_device_doc(doc)), 200
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500

    # PUBLIC_INTERFACE
    def put(self, name: str):
        """Update device by name.

        Body JSON: DeviceUpdate (ip, type, location)
        Returns:
            200 JSON: Device
            400 JSON: {"error": "..."} on validation issues
            404 JSON: {"error": "Device not found"}
        """
        try:
            data = request.get_json(force=True, silent=True)
            if not data:
                return jsonify({"error": "Invalid or missing JSON body"}), 400

            err = validate_device_update(data)
            if err:
                return jsonify({"error": err}), 400

            col = get_collection()
            res = col.find_one_and_update(
                {"name": name},
                {"$set": {"ip": data["ip"], "type": data["type"], "location": data["location"]}},
                return_document=True,
                projection={"_id": 0},
            )
            if not res:
                return jsonify({"error": "Device not found"}), 404
            return jsonify(clean_device_doc(res)), 200
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500

    # PUBLIC_INTERFACE
    def delete(self, name: str):
        """Delete device by name.

        Returns:
            204 No Content on success
            404 JSON: {"error": "Device not found"}
        """
        try:
            col = get_collection()
            res = col.delete_one({"name": name})
            if res.deleted_count == 0:
                return jsonify({"error": "Device not found"}), 404
            return ("", 204)
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500
