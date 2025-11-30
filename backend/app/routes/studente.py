from flask import request, Blueprint, jsonify
from app.models import Studente, Modulo, Esame
from app.utils import Auto_Gen_Data
from app.services import InscrizioneService
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
        studente: Studente = Studente.objects.get(id = studente_id)
        return jsonify(studente), 200
    except DoesNotExist:
        return jsonify({"Errore": "Studente non trovato"}), 404

@studente_bp.route('/<string:studente_id>/media-voti', methods = ['GET'])
def get_media_voti_studente(studente_id):
    try:
        studente: Studente = Studente.objects.get(id = studente_id)
    except DoesNotExist:
        return jsonify({"Errore": "Studente non trovato"}), 404
    
    media_info = studente.get_media_voti()
    
    if not media_info:
        return jsonify({
                        "studente_id": str(studente.id),
                        "nome": studente.nome,
                        "cognome": studente.cognome,
                        "messaggio": "Nessun esame trovato"
                        }), 200
    
    return jsonify({
                    "studente_id": str(studente.id),
                    "nome": studente.nome,
                    "cognome": studente.cognome,
                    **media_info
                    }), 200
    
# POST
@studente_bp.route('/', methods = ['POST'])
def creazione_studente():
    #! da notare che la or {} è una fallback nel caso la request fosse None
    data = request.json or {}
    
    try:
        studente: Studente = Studente(**data).save()
        return jsonify(studente), 201
    except ValidationError as e:
        return jsonify({"Errore" : str(e)}), 400

# PUT
@studente_bp.route('/<string:studente_id>', methods = ['PUT'])
def update_studente(studente_id):
    data = request.json or {}
    
    try:
        studente: Studente = Studente.objects.get(id = studente_id)
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
        studente: Studente = Studente.objects.get(id = studente_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Studente non trovato"}), 404
    
    # qui vengono eliminati tutti gli esami associati allo studente
    Esame.objects(studente=studente).delete()
    
    studente.delete()
    return jsonify({"Messaggio" : "Studente eliminato"}), 200


#! POST e DELETE pe aggiungere i moduli dalla lista in Studente

# POST
@studente_bp.route('/<string:studente_id>/moduli', methods = ['POST'])
def aggiungi_modulo_a_studente(studente_id):
    data = request.json or {}
    modulo_id = data.get('modulo_id')
    
    if not modulo_id:
        return jsonify({"Errore" : "modulo_id richiesto"}), 400
    
    try:
        studente: Studente = Studente.objects.get(id = studente_id)
        modulo: Modulo = Modulo.objects.get(id = modulo_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Studente o Modulo non trovato"}), 404
    
    #  controlla service per gestire l'iscrizione
    if not InscrizioneService.inscrivi_studente_in_modulo(studente, modulo):
        return jsonify({"Errore": "Modulo già presente nello Studente"}), 400
    
    return jsonify(studente), 200

# DELETE
@studente_bp.delete("/<string:studente_id>/moduli/<string:modulo_id>")
def remove_modulo_da_studente(studente_id: str, modulo_id: str) -> tuple:
    try:
        studente: Studente = Studente.objects.get(id = studente_id)
        modulo: Modulo = Modulo.objects.get(id = modulo_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Studente o modulo non trovato"}), 404

    # controlla service per rimuovere l'iscrizione
    if not InscrizioneService.rimuovi_studente_da_modulo(studente, modulo):
        return jsonify({"Errore" : "Modulo non presente nello studente"}), 400

    return jsonify(studente), 200