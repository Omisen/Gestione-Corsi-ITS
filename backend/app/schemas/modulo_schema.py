from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.utils.objectid_utils import PyObjectId


class ModuloBase(BaseModel):
    codice: str = Field(..., min_length=1, max_length=50)
    totale_ore: int = Field(..., gt=0)
    descrizione: Optional[str] = Field(None, max_length=500)


class ModuloCreate(ModuloBase):
    pass


class ModuloUpdate(BaseModel):
    codice: Optional[str] = Field(None, min_length=1, max_length=50)
    totale_ore: Optional[int] = Field(None, gt=0)
    descrizione: Optional[str] = Field(None, max_length=500)


class ModuloInDB(ModuloBase):
    id: PyObjectId = Field(alias="_id")
    nome: int 
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={PyObjectId: str}
    )


class ModuloResponse(ModuloBase):
    id: str = Field(alias="_id")
    nome: int
    
    model_config = ConfigDict(populate_by_name=True)


class StudenteSummary(BaseModel):
    id: str = Field(alias="_id")
    nome: str
    cognome: str
    email: str
    
    model_config = ConfigDict(populate_by_name=True)


class ModuloWithStudenti(ModuloResponse):
    numero_studenti: int
    studenti: List[StudenteSummary] = Field(default_factory=list)
