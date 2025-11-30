from flask import request, Blueprint, jsonify
from app.models import Modulo, Studente
from mongoengine import DoesNotExist, ValidationError
from app.utils import Auto_Gen_Data


modulo_bp = Blueprint('modulo_bp', __name__)

#! /seed per la generazione automatica dei moduli
@modulo_bp.route("/seed", methods = ["GET","POST"])
def seed_moduli():
    fake_moduli = Auto_Gen_Data.generazione_fake_modulo(5)
        
    moduli_salvati = []
    for m in fake_moduli:
        modulo = Modulo(**m)
        modulo.save()
        moduli_salvati.append(modulo.nome)
        
    return jsonify({
                    "Messaggio": "Generazione de dati andata a buon fine.",
                    "studenti_creati": len(moduli_salvati),
                    "nomi": moduli_salvati
                    }), 201


# GET
@modulo_bp.route('/', methods = ['GET'])
def get_tutti_moduli():
    moduli = Modulo.objects()
    return jsonify(moduli), 200

@modulo_bp.route('/<string:modulo_id>', methods = ['GET'])
def get_modulo(modulo_id):
    try:
        modulo = Modulo.objects.get(id = modulo_id)
        return jsonify(modulo), 200
    except DoesNotExist:
        return jsonify({"Errore" : "Modulo non trovato"}), 404

#! route da utilizzare nel frontend per visualizzare tutti gli studenti inscritti per modulo di selezione in ADMIN MODE
@modulo_bp.route('/<string:modulo_id>/studenti', methods = ['GET'])
def get_studenti_modulo(modulo_id):
    try:
        modulo = Modulo.objects.get(id = modulo_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Modulo non trovato"}), 404
    
    studenti = modulo.get_studenti_iscritti()
    
    return jsonify({
                    "modulo_id": str(modulo.id),
                    "modulo_nome": modulo.nome,
                    "modulo_codice": modulo.codice,
                    "numero_studenti": studenti.count(),
                    "studenti": studenti
                    }), 200

# POST
@modulo_bp.route('/', methods = ['POST'])
def creazione_modulo():
    data = request.json or {}
    
    try:
        modulo = Modulo(**data).save()
        return jsonify(modulo), 201
    except ValidationError as e:
        return jsonify({"Errore" : str(e)}), 400

# PUT
@modulo_bp.route('/<string:modulo_id>', methods = ['PUT'])
def update_modulo(modulo_id):
    data = request.json or {}
    
    try:
        modulo = Modulo.objects.get(id = modulo_id)
    except DoesNotExist:
        return jsonify({"Errore": "Modulo inesistente"}), 404
    
    try:
        modulo.update(**data)
        modulo.reload()
        return jsonify(modulo), 200
    except ValidationError as e:
        return jsonify({"Errore" : str(e)}), 400

# DELETE
@modulo_bp.route('/<string:modulo_id>', methods = ['DELETE'])
def elimina_modulo(modulo_id):
    try:
        modulo = Modulo.objects.get(id = modulo_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Modulo non Trovato"}), 404
    
    modulo.delete()
    return jsonify({"Messaggio" : "Modulo eliminato"}), 200
        