from app import db
from models import *

class Student(db.Document):
    nome = db.StringField(required=True)
    cognome = db.StringField(required=True)
    email = db.EmailField(required=True, unique=True)
    moduli = db.ListField(db.ReferenceField(Modulo))
    esami = db.ListField(db.ReferenceField(Esame))
