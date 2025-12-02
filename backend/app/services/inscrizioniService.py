from app.repositories import studente_repository

class InscrizioneService:
    
    @staticmethod
    def inscrivi_studente_in_modulo(studente_id: str, modulo_id: str) -> bool:
        return studente_repository.add_modulo(studente_id, modulo_id)
    
    
    @staticmethod
    def rimuovi_studente_da_modulo(studente_id: str, modulo_id: str) -> bool:
        return studente_repository.remove_modulo(studente_id, modulo_id)