from flask import Flask
from flask_mongoengine import MongoEngine
from app.config import Config

db = MongoEngine()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    from routes import studente_bp, modulo_bp, esame_bp
    
    app.register_blueprint(studente_bp, url_prefixe = '/studenti')
    app.register_blueprint(modulo_bp, url_prefixe = '/moduli')
    app.register_blueprint(esame_bp, url_prefixe = '/esami')
    
    return app