from flask import request, Blueprint, jsonify
from pydantic import ValidationError
from app.schemas import ModuloCreate, ModuloUpdate
from app.repositories import modulo_repository, studente_repository
from app.utils import Auto_Gen_Data
from app.utils.serializers import serialize_document

modulo_bp = Blueprint('modulo_bp', __name__)


def build_modulo_response(modulo_doc):
    if not modulo_doc:
        return None
    
    return {
                '_id': str(modulo_doc['_id']),
                'nome': modulo_doc['nome'],
                'codice': modulo_doc['codice'],
                'totale_ore': modulo_doc['totale_ore'],
                'descrizione': modulo_doc.get('descrizione', '')
            }

# generazione di dati fittizi per i moduli
@modulo_bp.route("/seed", methods=["GET", "POST"])
def seed_moduli():
    fake_moduli = Auto_Gen_Data.generazione_fake_modulo(5)
    
    moduli_salvati = []
    for m in fake_moduli:
        if modulo_repository.codice_exists(m['codice']):
            continue
        
        m['nome'] = modulo_repository.get_next_nome_sequence()
        
        result = modulo_repository.insert_one(m)
        moduli_salvati.append(m['nome'])
    
    return jsonify({
                        "Messaggio": "Generazione de dati andata a buon fine.",
                        "moduli_creati": len(moduli_salvati),
                        "nomi": moduli_salvati
                    }), 201

# GET METHODS
@modulo_bp.route('/', methods=['GET'])
def get_tutti_moduli():
    moduli = modulo_repository.find_all()
    return jsonify([build_modulo_response(m) for m in moduli]), 200


@modulo_bp.route('/<string:modulo_id>', methods=['GET'])
def get_modulo(modulo_id):
    modulo = modulo_repository.find_by_id(modulo_id)
    
    if not modulo:
        return jsonify({"Errore": "Modulo non trovato"}), 404
    
    return jsonify(build_modulo_response(modulo)), 200


@modulo_bp.route('/<string:modulo_id>/studenti', methods=['GET'])
def get_studenti_modulo(modulo_id):
    modulo = modulo_repository.find_by_id(modulo_id)
    
    if not modulo:
        return jsonify({"Errore": "Modulo non trovato"}), 404
    
    studenti = modulo_repository.find_studenti_iscritti(modulo_id)
    
    studenti_data = []
    for s in studenti:
        studenti_data.append({
                                '_id': str(s['_id']),
                                'nome': s['nome'],
                                'cognome': s['cognome'],
                                'email': s['email']
                            })
    
    return jsonify({
                        "modulo_id": str(modulo['_id']),
                        "modulo_nome": modulo['nome'],
                        "modulo_codice": modulo['codice'],
                        "numero_studenti": len(studenti_data),
                        "studenti": studenti_data
                    }), 200


# POST METHOD
@modulo_bp.route('/', methods=['POST'])
def creazione_modulo():
    data = request.json or {}
    
    try:
        modulo_create = ModuloCreate(**data)
        
        if modulo_repository.codice_exists(modulo_create.codice):
            return jsonify({"Errore": "Codice già esistente"}), 400
        
        modulo_data = modulo_create.model_dump()
        
        modulo_data['nome'] = modulo_repository.get_next_nome_sequence()
        
        result = modulo_repository.insert_one(modulo_data)
        
        modulo = modulo_repository.find_by_id(str(result.inserted_id))
        
        return jsonify(build_modulo_response(modulo)), 201
        
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400

# PUT METHOD
@modulo_bp.route('/<string:modulo_id>', methods=['PUT'])
def update_modulo(modulo_id):
    data = request.json or {}
    
    modulo = modulo_repository.find_by_id(modulo_id)
    if not modulo:
        return jsonify({"Errore": "Modulo inesistente"}), 404
    
    try:
        modulo_update = ModuloUpdate(**data)
        
        if modulo_update.codice and modulo_repository.codice_exists(
            modulo_update.codice, exclude_id=modulo_id
        ):
            return jsonify({"Errore": "Codice già esistente"}), 400
        
        update_data = modulo_update.model_dump(exclude_none=True)
        if update_data:
            modulo_repository.update_one(modulo_id, update_data)
        
        modulo = modulo_repository.find_by_id(modulo_id)
        
        return jsonify(build_modulo_response(modulo)), 200
        
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400


# DELETE METHOD
@modulo_bp.route('/<string:modulo_id>', methods=['DELETE'])
def elimina_modulo(modulo_id):
    modulo = modulo_repository.find_by_id(modulo_id)
    
    if not modulo:
        return jsonify({"Errore": "Modulo non Trovato"}), 404
    
    modulo_repository.delete_one(modulo_id)
    
    return jsonify({"Messaggio": "Modulo eliminato"}), 200