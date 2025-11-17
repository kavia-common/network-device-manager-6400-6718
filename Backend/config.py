import os
from pymongo import MongoClient, ASCENDING

# PUBLIC_INTERFACE
def get_mongo_client():
    """Create and return a MongoClient using environment configuration.

    Environment variables:
        - MONGO_URI: connection string to MongoDB.
        - DB_NAME: database name.
        - COLLECTION_NAME: collection name for devices.

    Returns:
        (client, db, collection): Tuple with configured pymongo client, database and collection.
    """
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "network_device_manager")
    collection_name = os.getenv("COLLECTION_NAME", "devices")

    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]

    # Ensure unique index on name
    collection.create_index([("name", ASCENDING)], unique=True)
    return client, db, collection
