from flask import request, Blueprint, jsonify
from app.models import Esame, Studente, Modulo
from datetime import datetime
from app.utils import Auto_Gen_Data
from mongoengine import DoesNotExist, ValidationError

esame_bp = Blueprint('esame_bp', __name__)

@esame_bp.route("/seed", methods = ["GET","POST"])
def seed_esami():
    try:
        studenti = list(Studente.objects())
        moduli = list(Modulo.objects())
        
        if not studenti:
            return jsonify({"Errore": "Nessun studente trovato. Esegui prima /studenti/seed"}), 400
        
        if not moduli:
            return jsonify({"Errore": "Nessun modulo trovato. Esegui prima /moduli/seed"}), 400
        
        esami_salvati = []
        for studente in studenti:
            for modulo in moduli[:3]:
                fake_esami = Auto_Gen_Data.generazione_fake_esame(studente.id, modulo.id, 1)
                for esame_data in fake_esami:
                    esame = Esame(**esame_data)
                    esame.save()
                    esami_salvati.append(str(esame.id))
        
        return jsonify({
            "Messaggio": "Generazione esami andata a buon fine.",
            "esami_creati": len(esami_salvati),
            "studenti_coinvolti": len(studenti),
            "moduli_utilizzati": min(3, len(moduli))
        }), 201
        
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500

# GET
@esame_bp.route('/', methods = ['GET'])
def get_tutti_esami():
    esami = Esame.objects()
    return jsonify(esami), 200


@esame_bp.route('/<string:esame_id>', methods = ['GET'])
def get_esame(esame_id):
    try:
        esame = Esame.objects.get(id = esame_id)
        return jsonify(esame), 200
    except DoesNotExist:
        return jsonify({"Errore": "Esame non trovato"}), 404

@esame_bp.route('/filtro', methods = ['GET'])
def filtra_esami_per_voto():
    voto_minimo = request.args.get('voto_minimo', default=24, type=int)
    
    try:
        esami = Esame.objects(voto__gte=voto_minimo)
        
        if not esami:
            return jsonify({
                            "messaggio": f"Nessun esame trovato con voto >= {voto_minimo}",
                            "voto_minimo": voto_minimo,
                            "risultati": []
                            }), 200
        
        return jsonify({
                        "voto_minimo": voto_minimo,
                        "numero_risultati": esami.count(),
                        "esami": esami
                        }), 200
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500
    
# POST
@esame_bp.route('/', methods = ['POST'])
def creazione_esame():
    data = request.json or {}
    studente_id = data.get('studente_id')
    modulo_id = data.get('modulo_id')
    data_str = data.get('data') #! (ricorda) che sia sempre in formato iso YYYY-MM-DD
    
    if not all([studente_id, modulo_id, data_str, data.get('voto') is not None]):
        return jsonify({"Errore":"studente_id, modulo_id, data e voto sono obbligatori"}), 400
    
    try:
        studente: Studente = Studente.objects.get(id = studente_id)
        modulo: Modulo = Modulo.objects.get(id = modulo_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Studente non trovato"}), 404
    
    try:
        data_esame = datetime.fromisoformat(data_str)
    except ValueError:
        return jsonify({"Errore" : "Formato non valido, usare (YYYY-MM-DD)"}), 400
    
    esame = Esame(
                    studente = studente,
                    modulo = modulo,
                    data = data_esame,
                    voto = data['voto'],
                    note = data.get('note', ''),
                )
    
    try:
        esame.save()
    except ValidationError as e:
        return jsonify({"Errore": str(e)}), 400
    
    studente.esami.append(esame)
    studente.save()
    
    return jsonify(esame), 201

# PUT
@esame_bp.route("/<string:esame_id>", methods = ['PUT'])
def update_esame(esame_id: str):
    data = request.json or {}

    try:
        esame: Esame = Esame.objects.get(id = esame_id)
    except DoesNotExist:
        return jsonify({"Errore" : "Esame non trovato"}), 404

    if "voto" in data:
        esame.voto = data["voto"]
    if "note" in data:
        esame.note = data["note"]
    if "data" in data:
        try:
            esame.data = datetime.fromisoformat(data["data"])
        except ValueError:
            return jsonify({"Errore" : "Formato data non valido, usare YYYY-MM-DD"}), 400

    try:
        esame.save()
        return jsonify(esame), 200
    except ValidationError as e:
        return jsonify({"Errore" : str(e)}), 400

# DELETE
@esame_bp.delete("/<string:esame_id>")
def delete_exam(esame_id: str):
    try:
        esame: Esame = Esame.objects.get(id=esame_id)
    except DoesNotExist:
        return jsonify({"Errore":"Esame non trovato"}), 404

    studente: Studente = esame.studente
    if esame in studente.esami:
        studente.esami.remove(esame)
        studente.save()

    esame.delete()

    return jsonify({"Messaggio": "Esame eliminato"}), 200