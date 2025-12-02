from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class StatsQueryParams(BaseModel):
    modulo_id: Optional[str] = Field(None, description="ID del modulo per filtrare")
    data_inizio: Optional[datetime] = Field(None, description="Data di inizio periodo")
    data_fine: Optional[datetime] = Field(None, description="Data di fine periodo")


class MediaVotiModuloResponse(BaseModel):
    id: str = Field(alias="_id")
    nome_modulo: str
    codice_modulo: str
    media_voto: float
    numero_esami: int
    voto_minimo: int
    voto_massimo: int
    
    class Config:
        populate_by_name = True


class StudentiPerModuloResponse(BaseModel):
    id: str = Field(alias="_id")
    nome_modulo: str
    codice_modulo: str
    numero_studenti: int
    
    class Config:
        populate_by_name = True


class DistribuzioneVotiResponse(BaseModel):
    id: int = Field(alias="_id")
    range: str
    count: int
    
    class Config:
        populate_by_name = True


class TassoSuccessoResponse(BaseModel):
    id: str = Field(alias="_id")
    nome_modulo: str
    codice_modulo: str
    totale_esami: int
    promossi: int
    bocciati: int
    percentuale_successo: float
    
    class Config:
        populate_by_name = True


class EsamiPerPeriodoResponse(BaseModel):
    periodo: str
    anno: int
    mese: int
    numero_esami: int
    media_voto: float


class OverviewGeneraleResponse(BaseModel):
    totale_studenti: int
    totale_moduli: int
    totale_esami: int
    media_voti_generale: float
    voto_minimo: int
    voto_massimo: int
    tasso_successo_percentuale: float
    esami_promossi: int
    esami_bocciati: int
