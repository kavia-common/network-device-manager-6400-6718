from flask import jsonify
from flask_restful import Resource
from pythonping import ping
from .utils import get_collection


class PingResource(Resource):
    """Ping resource: GET /ping/<name>"""

    # PUBLIC_INTERFACE
    def get(self, name: str):
        """Ping a device by its name.

        Returns:
            200 JSON: { "name": str, "status": "success"|"failure"|"timeout", "details": str }
            404 JSON: {"error": "Device not found"}
            500 JSON: {"error": "..."} unexpected error
        """
        try:
            col = get_collection()
            doc = col.find_one({"name": name}, {"_id": 0})
            if not doc:
                return jsonify({"error": "Device not found"}), 404

            ip = doc.get("ip")
            # Perform a quick ping with 2 attempts and 1 second timeout
            try:
                resp = ping(ip, count=2, timeout=1)
                if resp.success():
                    status = "success"
                else:
                    # Distinguish timeout from generic failure where possible
                    status = "timeout" if any(r.error_message for r in resp._responses) else "failure"
                details = f"packets_sent={resp.packets_sent}, packets_received={resp.packets_received}, rtt_avg_ms={getattr(resp, 'rtt_avg_ms', None)}"
                return jsonify({"name": name, "status": status, "details": details}), 200
            except Exception as pe:
                return jsonify({"name": name, "status": "failure", "details": f"ping error: {str(pe)}"}), 200
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500
