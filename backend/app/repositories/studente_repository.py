from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.repositories.base_repository import BaseRepository
from app.utils.objectid_utils import str_to_objectid, ensure_objectid


class StudenteRepository(BaseRepository):
    def __init__(self):
        super().__init__('studente')
    
    def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"email": email})
    
    def email_exists(self, email: str, exclude_id: Optional[str] = None) -> bool:
        filter_dict = {"email": email}
        
        if exclude_id:
            obj_id = str_to_objectid(exclude_id)
            if obj_id:
                filter_dict["_id"] = {"$ne": obj_id}
        
        return self.find_one(filter_dict) is not None
    
    
    def add_modulo(self, studente_id: str, modulo_id: str) -> bool:
        studente_oid = str_to_objectid(studente_id)
        modulo_oid = str_to_objectid(modulo_id)
        
        if not studente_oid or not modulo_oid:
            return False
        
        studente = self.find_by_id(studente_id)
        if not studente:
            return False
        
        if modulo_oid in studente.get('moduli', []):
            return False
        
        result = self.collection.update_one(
                                                {"_id": studente_oid},
                                                {"$addToSet": {"moduli": modulo_oid}}
                                            )
        
        return result.modified_count > 0
    
    
    def remove_modulo(self, studente_id: str, modulo_id: str) -> bool:
        studente_oid = str_to_objectid(studente_id)
        modulo_oid = str_to_objectid(modulo_id)
        
        if not studente_oid or not modulo_oid:
            return False
        
        # Check if module in list
        studente = self.find_by_id(studente_id)
        if not studente:
            return False
        
        if modulo_oid not in studente.get('moduli', []):
            return False
        
        # Remove module from list
        result = self.collection.update_one(
                                                {"_id": studente_oid},
                                                {"$pull": {"moduli": modulo_oid}}
                                            )
        
        return result.modified_count > 0
    
    
    def add_esame(self, studente_id: str, esame_id: str) -> bool:
        studente_oid = str_to_objectid(studente_id)
        esame_oid = str_to_objectid(esame_id)
        
        if not studente_oid or not esame_oid:
            return False
        
        result = self.collection.update_one(
                                                {"_id": studente_oid},
                                                {"$addToSet": {"esami": esame_oid}}
                                            )
        
        return result.modified_count > 0 or result.matched_count > 0
    
    
    def remove_esame(self, studente_id: str, esame_id: str) -> bool:
        studente_oid = str_to_objectid(studente_id)
        esame_oid = str_to_objectid(esame_id)
        
        if not studente_oid or not esame_oid:
            return False
        
        result = self.collection.update_one(
                                                {"_id": studente_oid},
                                                {"$pull": {"esami": esame_oid}}
                                            )
        
        return result.modified_count > 0 or result.matched_count > 0
    
    
    def get_with_populated_moduli(self, studente_id: str) -> Optional[Dict[str, Any]]:
        studente_oid = str_to_objectid(studente_id)
        if not studente_oid:
            return None
        
        pipeline = [
                        {"$match": {"_id": studente_oid}},
                        
                        {
                            "$lookup": {
                                "from": "modulo",
                                "localField": "moduli",
                                "foreignField": "_id",
                                "as": "moduli_populated"
                            }
                        }
                    ]
        
        result = list(self.collection.aggregate(pipeline))
        return result[0] if result else None
    
    
    def get_with_populated_refs(self, studente_id: str) -> Optional[Dict[str, Any]]:
        studente_oid = str_to_objectid(studente_id)
        if not studente_oid:
            return None
        
        pipeline = [
                        {"$match": {"_id": studente_oid}},
                        
                        {
                            "$lookup": {
                                "from": "modulo",
                                "localField": "moduli",
                                "foreignField": "_id",
                                "as": "moduli_populated"
                            }
                        },
                        
                        {
                            "$lookup": {
                                "from": "esame",
                                "localField": "esami",
                                "foreignField": "_id",
                                "as": "esami_populated"
                            }
                        }
                    ]
        
        result = list(self.collection.aggregate(pipeline))
        return result[0] if result else None



studente_repository = StudenteRepository()
