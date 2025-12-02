"""
Database connection and initialization for PyMongo.
"""
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from app.config import Config

# Global client instance
_client: MongoClient = None
_db: Database = None


def init_db() -> Database:
    """Initialize MongoDB connection and return database instance."""
    global _client, _db
    
    if _db is not None:
        return _db
    
    # Create MongoDB client
    _client = MongoClient(
        host=Config.MONGO_HOST,
        port=Config.MONGO_PORT,
        serverSelectionTimeoutMS=5000
    )
    
    # Get database
    _db = _client[Config.MONGO_DB_NAME]
    
    # Create indexes
    init_indexes()
    
    return _db


def get_database() -> Database:
    """Get the database instance."""
    if _db is None:
        return init_db()
    return _db


def get_collection(name: str) -> Collection:
    """Get a specific collection from the database."""
    db = get_database()
    return db[name]


def init_indexes():
    """Create database indexes for optimal performance and constraints."""
    db = get_database()
    
    # Studente indexes
    studenti = db['studente']
    studenti.create_index('email', unique=True)
    
    # Modulo indexes
    moduli = db['modulo']
    moduli.create_index('codice', unique=True)
    moduli.create_index('nome')
    
    # Esame indexes
    esami = db['esame']
    esami.create_index('studente')
    esami.create_index('modulo')
    esami.create_index('voto')
    esami.create_index('data')


def close_connection():
    """Close the MongoDB connection."""
    global _client, _db
    if _client is not None:
        _client.close()
        _client = None
        _db = None
