import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from resources.devices import DevicesResource, DeviceResource
from resources.ping import PingResource

# PUBLIC_INTERFACE
def create_app():
    """Create and configure the Flask application.

    Returns:
        Flask: Configured Flask app with RESTful endpoints and CORS.
    """
    app = Flask(__name__)
    app.config.from_pyfile('config.py', silent=True)

    # CORS for local dev: allow React origin or all if not provided.
    frontend_origin = os.getenv("REACT_APP_FRONTEND_URL") or os.getenv("FRONTEND_ORIGIN")
    if frontend_origin:
        CORS(app, resources={r"/*": {"origins": [frontend_origin]}}, supports_credentials=False)
    else:
        CORS(app)

    api = Api(app, catch_all_404s=True)

    # Routes
    api.add_resource(DevicesResource, "/devices")
    api.add_resource(DeviceResource, "/devices/<string:name>")
    api.add_resource(PingResource, "/ping/<string:name>")

    # Health endpoint (not in spec, useful for ops)
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
