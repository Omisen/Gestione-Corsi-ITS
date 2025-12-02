from flask import request, Blueprint, jsonify
from datetime import datetime
from pydantic import ValidationError
from app.schemas import EsameCreate, EsameUpdate
from app.repositories import esame_repository, studente_repository, modulo_repository
from app.services import Operazioni
from app.utils import Auto_Gen_Data
from app.utils.objectid_utils import str_to_objectid

esame_bp = Blueprint('esame_bp', __name__)


def build_esame_response(esame_doc):
   
    if not esame_doc:
        return None
    
    response = {
                    '_id': str(esame_doc['_id']),
                    'data': esame_doc['data'].isoformat() if isinstance(esame_doc['data'], datetime) else esame_doc['data'],
                    'voto': esame_doc['voto'],
                    'note': esame_doc.get('note', ''),
                    'studente': None,
                    'modulo': None
                }
    
    if 'studente_populated' in esame_doc and esame_doc['studente_populated']:
        s = esame_doc['studente_populated']
        response['studente'] = {
                                    '_id': str(s['_id']),
                                    'nome': s['nome'],
                                    'cognome': s['cognome'],
                                    'email': s['email']
                                }
    elif 'studente' in esame_doc:
        studente = studente_repository.find_by_id(str(esame_doc['studente']))
        if studente:
            response['studente'] = {
                                        '_id': str(studente['_id']),
                                        'nome': studente['nome'],
                                        'cognome': studente['cognome'],
                                        'email': studente['email']
                                    }
    
    
    if 'modulo_populated' in esame_doc and esame_doc['modulo_populated']:
        m = esame_doc['modulo_populated']
        response['modulo'] = {
                                '_id': str(m['_id']),
                                'nome': m['nome'],
                                'codice': m['codice'],
                                'totale_ore': m['totale_ore']
                            }
    elif 'modulo' in esame_doc:
        modulo = modulo_repository.find_by_id(str(esame_doc['modulo']))
        if modulo:
            response['modulo'] = {
                                    '_id': str(modulo['_id']),
                                    'nome': modulo['nome'],
                                    'codice': modulo['codice'],
                                    'totale_ore': modulo['totale_ore']
                                }
    
    return response

# Generazione di esami fake per il testing
@esame_bp.route("/seed", methods=["GET", "POST"])
def seed_esami():
    try:
        studenti = studente_repository.find_all()
        moduli = modulo_repository.find_all()
        
        if not studenti:
            return jsonify({"Errore": "Nessun studente trovato. Esegui prima /studenti/seed"}), 400
        
        if not moduli:
            return jsonify({"Errore": "Nessun modulo trovato. Esegui prima /moduli/seed"}), 400
        
        esami_salvati = []
        for studente in studenti:
            studente_id = str(studente['_id'])
            for modulo in moduli[:3]:
                modulo_id = str(modulo['_id'])
                fake_esami = Auto_Gen_Data.generazione_fake_esame(studente_id, modulo_id, 1)
                
                for esame_data in fake_esami:
                    esame_data['studente'] = str_to_objectid(esame_data['studente'])
                    esame_data['modulo'] = str_to_objectid(esame_data['modulo'])
                    
                    result = esame_repository.insert_one(esame_data)
                    esame_id = str(result.inserted_id)
                    esami_salvati.append(esame_id)
                    
                    studente_repository.add_esame(studente_id, esame_id)
                    
                    studente_repository.add_modulo(studente_id, modulo_id)
        
        return jsonify({
                            "Messaggio": "Generazione esami andata a buon fine.",
                            "esami_creati": len(esami_salvati),
                            "studenti_coinvolti": len(studenti),
                            "moduli_utilizzati": min(3, len(moduli))
                        }), 201
        
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500

# GET MTHODS
@esame_bp.route('/', methods=['GET'])
def get_tutti_esami():
    esami = esame_repository.get_all_with_populated_refs()
    return jsonify([build_esame_response(e) for e in esami]), 200


@esame_bp.route('/<string:esame_id>', methods=['GET'])
def get_esame(esame_id):
    esame = esame_repository.get_with_populated_refs(esame_id)
    
    if not esame:
        return jsonify({"Errore": "Esame non trovato"}), 404
    
    return jsonify(build_esame_response(esame)), 200


