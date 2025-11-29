from app import db
import mongoengine as me

class Esame(db.Document):
    studente = me.ReferenceField('Studente', required=True)
    modulo = me.ReferenceField('Modulo', required=True)
    data = db.DateTimeField(required=True)
    voto = db.IntField(required=True)
    note = db.StringField()