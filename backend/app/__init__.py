from flask import Flask
from flask_mongoengine import MongoEngine
from flask_cors import CORS
from app.config import Config

db = MongoEngine()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    
    from app.routes import studente_bp, modulo_bp, esame_bp
    
    app.register_blueprint(studente_bp, url_prefix = '/studenti')
    app.register_blueprint(modulo_bp, url_prefix = '/moduli')
    app.register_blueprint(esame_bp, url_prefix = '/esami')
    
    return app