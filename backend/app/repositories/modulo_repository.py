from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.repositories.base_repository import BaseRepository
from app.utils.objectid_utils import str_to_objectid


class ModuloRepository(BaseRepository):
    def __init__(self):
        super().__init__('modulo')
    
    def find_by_codice(self, codice: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"codice": codice})
    
    
    def codice_exists(self, codice: str, exclude_id: Optional[str] = None) -> bool:
        filter_dict = {"codice": codice}
        
        if exclude_id:
            obj_id = str_to_objectid(exclude_id)
            if obj_id:
                filter_dict["_id"] = {"$ne": obj_id}
        
        return self.find_one(filter_dict) is not None
    
    
    def get_next_nome_sequence(self) -> int:
        result = self.collection.find_one(
            {},
            sort=[("nome", -1)]
        )
        
        if result and 'nome' in result:
            return result['nome'] + 1
        
        return 1
    
    
    def find_studenti_iscritti(self, modulo_id: str) -> List[Dict[str, Any]]:
        modulo_oid = str_to_objectid(modulo_id)
        if not modulo_oid:
            return []
        
        from app.database import get_collection
        studenti_collection = get_collection('studente')
        
        return list(studenti_collection.find({"moduli": modulo_oid}))



modulo_repository = ModuloRepository()
