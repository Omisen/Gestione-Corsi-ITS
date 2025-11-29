from app import db
import mongoengine as me

class Studente(db.Document):
    nome = db.StringField(required=True)
    cognome = db.StringField(required=True)
    email = db.EmailField(required=True, unique=True)
    moduli = me.ListField(me.ReferenceField('Modulo'))
    esami = me.ListField(me.ReferenceField('Esame'))
    
    #! serve per inscrivere lo studente a un modulo inserire nella route POST
    def inscrizione_modulo(self, modulo):
        if modulo not in self.moduli:
            self.moduli.append(modulo)
            self.save()
            return True
        return False
    
    #! serve per rimuove l'inscrizione da un modulo da inserire nella route DELETE
    def disinscrizione_modulo(self, modulo):
        if modulo in self.moduli:
            self.moduli.remove(modulo)
            self.save()
            return True
        return False
    
    def get_media_voti(self):
        from app.models import Esame
        
        esami: Esame = Esame.objects(studente = self)
        if not esami:
            return None
        
        voti = [esame.voto for esame in esami]
        return {
                'media': round(sum(voti) / len(voti), 2),
                'numero_esami': len(voti),
                'voto_minimo': min(voti),
                'voto_massimo': max(voti)
                }
