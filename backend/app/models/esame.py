from app import db
from models import * 

class Esame(db.Document):
    studente = db.ReferenceField(Studente, required=True)
    modulo = db.ReferenceField(Modulo, required=True)
    data = db.DateTimeField(required=True)
    voto = db.IntField(required=True)
    note = db.StringField()