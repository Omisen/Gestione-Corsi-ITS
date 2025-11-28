from app import db


class Moduli(db.Document):
    nome = db.StringField(required=True, unique=True, max_length=50)
    codice = db.IntField(required=True, unique=True)
    ore = db.IntField(required=True)
    descrizione = db.StringField(required=True, max_length=200)
    info = db.StringField(required=False, max_length=500)