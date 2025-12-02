from flask import Blueprint, jsonify, request
from app.services.stats_service import StatsService
from datetime import datetime

stats_bp = Blueprint('stats_bp', __name__)


@stats_bp.route('/overview', methods=['GET'])
def get_overview():
    try:
        overview = StatsService.get_overview_generale()
        return jsonify(overview), 200
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500


@stats_bp.route('/media-voti-moduli', methods=['GET'])
def get_media_voti_moduli():
    try:
        results = StatsService.get_media_voti_per_modulo()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500


@stats_bp.route('/studenti-per-modulo', methods=['GET'])
def get_studenti_modulo():
    try:
        results = StatsService.get_studenti_per_modulo()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500


@stats_bp.route('/distribuzione-voti', methods=['GET'])
def get_distribuzione_voti():
    try:
        modulo_id = request.args.get('modulo_id')
        results = StatsService.get_distribuzione_voti(modulo_id)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500


@stats_bp.route('/tasso-successo', methods=['GET'])
def get_tasso_successo():
    try:
        results = StatsService.get_tasso_successo_per_modulo()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500


@stats_bp.route('/esami-temporale', methods=['GET'])
def get_esami_temporale():
    try:
        data_inizio_str = request.args.get('data_inizio')
        data_fine_str = request.args.get('data_fine')
        
        data_inizio = None
        data_fine = None
        
        if data_inizio_str:
            data_inizio = datetime.fromisoformat(data_inizio_str)
        if data_fine_str:
            data_fine = datetime.fromisoformat(data_fine_str)
        
        results = StatsService.get_esami_per_periodo(data_inizio, data_fine)
        return jsonify(results), 200
    except ValueError:
        return jsonify({"Errore": "Formato data non valido. Usare YYYY-MM-DD"}), 400
    except Exception as e:
        return jsonify({"Errore": str(e)}), 500
