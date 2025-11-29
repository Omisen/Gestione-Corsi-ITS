from app import db
import mongoengine as me

class Studente(db.Document):
    nome = db.StringField(required=True)
    cognome = db.StringField(required=True)
    email = db.EmailField(required=True, unique=True)
    moduli = me.ListField(me.ReferenceField('Modulo'))
    esami = me.ListField(me.ReferenceField('Esame'))
