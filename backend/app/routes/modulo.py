from flask import request, Blueprint
from app.models import Modulo

modulo_bp = Blueprint('modulo_bp', __name__)