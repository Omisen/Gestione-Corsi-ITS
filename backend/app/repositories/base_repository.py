from typing import Optional, List, Dict, Any
from bson import ObjectId
from pymongo.collection import Collection
from pymongo.results import InsertOneResult, UpdateResult, DeleteResult
from app.database import get_collection
from app.utils.objectid_utils import str_to_objectid, ensure_objectid


class BaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self._collection: Optional[Collection] = None
    
    
    @property
    def collection(self) -> Collection:
        if self._collection is None:
            self._collection = get_collection(self.collection_name)
        return self._collection
    
    
    def find_all(self, filter_dict: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        filter_dict = filter_dict or {}
        return list(self.collection.find(filter_dict))
    
    
    def find_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        obj_id = str_to_objectid(doc_id)
        if obj_id is None:
            return None
        
        return self.collection.find_one({"_id": obj_id})
    
    
    def find_one(self, filter_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        return self.collection.find_one(filter_dict)
    
    
    def find_many(self, filter_dict: Dict[str, Any], limit: Optional[int] = None) -> List[Dict[str, Any]]:
        cursor = self.collection.find(filter_dict)
        if limit:
            cursor = cursor.limit(limit)
        return list(cursor)
    
    
    def insert_one(self, data: Dict[str, Any]) -> InsertOneResult:
        return self.collection.insert_one(data)
    
    
    def update_one(self, doc_id: str, data: Dict[str, Any]) -> Optional[UpdateResult]:
        obj_id = str_to_objectid(doc_id)
        if obj_id is None:
            return None
        
        update_data = {k: v for k, v in data.items() if v is not None}
        
        if not update_data:
            return None
        
        return self.collection.update_one(
                                            {"_id": obj_id},
                                            {"$set": update_data}
                                        )
    
    def delete_one(self, doc_id: str) -> Optional[DeleteResult]:
        obj_id = str_to_objectid(doc_id)
        if obj_id is None:
            return None
        
        return self.collection.delete_one({"_id": obj_id})
    
    
    def delete_many(self, filter_dict: Dict[str, Any]) -> DeleteResult:
        return self.collection.delete_many(filter_dict)
    
    
    def count(self, filter_dict: Optional[Dict[str, Any]] = None) -> int:
        filter_dict = filter_dict or {}
        return self.collection.count_documents(filter_dict)
    
    
    def exists(self, doc_id: str) -> bool:
        return self.find_by_id(doc_id) is not None
