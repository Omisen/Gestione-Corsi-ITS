from flask import request, Blueprint, jsonify
from app.models import Studente
from app.utils import Auto_Gen_Data

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
    