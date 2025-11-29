from flask import request, Blueprint, jsonify
from app.models import Modulo
from mongoengine import DoesNotExist


modulo_bp = Blueprint('modulo_bp', __name__)

# GET
@modulo_bp.route('/', methods = ['GET'])
def get_tutti_moduli():
    moduli = Modulo.objects()
    return jsonify(moduli), 200

@modulo_bp.route('/<string:modulo_id>', methods = ['GET'])
def get_modulo(modulo_id):
    try:
        modulo = Modulo.objects(id = modulo_id)
        return jsonify(modulo), 200
    except DoesNotExist:
        return jsonify({"Errore" : "Modulo non trovato"}), 404

# POST

        