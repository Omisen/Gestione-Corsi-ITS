from flask import request, Blueprint
from models import Studente
from utils import Auto_Gen_Data

studente_bp = Blueprint('studente_bp', __name__)

@studente_bp.route("/seed", methods = ["POST"])
def seed_studenti():
    #? per il test ricordiamoci di controllare il DB per certezza
    fake_studenti = Auto_Gen_Data.generazione_fake_studente(10)
    
    for s in fake_studenti:
        Studente(**s).save()
        
    return {"Messaggio" : "Generazione de dati andata a buon fine."}, 201