@esame_bp.route('/filtro', methods=['GET'])
def filtra_esami_per_voto():
    voto_minimo = request.args.get('voto_minimo', default=24, type=int)
    
    try:
        # utilizza il service per filtrare gli esami per voto
        esami = Operazioni.filtra_esami_per_min_voto(voto_minimo)
        
        if not esami:
            return jsonify({
                                "messaggio": f"Nessun esame trovato con voto >= {voto_minimo}",
                                "voto_minimo": voto_minimo,
                                "risultati": []
                            }), 200
        
        esami_response = []
        for esame in esami:
            esami_response.append(build_esame_response(esame))
        
        return jsonify({
                            "voto_minimo": voto_minimo,
                            "numero_risultati": len(esami),
                            "esami": esami_response
                        }), 200
        
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500

# POST METHOD
@esame_bp.route('/', methods=['POST'])
def creazione_esame():
    data = request.json or {}
    
    try:
        esame_create = EsameCreate(**data)
        
        studente = studente_repository.find_by_id(esame_create.studente_id)
        if not studente:
            return jsonify({"Errore": "Studente non trovato"}), 404
        
        modulo = modulo_repository.find_by_id(esame_create.modulo_id)
        if not modulo:
            return jsonify({"Errore": "Modulo non trovato"}), 404
        
        esame_data = {
                        'studente': str_to_objectid(esame_create.studente_id),
                        'modulo': str_to_objectid(esame_create.modulo_id),
                        'data': esame_create.data,
                        'voto': esame_create.voto,
                        'note': esame_create.note or ''
                    }
        
        result = esame_repository.insert_one(esame_data)
        esame_id = str(result.inserted_id)
        
        studente_repository.add_esame(esame_create.studente_id, esame_id)
        
        studente_repository.add_modulo(esame_create.studente_id, esame_create.modulo_id)
        
        esame = esame_repository.get_with_populated_refs(esame_id)
        
        return jsonify(build_esame_response(esame)), 201
        
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400


# PUT METHOD
@esame_bp.route("/<string:esame_id>", methods=['PUT'])
def update_esame(esame_id: str):
    data = request.json or {}
    
    esame = esame_repository.find_by_id(esame_id)
    if not esame:
        return jsonify({"Errore": "Esame non trovato"}), 404
    
    try:
        esame_update = EsameUpdate(**data)
        
        update_data = {}
        
        if esame_update.studente_id is not None:
            studente = studente_repository.find_by_id(esame_update.studente_id)
            if not studente:
                return jsonify({"Errore": "Studente non trovato"}), 404
            
            old_studente_id = str(esame['studente'])
            new_studente_id = esame_update.studente_id
            
            if old_studente_id != new_studente_id:
                studente_repository.remove_esame(old_studente_id, esame_id)
                studente_repository.add_esame(new_studente_id, esame_id)
            
            update_data['studente'] = str_to_objectid(new_studente_id)
        
        if esame_update.modulo_id is not None:
            modulo = modulo_repository.find_by_id(esame_update.modulo_id)
            if not modulo:
                return jsonify({"Errore": "Modulo non trovato"}), 404
            
            old_modulo_id = str(esame['modulo'])
            new_modulo_id = esame_update.modulo_id
            
            if old_modulo_id != new_modulo_id:
                studente_id = esame_update.studente_id if esame_update.studente_id else str(esame['studente'])
                studente_repository.add_modulo(studente_id, new_modulo_id)
            
            update_data['modulo'] = str_to_objectid(new_modulo_id)
        
        if esame_update.data is not None:
            update_data['data'] = esame_update.data
        if esame_update.voto is not None:
            update_data['voto'] = esame_update.voto
        if esame_update.note is not None:
            update_data['note'] = esame_update.note
        
        if update_data:
            esame_repository.update_one(esame_id, update_data)
        
        esame = esame_repository.get_with_populated_refs(esame_id)
        
        return jsonify(build_esame_response(esame)), 200
        
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400

# DELETE METHOD
@esame_bp.delete("/<string:esame_id>")
def delete_exam(esame_id: str):
    esame = esame_repository.find_by_id(esame_id)
    
    if not esame:
        return jsonify({"Errore": "Esame non trovato"}), 404
    
    studente_id = str(esame['studente'])
    studente_repository.remove_esame(studente_id, esame_id)
    
    esame_repository.delete_one(esame_id)
    
    return jsonify({"Messaggio": "Esame eliminato"}), 200