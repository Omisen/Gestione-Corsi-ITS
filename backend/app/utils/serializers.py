from typing import Any, Dict, List
from bson import ObjectId
from datetime import datetime
import json


def serialize_objectid(obj_id: ObjectId) -> str:
    return str(obj_id)


def serialize_datetime(dt: datetime) -> str:
    return dt.isoformat()


def serialize_document(doc: Dict[str, Any]) -> Dict[str, Any]:
    if doc is None:
        return None
    
    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = serialize_objectid(value)
        elif isinstance(value, datetime):
            serialized[key] = serialize_datetime(value)
        elif isinstance(value, list):
            serialized[key] = [
                                    serialize_document(item) if isinstance(item, dict)
                                    else serialize_objectid(item) if isinstance(item, ObjectId)
                                    else serialize_datetime(item) if isinstance(item, datetime)
                                    else item
                                    for item in value
                                ]
        elif isinstance(value, dict):
            serialized[key] = serialize_document(value)
        else:
            serialized[key] = value
    
    return serialized


def serialize_documents(docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [serialize_document(doc) for doc in docs]



class MongoJSONEncoder(json.JSONEncoder):
    
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)
