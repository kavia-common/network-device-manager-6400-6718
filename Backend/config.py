import os


# PUBLIC_INTERFACE
def load_config():
    """Load configuration values for the Flask backend.

    Environment variables:
        MONGO_URI: MongoDB connection string (required at runtime).
        DB_NAME: Mongo database name (default: network_devices_db)
        COLLECTION_NAME: Mongo collection name (default: devices)

    Returns:
        dict: Mapping with MONGO_URI, DB_NAME, COLLECTION_NAME
    """
    mongo_uri = os.getenv("MONGO_URI", "")
    if not mongo_uri:
        # Note: For local development you must set MONGO_URI in .env.
        # We avoid hard-coding credentials in code.
        # The orchestrator will inject env vars in deployment.
        pass
    return {
        "MONGO_URI": mongo_uri,
        "DB_NAME": os.getenv("DB_NAME", "network_devices_db"),
        "COLLECTION_NAME": os.getenv("COLLECTION_NAME", "devices"),
    }
