class InscrizioneService:
    
    @staticmethod
    def inscrivi_studente_in_modulo(studente, modulo):
        if modulo not in studente.moduli:
            studente.moduli.append(modulo)
            studente.save()
            return True
        return False
    
    @staticmethod
    def rimuovi_studente_da_modulo(studente, modulo):
        if modulo in studente.moduli:
            studente.moduli.remove(modulo)
            studente.save()
            return True
        return False