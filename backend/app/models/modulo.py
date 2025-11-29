from app import db

class Modulo(db.Document):
    nome = db.SequenceField(required = True)
    codice = db.StringField(required = True, unique = True)
    totale_ore = db.IntField(required = True)
    descrizione = db.StringField()