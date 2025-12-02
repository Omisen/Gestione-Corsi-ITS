from typing import Optional, Dict, List, Any
from app.repositories import esame_repository


class Operazioni:
    
    @staticmethod
    def calcolo_media_studente(studente_id: str) -> Optional[Dict[str, Any]]:
        esami = esame_repository.find_by_studente(studente_id)
        
        if not esami:
            return None
        
        voti = [esame['voto'] for esame in esami]
        return {
                    'media': round(sum(voti) / len(voti), 2),
                    'numero_esami': len(voti),
                    'voto_minimo': min(voti),
                    'voto_massimo': max(voti)
                }
    
    @staticmethod
    def filtra_esami_per_min_voto(min_voto: int = 24) -> List[Dict[str, Any]]:
        return esame_repository.find_by_voto_gte(min_voto)