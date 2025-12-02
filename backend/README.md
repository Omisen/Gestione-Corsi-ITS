# Backend – Gestione Corsi ITS

## Descrizione
- Backend REST API costruito con Flask e PyMongo.
- Architettura modulare con **Application Factory Pattern** per configurazioni multiple.
- Validazione dati con **Pydantic v2** per type safety e serializzazione automatica.
- Database **MongoDB** con driver nativo PyMongo per performance ottimali.
- CORS abilitato per comunicazione cross-origin con frontend React.

## Architettura

### Stack Tecnologico
- **Framework**: Flask 3.1.2
- **Database**: MongoDB (PyMongo 4.15.4)
- **Validazione**: Pydantic 2.x + Pydantic Settings
- **CORS**: Flask-Cors 5.0.0
- **Testing**: Faker per dati di esempio

### Struttura Directory
```
backend/
├── run.py                    # Entrypoint applicazione
├── requirements.txt          # Dipendenze Python
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configurazioni (dev/prod)
│   ├── database.py          # Connessione MongoDB
│   ├── schemas/             # Pydantic models per validazione
│   │   ├── studente_schema.py
│   │   ├── modulo_schema.py
│   │   └── esame_schema.py
│   ├── repositories/        # Data access layer (MongoDB queries)
│   │   ├── studente_repository.py
│   │   ├── modulo_repository.py
│   │   └── esame_repository.py
│   ├── routes/              # Blueprints REST API
│   │   ├── studente.py
│   │   ├── modulo.py
│   │   └── esame.py
│   ├── services/            # Business logic
│   │   ├── inscrizioniService.py
│   │   └── operazioni.py
│   └── utils/               # Helper functions
│       ├── serializers.py
│       ├── objectid_utils.py
│       └── auto_gen_faker_data.py
```

### Pattern Architetturali
- **Repository Pattern**: Separazione logica database da business logic
- **Pydantic Schemas**: Validazione input/output automatica con type hints
- **Blueprints**: Organizzazione routes per risorsa (studenti, moduli, esami)
- **Serialization Helpers**: Conversione automatica ObjectId ↔ string

## Prerequisiti
- **Python 3.10+** (testato con Python 3.13)
- **MongoDB** in esecuzione su `localhost:27017`
- **Virtual Environment** (venv) per isolamento dipendenze

## Setup e Installazione

### 1. Creazione ambiente virtuale
```powershell
# Dalla directory backend/
python -m venv .venv
& .\.venv\Scripts\Activate.ps1  # Windows PowerShell
# oppure: source .venv/bin/activate  # Linux/Mac
```

### 2. Installazione dipendenze
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configurazione ambiente
Crea un file `.env` nella directory `backend/` (opzionale):
```env
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=gestore-corsi
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
```

### 4. Avvio del server
```powershell
# Assicurati che MongoDB sia in esecuzione
python run.py
```

Il server sarà disponibile su **http://127.0.0.1:5000**

## Configurazione Database

### MongoDB Setup
- **Host**: localhost
- **Porta**: 27017
- **Database**: gestore-corsi
- **Collections**: studenti, moduli, esami

La connessione viene gestita in `app/database.py` con pooling automatico.

---

## API Routes

### Studenti (`/studenti`)

#### Seed
- **GET/POST** `/studenti/seed` - Genera 10 studenti fake per testing

#### CRUD Base
- **GET** `/studenti/` - Ottieni tutti gli studenti
- **GET** `/studenti/<studente_id>` - Ottieni un singolo studente
- **POST** `/studenti/` - Crea un nuovo studente
  ```json
  {
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario.rossi@example.com"
  }
  ```
- **PUT** `/studenti/<studente_id>` - Aggiorna uno studente
- **DELETE** `/studenti/<studente_id>` - Elimina uno studente (elimina anche i suoi esami)

#### Funzionalità Avanzate
- **GET** `/studenti/<studente_id>/media-voti` - Calcola la media voti dello studente
  - Ritorna: media, numero esami, voto min/max
- **POST** `/studenti/<studente_id>/moduli` - Iscrive studente a un modulo
  ```json
  {
    "modulo_id": "673a1b2c..."
  }
  ```
- **DELETE** `/studenti/<studente_id>/moduli/<modulo_id>` - Rimuove iscrizione al modulo

---

### Moduli (`/moduli`)

#### Seed
- **GET/POST** `/moduli/seed` - Genera moduli fake per testing

#### CRUD Base
- **GET** `/moduli/` - Ottieni tutti i moduli
- **GET** `/moduli/<modulo_id>` - Ottieni un singolo modulo
- **POST** `/moduli/` - Crea un nuovo modulo
  ```json
  {
    "nome": "Programmazione Web",
    "codice": "MOD-001",
    "totale_ore": 40,
    "descrizione": "Corso di sviluppo web"
  }
  ```
- **PUT** `/moduli/<modulo_id>` - Aggiorna un modulo
- **DELETE** `/moduli/<modulo_id>` - Elimina un modulo

---

### Esami (`/esami`)

#### Seed
- **GET/POST** `/esami/seed` - Genera esami fake collegando studenti e moduli esistenti
  - ⚠️ Richiede che esistano studenti e moduli nel database

