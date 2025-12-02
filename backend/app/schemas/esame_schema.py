from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.utils.objectid_utils import PyObjectId


class EsameBase(BaseModel):
    data: datetime
    voto: int = Field(..., ge=0, le=30)
    note: Optional[str] = Field(None, max_length=500)
    
    @field_validator('voto')
    @classmethod
    def validate_voto(cls, v: int) -> int:
        if v < 0 or v > 30:
            raise ValueError('Voto must be between 0 and 30')
        return v


class EsameCreate(EsameBase):
    studente_id: str
    modulo_id: str
    
    @field_validator('studente_id', 'modulo_id')
    @classmethod
    def validate_objectid_format(cls, v: str) -> str:
        from app.utils.objectid_utils import validate_objectid
        if not validate_objectid(v):
            raise ValueError(f'Invalid ObjectId format: {v}')
        return v


class EsameUpdate(BaseModel):
    data: Optional[datetime] = None
    voto: Optional[int] = Field(None, ge=0, le=30)
    note: Optional[str] = Field(None, max_length=500)
    
    @field_validator('voto')
    @classmethod
    def validate_voto(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and (v < 0 or v > 30):
            raise ValueError('Voto must be between 0 and 30')
        return v


class EsameInDB(EsameBase):
    id: PyObjectId = Field(alias="_id")
    studente: PyObjectId
    modulo: PyObjectId
    
    model_config = ConfigDict(
                                populate_by_name=True,
                                arbitrary_types_allowed=True,
                                json_encoders={PyObjectId: str}
                            )


class StudenteForEsame(BaseModel):
    id: str = Field(alias="_id")
    nome: str
    cognome: str
    email: str
    
    model_config = ConfigDict(populate_by_name=True)


class ModuloForEsame(BaseModel):
    id: str = Field(alias="_id")
    nome: int
    codice: str
    totale_ore: int
    
    model_config = ConfigDict(populate_by_name=True)


class EsameResponse(BaseModel):
    id: str = Field(alias="_id")
    studente: Optional[StudenteForEsame] = None
    modulo: Optional[ModuloForEsame] = None
    data: str 
    voto: int
    note: str = ""
    
    model_config = ConfigDict(populate_by_name=True)
