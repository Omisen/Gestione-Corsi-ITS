from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.database import init_db, close_connection
import atexit


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    with app.app_context():
        init_db()
    
    # per pulire il registro a chiusura della connessione
    atexit.register(close_connection)
    
    from app.routes import studente_bp, modulo_bp, esame_bp
    from app.routes.stats import stats_bp
    
    app.register_blueprint(studente_bp, url_prefix='/studenti')
    app.register_blueprint(modulo_bp, url_prefix='/moduli')
    app.register_blueprint(esame_bp, url_prefix='/esami')
    app.register_blueprint(stats_bp, url_prefix='/stats')
    
    return app