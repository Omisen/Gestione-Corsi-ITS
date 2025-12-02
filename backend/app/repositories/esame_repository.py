from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.repositories.base_repository import BaseRepository
from app.utils.objectid_utils import str_to_objectid


class EsameRepository(BaseRepository):
    
    def __init__(self):
        super().__init__('esame')
    
    def find_by_studente(self, studente_id: str) -> List[Dict[str, Any]]:
        studente_oid = str_to_objectid(studente_id)
        if not studente_oid:
            return []
        
        return self.find_many({"studente": studente_oid})
    
    
    def find_by_modulo(self, modulo_id: str) -> List[Dict[str, Any]]:
        modulo_oid = str_to_objectid(modulo_id)
        if not modulo_oid:
            return []
        
        return self.find_many({"modulo": modulo_oid})
    
    
    def find_by_voto_gte(self, min_voto: int) -> List[Dict[str, Any]]:
        return self.find_many({"voto": {"$gte": min_voto}})
    
    
    def delete_by_studente(self, studente_id: str) -> int:
        studente_oid = str_to_objectid(studente_id)
        if not studente_oid:
            return 0
        
        result = self.delete_many({"studente": studente_oid})
        return result.deleted_count
    
    
    def get_with_populated_refs(self, esame_id: str) -> Optional[Dict[str, Any]]:
        esame_oid = str_to_objectid(esame_id)
        if not esame_oid:
            return None
        
        pipeline = [
                        {"$match": {"_id": esame_oid}},
                        
                        {
                            "$lookup": {
                                "from": "studente",
                                "localField": "studente",
                                "foreignField": "_id",
                                "as": "studente_populated"
                            }
                        },
                        
                        {
                            "$lookup": {
                                "from": "modulo",
                                "localField": "modulo",
                                "foreignField": "_id",
                                "as": "modulo_populated"
                            }
                        },
                        
                        {
                            "$unwind": {
                                "path": "$studente_populated",
                                "preserveNullAndEmptyArrays": True
                            }
                        },
                        
                        {
                            "$unwind": {
                                "path": "$modulo_populated",
                                "preserveNullAndEmptyArrays": True
                            }
                        }
                    ]
        
        result = list(self.collection.aggregate(pipeline))
        return result[0] if result else None
    
    def get_all_with_populated_refs(self) -> List[Dict[str, Any]]:
        pipeline = [
                        {
                            "$lookup": {
                                "from": "studente",
                                "localField": "studente",
                                "foreignField": "_id",
                                "as": "studente_populated"
                            }
                        },
                        {
                            "$lookup": {
                                "from": "modulo",
                                "localField": "modulo",
                                "foreignField": "_id",
                                "as": "modulo_populated"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$studente_populated",
                                "preserveNullAndEmptyArrays": True
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$modulo_populated",
                                "preserveNullAndEmptyArrays": True
                            }
                        }
                    ]
        
        return list(self.collection.aggregate(pipeline))
    
    
esame_repository = EsameRepository()
