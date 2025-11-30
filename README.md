# 📘 Gestione Corsi ITS

## 📝 Descrizione del Progetto
Questo progetto implementa un sistema completo di **Gestione Corsi ITS**, basato sul caso d'uso fornito (moduli, studenti, esami e funzionalità avanzate).  
L'applicazione è una **full-stack web app** composta da:

- **Frontend:** React + TypeScript + Material UI + Vite
- **Backend:** Python + Flask + MongoEngine
- **Database:** MongoDB  
- **Dati di test:** Faker (Python)

L'obiettivo è semplificare e centralizzare la gestione di corsi, studenti ed esami, garantendo aggiornamenti automatici e strumenti di analisi.

---

## 🚀 Avvio Rapido

### Prerequisiti
- **MongoDB** installato e in esecuzione sulla porta 27017
- **Node.js** (v18+) e npm
- **Python** (3.8+) con pip

### Metodo 1: Script Automatico (Consigliato)

#### Windows - PowerShell:
```powershell
.\start.ps1
```

#### Windows - Prompt dei Comandi:
```cmd
start.bat
```

Lo script automaticamente:
- Verifica MongoDB
- Avvia il backend Flask su `http://localhost:5000`
- Avvia il frontend Vite su `http://localhost:5173`
- Mostra gli URL e i log in tempo reale

Premi `CTRL+C` per fermare tutti i servizi.

### Metodo 2: Avvio Manuale

#### Backend
```powershell
cd backend
.venv\Scripts\Activate.ps1  # Windows PowerShell
# oppure: .venv\Scripts\activate.bat  # Windows CMD
# oppure: source .venv/bin/activate  # Linux/Mac
python run.py
```

#### Frontend (in un altro terminale)
```powershell
cd frontend
npm run dev
```

---

## 🎯 Funzionalità

### 📚 Gestione Moduli
- Creazione e aggiornamento moduli (nome, codice, ore, descrizione)  
- Visualizzazione lista moduli  
- Consultazione studenti iscritti  

### 🎓 Gestione Studenti
- Registrazione studenti (nome, cognome, email)  
- Assegnazione moduli frequentati  
- Gestione esami:
  - data  
  - voto
  - note  
  - informazioni del modulo al momento della prova

### 🔄 Aggiornamento Automatico
- Iscrizione studente → aggiornamento automatico del modulo  
- Nessuna duplicazione degli iscritti  

### ⭐ Funzionalità Avanzate
- CRUD completo per moduli, studenti, esami  
- Calcolo della **media voti** per studente  
- Filtraggio esami con voto ≥ 24  

---

## 🧪 Generazione Dati con Faker

Il progetto include l’utilizzo della libreria **Faker** per generare dati realistici di test:

- nomi e cognomi degli studenti  
- email  
- nomi dei moduli  
- descrizioni  
- date degli esami  
- voti casuali
