from app.models import Esame

class Operazioni:
    
    @staticmethod
    def calcolo_media_studente(studente):
        esami = Esame.objects(studente=studente)
        
        if not esami:
            return None
        
        voti = [esame.voto for esame in esami]
        return {
                'media': round(sum(voti) / len(voti), 2),
                'numero_esami': len(voti),
                'voto_minimo': min(voti),
                'voto_massimo': max(voti)
                }
    
    @staticmethod
    def filtra_esami_per_min_voto(min_voto=24):
        esami = Esame.objects(voto__gte=min_voto)
        return esami