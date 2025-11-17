import os
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
from resources.device_resources import DeviceListResource, DeviceResource, PingResource
from config import load_config

# PUBLIC_INTERFACE
def create_app():
    """Create and configure the Flask application.

    Returns:
        Flask: Configured Flask app with REST resources registered.
    """
    app = Flask(__name__)
    cfg = load_config()
    app.config.update(
        MONGO_URI=cfg["MONGO_URI"],
        DB_NAME=cfg["DB_NAME"],
        COLLECTION_NAME=cfg["COLLECTION_NAME"],
    )

    # Enable CORS for all routes. In production, restrict origins from env REACT_APP_FRONTEND_URL if provided.
    frontend_origin = os.getenv("REACT_APP_FRONTEND_URL", "*")
    CORS(app, resources={r"/*": {"origins": frontend_origin}})

    api = Api(app, prefix="")

    # Register resources with tags in docstrings for OpenAPI generators if needed
    api.add_resource(DeviceListResource, "/devices")
    api.add_resource(DeviceResource, "/devices/<string:name>")
    api.add_resource(PingResource, "/ping/<string:name>")

    @app.route("/healthz")
    def health():
        """Lightweight healthcheck endpoint for container orchestrators."""
        return jsonify({"status": "ok"}), 200

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG", "0") == "1")
