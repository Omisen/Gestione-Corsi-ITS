from app import db

class Esami(db.Document):
    data = db.DateTimeField(required=True)
    voto = db.IntField(required=True)
    note = db.StringField(required=True)