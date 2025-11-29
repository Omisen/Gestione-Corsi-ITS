from flask import request, Blueprint, jsonify
from app.models import Studente
from app.utils import Auto_Gen_Data
from mongoengine import DoesNotExist, ValidationError

studente_bp = Blueprint('studente_bp', __name__)

@studente_bp.route("/seed", methods = ["GET","POST"])
def seed_studenti():
    #? per il test ricordiamoci di controllare il DB per certezza
    fake_studenti = Auto_Gen_Data.generazione_fake_studente(10)
        
    studenti_salvati = []
    for s in fake_studenti:
        studente = Studente(**s)
        studente.save()
        studenti_salvati.append(studente.email)
        
    return jsonify({
                    "Messaggio": "Generazione de dati andata a buon fine.",
                    "studenti_creati": len(studenti_salvati),
                    "emails": studenti_salvati
                    }), 201

# GET
@studente_bp.route('/', methods = ['GET'])
def get_tutti_studenti():
    studenti = Studente.objects()
    return jsonify(studenti), 200

@studente_bp.route('/<string:studente_id>', methods = ['GET'])
def get_studente(studente_id):
    try:
        studente = Studente.objects.get(id = studente_id)
        return jsonify(studente), 200
    except DoesNotExist:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
# POST
@studente_bp.route('/', methods = ['POST'])
def creazione_studente():
    #! da notare che la or {} è una fallback nel caso la request fosse None
    data = request.json or {}
    
    try:
        studente = Studente(**data).save()
        return jsonify(studente), 201
    except ValidationError as e:
        return jsonify({"Errore" : str(e)}), 400

# PUT
@studente_bp.route('/<string:studente_id>', methods = ['PUT'])
def update_studente(studente_id):
    data = request.json or {}
    
    try:
        studente = Studente.objects.get(id = studente_id)
    except DoesNotExist:
        return jsonify({"Errore": "Studente inesistente"}), 404
    
    try:
        studente.update(**data)
        studente.reload()
        return jsonify(studente), 200
    except ValidationError as e:
        return jsonify({"Errore" : str(e)}), 400

# DELETE
@studente_bp.route('/<string:studente_id>', methods = ['DELETE'])
def elimina_studente(studente_id):
    try:
        studente = Studente.objects.get(id = studente_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Studente nn Trvaato"}), 404
    
    studente.delete()
    return jsonify({"Messaggio" : "Studente eliminato"}), 200


#! POST e DELETE pe aggiungere i moduli dalla lista in Studente
@studente_bp.route('/<string:studente_id>/moduli', methods = ['POST'])
def aggiungi_modulo_a_studente(studente_id):
    pass