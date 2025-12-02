from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.utils.objectid_utils import PyObjectId


class StudenteBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100)
    cognome: str = Field(..., min_length=1, max_length=100)
    email: EmailStr


class StudenteCreate(StudenteBase):
    pass


class StudenteUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=100)
    cognome: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None


class StudenteInDB(StudenteBase):
    id: PyObjectId = Field(alias="_id")
    moduli: List[PyObjectId] = Field(default_factory=list)
    esami: List[PyObjectId] = Field(default_factory=list)
    
    model_config = ConfigDict(
                                populate_by_name=True,
                                arbitrary_types_allowed=True,
                                json_encoders={PyObjectId: str}
                            )


class ModuloSummary(BaseModel):
    id: str = Field(alias="_id")
    nome: str
    codice: str
    totale_ore: int
    model_config = ConfigDict(populate_by_name=True)


class EsameSummary(BaseModel):
    id: str = Field(alias="_id")
    data: str
    voto: int
    modulo: Optional[ModuloSummary] = None
    model_config = ConfigDict(populate_by_name=True)


class StudenteResponse(StudenteBase):
    id: str = Field(alias="_id")
    moduli: List[ModuloSummary] = Field(default_factory=list)
    esami: List[EsameSummary] = Field(default_factory=list)
    model_config = ConfigDict(populate_by_name=True)


class StudenteListResponse(StudenteBase):
    id: str = Field(alias="_id")
    moduli: List[ModuloSummary] = Field(default_factory=list)
    esami: List[str] = Field(default_factory=list)
    model_config = ConfigDict(populate_by_name=True)


class StudenteMediaVoti(BaseModel):
    studente_id: str
    nome: str
    cognome: str
    media: Optional[float] = None
    numero_esami: Optional[int] = None
    voto_minimo: Optional[int] = None
    voto_massimo: Optional[int] = None
    messaggio: Optional[str] = None