#### CRUD Base
- **GET** `/esami/` - Ottieni tutti gli esami
- **GET** `/esami/<esame_id>` - Ottieni un singolo esame
- **POST** `/esami/` - Crea un nuovo esame
  ```json
  {
    "studente_id": "673a1b2c...",
    "modulo_id": "673a1b2c...",
    "data": "2025-11-30",
    "voto": 28,
    "note": "Ottimo risultato"
  }
  ```
- **PUT** `/esami/<esame_id>` - Aggiorna un esame (voto, data, note)
- **DELETE** `/esami/<esame_id>` - Elimina un esame (rimuove riferimento dallo studente)

#### Funzionalità Avanzate
- **GET** `/esami/filtro?voto_minimo=24` - Filtra esami per voto minimo
  - Query param opzionale: `voto_minimo` (default: 24)
  - Esempio: `/esami/filtro?voto_minimo=28`

---

## Note Tecniche

### Validazione con Pydantic
Tutti gli input API sono validati automaticamente tramite Pydantic schemas:
- **Type Safety**: Controllo tipi a runtime con type hints Python
- **Serializzazione Automatica**: Conversione JSON ↔ Python objects
- **Validatori Custom**: Email validation, ObjectId conversion, date parsing
- **Error Messages**: Messaggi di errore dettagliati per validazioni fallite

Esempi schemas in `app/schemas/`:
```python
# StudenteCreate schema
class StudenteCreate(BaseModel):
    nome: str = Field(..., min_length=1, max_length=100)
    cognome: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
```

### Repository Pattern
Separazione tra logica di accesso ai dati e business logic:
- **Repositories** (`app/repositories/`): Query MongoDB pure
- **Services** (`app/services/`): Logica di business e orchestrazione
- **Routes** (`app/routes/`): Handling HTTP requests/responses

### Gestione Riferimenti MongoDB
- **Population Manuale**: I riferimenti ObjectId vengono popolati con documenti completi
- **Serializzazione Custom**: Helper functions in `app/routes/` per costruire response con dati nidificati
- Esempio: `build_studente_response()` popola automaticamente `moduli[]` con oggetti completi

### CORS Configuration
Flask-Cors abilitato per permettere richieste da frontend React:
```python
CORS(app)  # Permette tutte le origins in development
```

---

## Testing Rapido

### 1. Popola il database
```powershell
# Genera studenti
Invoke-RestMethod -Uri http://localhost:5000/studenti/seed -Method Post

# Genera moduli
Invoke-RestMethod -Uri http://localhost:5000/moduli/seed -Method Post

# Genera esami (richiede studenti e moduli)
Invoke-RestMethod -Uri http://localhost:5000/esami/seed -Method Post
```

### 2. Test funzionalità
```powershell
# Media voti di uno studente (sostituisci <id> con ID reale)
Invoke-RestMethod -Uri "http://localhost:5000/studenti/<id>/media-voti"

# Filtra esami con voto >= 24
Invoke-RestMethod -Uri "http://localhost:5000/esami/filtro"

# Filtra esami con voto >= 28
Invoke-RestMethod -Uri "http://localhost:5000/esami/filtro?voto_minimo=28"

# Lista tutti gli studenti con moduli popolati
Invoke-RestMethod -Uri "http://localhost:5000/studenti/"
```

---

## Dipendenze Principali

```
Flask==3.1.2              # Web framework
pymongo==4.15.4           # MongoDB driver nativo
pydantic>=2.0.0           # Validazione e serializzazione dati
pydantic-settings>=2.0.0  # Gestione configurazioni
Flask-Cors==5.0.0         # CORS per frontend
Faker==38.2.0             # Generazione dati fake per testing
email-validator>=2.0.0    # Validazione email
python-dateutil==2.9.0    # Parsing date avanzato
```

## Troubleshooting

### MongoDB connection error
```
Errore: pymongo.errors.ServerSelectionTimeoutError
```
**Soluzione**: Verifica che MongoDB sia in esecuzione:
```powershell
# Windows
net start MongoDB

# oppure avvia manualmente mongod
mongod --dbpath <path-to-data-folder>
```

### Pydantic validation errors
```
Errore: Field required / Validation error
```
**Soluzione**: Verifica che tutti i campi obbligatori siano presenti nella richiesta POST/PUT. Consulta gli esempi JSON nella sezione API Routes.

### Port 5000 already in use
```
Errore: OSError: [WinError 10048]
```
**Soluzione**: Cambia porta in `run.py` o termina il processo che occupa la porta 5000.

---

## Changelog

### v2.0.0 - Migrazione PyMongo + Pydantic
- ✅ Migrazione completa da MongoEngine a PyMongo nativo
- ✅ Implementazione Pydantic v2 per validazione
- ✅ Repository pattern per separazione concerns
- ✅ Serializzazione automatica con population manuale riferimenti
- ✅ Rimozione dipendenze MongoEngine e models legacy
- ✅ CORS configuration per frontend React

### v1.0.0 - Iniziale
- Application factory pattern
- Blueprint per organizzazione routes
- MongoEngine ODM (deprecato)

