from flask import request, Blueprint, jsonify
from datetime import datetime
from pydantic import ValidationError
from app.schemas import (
    StudenteCreate,
    StudenteUpdate,
    StudenteResponse,
    StudenteListResponse,
    StudenteMediaVoti
)
from app.schemas.studente_schema import ModuloSummary, EsameSummary
from app.repositories import studente_repository, modulo_repository, esame_repository
from app.services import InscrizioneService, Operazioni
from app.utils import Auto_Gen_Data
from app.utils.serializers import serialize_document

studente_bp = Blueprint('studente_bp', __name__)


def build_studente_response(studente_doc, include_details=False):
    if not studente_doc:
        return None
    
    response = {
                    '_id': str(studente_doc['_id']),
                    'nome': studente_doc['nome'],
                    'cognome': studente_doc['cognome'],
                    'email': studente_doc['email'],
                    'moduli': [],
                    'esami': []
                }
    
    moduli_ids = studente_doc.get('moduli', [])
    for modulo_id in moduli_ids:
        modulo = modulo_repository.find_by_id(str(modulo_id))
        if modulo:
            response['moduli'].append({
                                            '_id': str(modulo['_id']),
                                            'nome': modulo['nome'],
                                            'codice': modulo['codice'],
                                            'totale_ore': modulo['totale_ore']
                                        })
    
    if include_details:
        esami_ids = studente_doc.get('esami', [])
        for esame_id in esami_ids:
            esame = esame_repository.find_by_id(str(esame_id))
            if esame:
                esame_data = {
                                '_id': str(esame['_id']),
                                'data': esame['data'].isoformat() if isinstance(esame['data'], datetime) else esame['data'],
                                'voto': esame['voto'],
                                'modulo': None
                            }
                
                modulo = modulo_repository.find_by_id(str(esame['modulo']))
                if modulo:
                    esame_data['modulo'] = {
                                                '_id': str(modulo['_id']),
                                                'nome': modulo['nome']
                                            }
                
                response['esami'].append(esame_data)
    else:
        response['esami'] = [str(eid) for eid in studente_doc.get('esami', [])]
    
    return response


# generrazione di dati di studenti fittizi con faker per il testing
@studente_bp.route("/seed", methods=["GET", "POST"])
def seed_studenti():
    fake_studenti = Auto_Gen_Data.generazione_fake_studente(10)
    
    studenti_salvati = []
    for s in fake_studenti:
        if studente_repository.email_exists(s['email']):
            continue
        
        s['moduli'] = []
        s['esami'] = []
        
        result = studente_repository.insert_one(s)
        studenti_salvati.append(s['email'])
    
    return jsonify({
                        "Messaggio": "Generazione de dati andata a buon fine.",
                        "studenti_creati": len(studenti_salvati),
                        "emails": studenti_salvati
                    }), 201


# GET METHODS
@studente_bp.route('/', methods=['GET'])
def get_tutti_studenti():
    studenti = studente_repository.find_all()
    return jsonify([build_studente_response(s) for s in studenti]), 200


@studente_bp.route('/<string:studente_id>', methods=['GET'])
def get_studente(studente_id):
    studente = studente_repository.find_by_id(studente_id)
    
    if not studente:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
    return jsonify(build_studente_response(studente, include_details=True)), 200


@studente_bp.route('/<string:studente_id>/media-voti', methods=['GET'])
def get_media_voti_studente(studente_id):
    studente = studente_repository.find_by_id(studente_id)
    
    if not studente:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
    media_info = Operazioni.calcolo_media_studente(studente_id)
    
    if not media_info:
        return jsonify({
                            "studente_id": str(studente['_id']),
                            "nome": studente['nome'],
                            "cognome": studente['cognome'],
                            "messaggio": "Nessun esame trovato"
                        }), 200
    
    return jsonify({
                        "studente_id": str(studente['_id']),
                        "nome": studente['nome'],
                        "cognome": studente['cognome'],
                        **media_info
                    }), 200


# POST METHOD
@studente_bp.route('/', methods=['POST'])
def creazione_studente():
    data = request.json or {}
    
    try:
        studente_create = StudenteCreate(**data)
        
        if studente_repository.email_exists(studente_create.email):
            return jsonify({"Errore": "Email già esistente"}), 400
        
        studente_data = studente_create.model_dump()
        studente_data['moduli'] = []
        studente_data['esami'] = []
        
        result = studente_repository.insert_one(studente_data)
        
        studente = studente_repository.find_by_id(str(result.inserted_id))
        
        return jsonify(build_studente_response(studente)), 201
        
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400


# PUT METHOD
@studente_bp.route('/<string:studente_id>', methods=['PUT'])
def update_studente(studente_id):
    data = request.json or {}
    
    studente = studente_repository.find_by_id(studente_id)
    if not studente:
        return jsonify({"Errore": "Studente inesistente"}), 404
    
    try:
        studente_update = StudenteUpdate(**data)
        
        if studente_update.email and studente_repository.email_exists(
            studente_update.email, exclude_id=studente_id
        ):
            return jsonify({"Errore": "Email già esistente"}), 400
        
        update_data = studente_update.model_dump(exclude_none=True)
        if update_data:
            studente_repository.update_one(studente_id, update_data)
        
        studente = studente_repository.find_by_id(studente_id)
        
        return jsonify(build_studente_response(studente)), 200
        
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400


# DELETE METHOD
@studente_bp.route('/<string:studente_id>', methods=['DELETE'])
def elimina_studente(studente_id):
    studente = studente_repository.find_by_id(studente_id)
    
    if not studente:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
    esame_repository.delete_by_studente(studente_id)
    
    studente_repository.delete_one(studente_id)
    
    return jsonify({"Messaggio": "Studente eliminato"}), 200

# POST METHOD per l'iscrizione di studente nel modulo
@studente_bp.route('/<string:studente_id>/moduli', methods=['POST'])
def aggiungi_modulo_a_studente(studente_id):
    data = request.json or {}
    modulo_id = data.get('modulo_id')
    
    if not modulo_id:
        return jsonify({"Errore": "modulo_id richiesto"}), 400
    
    studente = studente_repository.find_by_id(studente_id)
    if not studente:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
    modulo = modulo_repository.find_by_id(modulo_id)
    if not modulo:
        return jsonify({"Errore": "Modulo non trovato"}), 404
    
    if not InscrizioneService.inscrivi_studente_in_modulo(studente_id, modulo_id):
        return jsonify({"Errore": "Modulo già presente nello Studente"}), 400
    
    studente = studente_repository.find_by_id(studente_id)
    
    return jsonify(build_studente_response(studente)), 200

# DELETE METHOD per deinscriver uno studente da un modulo
@studente_bp.delete("/<string:studente_id>/moduli/<string:modulo_id>")
def remove_modulo_da_studente(studente_id: str, modulo_id: str):
    studente = studente_repository.find_by_id(studente_id)
    if not studente:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
    modulo = modulo_repository.find_by_id(modulo_id)
    if not modulo:
        return jsonify({"Errore": "Modulo non trovato"}), 404
    
    if not InscrizioneService.rimuovi_studente_da_modulo(studente_id, modulo_id):
        return jsonify({"Errore": "Modulo non presente nello studente"}), 400
    
    studente = studente_repository.find_by_id(studente_id)
    
    return jsonify(build_studente_response(studente)), 200