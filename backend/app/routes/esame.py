from flask import request, Blueprint
from models import Esame

esame_bp = Blueprint('esame_bp', __name__)