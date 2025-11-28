from app import db
from datetime import datetime

class Esami(db.Document):
    data = db.DateTimeField(required=True, default=datetime.now())
    voto = db.IntField(required=True, min_value = 0, max_value = 30)
    note = db.StringField(required=False, max_length=200)