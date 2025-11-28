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

Testing rapido
- Con venv attivo, avvia l'app e verifica gli endpoint esposti dai blueprint.
- Eventuali test unitari potranno essere aggiunti in una futura cartella `tests/`.

