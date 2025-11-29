Backend – Gestione Corsi ITS

Descrizione
- Backend ristrutturato passando da una struttura monolitica a un'applicazione Flask modulare.
- Introdotto il pattern dell'application factory (`create_app`) in `app/__init__.py`.
- Configurazione, modelli e route separati in pacchetti dedicati (`app/config.py`, `app/models/`, `app/routes/`).
- Aggiornati i requisiti nella `requirements.txt` e sostituito Poetry con pip + venv.
- Rimossi i vecchi modelli e i file di servizio legacy.

Struttura
- `run.py`: entrypoint per avviare l'app Flask.
- `app/__init__.py`: application factory e registrazione blueprint.
- `app/config.py`: configurazioni (dev/prod, variabili d'ambiente).
- `app/models/`: modelli dell'applicazione (es. `studente.py`, `modulo.py`, `esame.py`).
- `app/routes/`: route e blueprint (es. `studente.py`, `modulo.py`, `esame.py`).

Prerequisiti
- Python 3.10+ consigliato.
- **Ambiente virtuale (venv) attivo.**

Setup dipendenze (pip + venv)
Usare pip e `requirements.txt` al posto di Poetry.

```powershell
# Da eseguire nella cartella backend
python -m venv .venv
& .\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

Avvio dell'app
```powershell
# Assicurati che il venv sia attivo
& .\.venv\Scripts\Activate.ps1
python run.py
```

Configurazione
- Imposta eventuali variabili d'ambiente (es. database, secret keys) prima dell'avvio.
- Il file `app/config.py` gestisce i profili e la lettura delle variabili.

Note di migrazione
- Poetry è stato rimosso. Per installare le dipendenze usare:
	- `pip install -r requirements.txt`
- I servizi legacy sono stati eliminati; la logica è ora organizzata tra modelli e route con blueprint.
- L'application factory consente testabilità e configurazioni multiple.

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

### Pattern Utilizzati
- **Application Factory**: `create_app()` per configurazioni multiple
- **Blueprints**: routes organizzate per risorsa (studenti, moduli, esami)
- **Fat Models, Thin Controllers**: logica di business nei modelli
  - `Studente.enroll_modulo(modulo)` - Gestisce iscrizione
  - `Studente.unenroll_modulo(modulo)` - Gestisce cancellazione
  - `Studente.get_media_voti()` - Calcola statistiche voti

### Gestione Riferimenti Circolari
- Uso di `mongoengine.ReferenceField` con stringhe lazy per evitare dipendenze circolari
- `me.ListField(me.ReferenceField('Modulo'))` per liste di riferimenti

### Database
- **MongoDB** su `localhost:27017`
- Database: `gestore-corsi`
- Configurazione in `app/config.py`

---

## Testing Rapido

### 1. Popola il database
```bash
# Genera studenti
curl -X POST http://localhost:5000/studenti/seed

# Genera moduli
curl -X POST http://localhost:5000/moduli/seed

# Genera esami (richiede studenti e moduli)
curl -X POST http://localhost:5000/esami/seed
```

### 2. Test funzionalità
```bash
# Media voti di uno studente
curl http://localhost:5000/studenti/<id>/media-voti

# Filtra esami con voto >= 24
curl http://localhost:5000/esami/filtro

# Filtra esami con voto >= 28
curl http://localhost:5000/esami/filtro?voto_minimo=28
```

