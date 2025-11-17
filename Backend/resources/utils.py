import os
import re
from flask import current_app
from ..config import get_mongo_client

_client = None
_db = None
_collection = None

# PUBLIC_INTERFACE
def get_collection():
    """Get the MongoDB collection for devices, initializing lazily.

    Returns:
        pymongo.collection.Collection: collection handle
    """
    global _client, _db, _collection
    if _collection is None:
        _client, _db, _collection = get_mongo_client()
    return _collection


IPV4_REGEX = re.compile(r"^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$")
NAME_REGEX = re.compile(r"^[a-zA-Z0-9_\-\.]+$")

# PUBLIC_INTERFACE
def validate_device_create(data: dict) -> str:
    """Validate DeviceCreate payload.

    Args:
        data (dict): Incoming JSON

    Returns:
        str: error message or empty string if valid
    """
    required = ["name", "ip", "type", "location"]
    for k in required:
        if k not in data or data[k] in (None, "", []):
            return "All fields (name, ip, type, location) are required."

    if not NAME_REGEX.match(str(data["name"])):
        return "Invalid name. Allowed: letters, numbers, _, -, ."
    if not IPV4_REGEX.match(str(data["ip"])):
        return "Invalid IP format (expects IPv4)."
    if str(data["type"]) not in ["Router", "Switch", "Server"]:
        return "Type must be one of Router, Switch, Server."
    return ""

# PUBLIC_INTERFACE
def validate_device_update(data: dict) -> str:
    """Validate DeviceUpdate payload.

    Args:
        data (dict): Incoming JSON

    Returns:
        str: error message or empty string if valid
    """
    required = ["ip", "type", "location"]
    for k in required:
        if k not in data or data[k] in (None, "", []):
            return "All fields (ip, type, location) are required."
    if not IPV4_REGEX.match(str(data["ip"])):
        return "Invalid IP format (expects IPv4)."
    if str(data["type"]) not in ["Router", "Switch", "Server"]:
        return "Type must be one of Router, Switch, Server."
    return ""

# PUBLIC_INTERFACE
def clean_device_doc(doc: dict) -> dict:
    """Normalize device document to API schema, dropping internal fields.

    Args:
        doc (dict): Document from Mongo

    Returns:
        dict: Cleaned device object
    """
    if not doc:
        return {}
    return {
        "name": doc.get("name"),
        "ip": doc.get("ip"),
        "type": doc.get("type"),
        "location": doc.get("location"),
    }
