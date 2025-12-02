"""Flask application factory."""
from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.database import init_db, close_connection
import atexit


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Initialize MongoDB connection
    with app.app_context():
        init_db()
    
    # Register cleanup on shutdown
    atexit.register(close_connection)
    
    # Register blueprints
    from app.routes import studente_bp, modulo_bp, esame_bp
    
    app.register_blueprint(studente_bp, url_prefix='/studenti')
    app.register_blueprint(modulo_bp, url_prefix='/moduli')
    app.register_blueprint(esame_bp, url_prefix='/esami')
    
    return app