from app.repositories.base_repository import BaseRepository
from app.repositories.studente_repository import StudenteRepository, studente_repository
from app.repositories.modulo_repository import ModuloRepository, modulo_repository
from app.repositories.esame_repository import EsameRepository, esame_repository

__all__ = [
    'BaseRepository',
    'StudenteRepository',
    'studente_repository',
    'ModuloRepository',
    'modulo_repository',
    'EsameRepository',
    'esame_repository',
]
