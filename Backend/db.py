from typing import Optional, Dict, Any, List
from pymongo import MongoClient, ASCENDING
from pymongo.errors import DuplicateKeyError
import ipaddress


class DeviceRepository:
    """Repository encapsulating device CRUD operations against MongoDB."""

    def __init__(self, mongo_uri: str, db_name: str, collection_name: str):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.col = self.db[collection_name]
        # Ensure unique index on name
        self.col.create_index([("name", ASCENDING)], unique=True)

    @staticmethod
    def validate_device_payload(payload: Dict[str, Any], require_name: bool = True) -> Optional[str]:
        """Validate device payload fields. Returns error message or None if OK."""
        required_fields = ["ip", "type", "location"]
        if require_name:
            required_fields = ["name"] + required_fields
        for f in required_fields:
            if f not in payload or (isinstance(payload[f], str) and not payload[f].strip()):
                return f"Missing or empty field: {f}"

        # Validate IP
        try:
            ipaddress.ip_address(payload["ip"])
        except Exception:
            return "Invalid IPv4/IPv6 address format for 'ip'"

        # Validate type
        if payload["type"] not in ["Router", "Switch", "Server"]:
            return "Invalid 'type'. Must be one of: Router, Switch, Server"

        return None

    def list_devices(self) -> List[Dict[str, Any]]:
        return [{k: d[k] for k in d if k != "_id"} for d in self.col.find({}).sort("name", ASCENDING)]

    def get_device(self, name: str) -> Optional[Dict[str, Any]]:
        doc = self.col.find_one({"name": name})
        if not doc:
            return None
        doc.pop("_id", None)
        return doc

    def add_device(self, device: Dict[str, Any]) -> Dict[str, Any]:
        try:
            self.col.insert_one(device)
        except DuplicateKeyError as ex:
            raise ValueError("duplicate") from ex
        return device

    def update_device(self, name: str, update: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        res = self.col.find_one_and_update({"name": name}, {"$set": update}, return_document=True)
        if not res:
            return None
        res.pop("_id", None)
        return res

    def delete_device(self, name: str) -> bool:
        res = self.col.delete_one({"name": name})
        return res.deleted_count == 1
