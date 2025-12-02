from app.schemas.studente_schema import (
    StudenteCreate,
    StudenteUpdate,
    StudenteInDB,
    StudenteResponse,
    StudenteListResponse,
    StudenteMediaVoti
)
from app.schemas.modulo_schema import (
    ModuloCreate,
    ModuloUpdate,
    ModuloInDB,
    ModuloResponse,
    ModuloWithStudenti
)
from app.schemas.esame_schema import (
    EsameCreate,
    EsameUpdate,
    EsameInDB,
    EsameResponse
)

__all__ = [
    'StudenteCreate',
    'StudenteUpdate',
    'StudenteInDB',
    'StudenteResponse',
    'StudenteListResponse',
    'StudenteMediaVoti',
    'ModuloCreate',
    'ModuloUpdate',
    'ModuloInDB',
    'ModuloResponse',
    'ModuloWithStudenti',
    'EsameCreate',
    'EsameUpdate',
    'EsameInDB',
    'EsameResponse',
]
