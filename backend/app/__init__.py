from flask import Flask
from flask_mongoengine import MongoEngine
from app.config import Config

db = MongoEngine()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    return app