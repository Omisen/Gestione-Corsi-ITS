<img width="1536" height="317" alt="ChatGPT Image 3 dic 2025, 00_30_17" src="https://github.com/user-attachments/assets/e8fb81bc-76eb-41b5-b023-8929887a10ad" />

# 📘 Gestione Corsi ITS

## 📝 Descrizione del Progetto
Questo progetto implementa un sistema completo di **Gestione Corsi ITS**, basato sul caso d'uso fornito (moduli, studenti, esami e funzionalità avanzate).  
L'applicazione è una **full-stack web app** composta da:

- **Frontend:** React 19 + TypeScript + Material-UI v7 + Vite 7 + React Router v7 + Recharts
- **Backend:** Python 3.13 + Flask 3.1.2 + PyMongo 4.15.4 + Pydantic 2.x
- **Database:** MongoDB (PyMongo con aggregation pipelines)
- **Dati di test:** Faker (Python)

L'obiettivo è semplificare e centralizzare la gestione di corsi, studenti ed esami, garantendo aggiornamenti automatici e strumenti di analisi avanzati con dashboard statistiche.

---

## 🏗️ Architettura

### Backend
- **Pattern Repository**: Separazione logica tra accesso dati e business logic
- **Pydantic Validation**: Validazione automatica dei dati in input/output
- **MongoDB Aggregation**: Query complesse per statistiche avanzate
- **CORS**: Configurato per comunicazione frontend-backend

### Frontend
- **React 19**: Ultima versione con hooks moderni
- **Material-UI v7**: Design system completo e responsive
- **React Router v7**: Routing lato client
- **React Hook Form**: Gestione form avanzata con validazione
- **Recharts**: Grafici interattivi per dashboard statistiche
- **Axios**: HTTP client per chiamate API
- **Responsive Design**: Mobile-first (xs, sm, md, lg breakpoints)

---

## 🚀 Avvio Rapido

### Prerequisiti
- **MongoDB** installato e in esecuzione sulla porta 27017
- **Node.js** (v18+) e npm
- **Python** (3.13+) con pip

### Metodo 1: Script Automatico (Consigliato)

#### Windows - PowerShell:
```powershell
.\start.ps1
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
- **CRUD completo**: Creazione, lettura, aggiornamento, eliminazione
- **Campi**: Nome, codice, ore totali, descrizione
- **Visualizzazione**: Lista paginata con azioni rapide
- **Modifica**: Tutti i campi modificabili incluso il nome
- **Validazione**: Codice univoco, ore > 0

### 🎓 Gestione Studenti
- **CRUD completo**: Registrazione e gestione studenti
- **Campi**: Nome, cognome, email (univoca)
- **Dettaglio studente**: Vista completa con moduli ed esami associati
- **Assegnazione moduli**: Gestione dinamica dei moduli frequentati
- **Statistiche personali**: Media voti, numero esami

### 📝 Gestione Esami
- **CRUD completo**: Creazione e gestione esami
- **Campi**: Studente, modulo, data, voto (0-30), note
- **Modifica completa**: Possibilità di cambiare studente e modulo
- **Aggiornamento automatico**: 
  - Iscrizione studente al modulo se non presente
  - Aggiornamento lista esami studente
- **Validazione**: Voto tra 0 e 30, studente e modulo esistenti

### 📊 Dashboard Statistiche Avanzate

#### Overview Generale
- Totale studenti, moduli, esami
- Media voti generale
- Voto minimo e massimo
- Tasso di successo percentuale (voto ≥ 18)
- Esami promossi vs bocciati

#### Grafici Interattivi (Recharts)
1. **Media Voti per Modulo** (BarChart)
   - Top 5 moduli per media voto
   - Visualizzazione min/max/media
   
2. **Distribuzione Voti** (PieChart)
   - Range: 0-17 (Insufficiente), 18-20, 21-23, 24-26, 27-29, 30-30L
   - Filtro per modulo
   - Percentuali visualizzate
   
3. **Trend Temporale** (LineChart)
   - Numero esami per periodo (anno-mese)
   - Media voti nel tempo
   - Dual Y-axis
   
4. **Tasso Successo per Modulo** (BarChart orizzontale)
   - Percentuale promossi/bocciati
   - Top 5 moduli

#### Endpoint API Statistiche
- `GET /stats/overview` - KPI generali
- `GET /stats/media-voti-moduli` - Media voti per modulo
- `GET /stats/studenti-per-modulo` - Conteggio studenti per modulo
- `GET /stats/distribuzione-voti?modulo_id=<id>` - Distribuzione con filtro
- `GET /stats/tasso-successo` - Percentuali successo/fallimento
- `GET /stats/esami-temporale?data_inizio=&data_fine=` - Trend temporali

### 🔄 Aggiornamento Automatico
- Iscrizione studente → aggiornamento automatico del modulo
- Nessuna duplicazione degli iscritti
- Gestione referenze bidirezionali (studente ↔ esame ↔ modulo)

### 🎨 UI/UX Features
- **Design Responsive**: Ottimizzato per mobile, tablet, desktop
- **Material-UI v7**: Design moderno e professionale
- **Navigazione intuitiva**: Sidebar con icone e routing dinamico
- **Feedback visivo**: Loading states, error handling, conferme
- **Tabelle avanzate**: Azioni inline, colonne responsive
- **Form validation**: Validazione real-time con react-hook-form

---

## 🧪 Generazione Dati con Faker

Il progetto include l'utilizzo della libreria **Faker** per generare dati realistici di test:

### Endpoint Seed
- `POST /studenti/seed` - Genera studenti fake
- `POST /moduli/seed` - Genera moduli fake
- `POST /esami/seed` - Genera esami fake (richiede studenti e moduli esistenti)

### Dati Generati
- Nomi e cognomi italiani realistici
- Email valide con domini comuni
- Codici modulo univoci (MOD-XXX)
- Descrizioni casuali
- Date esami nel passato recente
- Voti casuali tra 12 e 30

---

## 📡 API Endpoints

### Studenti
- `GET /studenti/` - Lista tutti gli studenti
- `GET /studenti/<id>` - Dettaglio studente con moduli ed esami
- `POST /studenti/` - Crea nuovo studente
- `PUT /studenti/<id>` - Aggiorna studente
- `DELETE /studenti/<id>` - Elimina studente

### Moduli
- `GET /moduli/` - Lista tutti i moduli
- `GET /moduli/<id>` - Dettaglio modulo
- `GET /moduli/<id>/studenti` - Studenti iscritti al modulo
- `POST /moduli/` - Crea nuovo modulo
- `PUT /moduli/<id>` - Aggiorna modulo (tutti i campi)
- `DELETE /moduli/<id>` - Elimina modulo

### Esami
- `GET /esami/` - Lista tutti gli esami
- `GET /esami/<id>` - Dettaglio esame
- `GET /esami/filtro?voto_minimo=<voto>` - Filtra per voto minimo
- `POST /esami/` - Crea nuovo esame
- `PUT /esami/<id>` - Aggiorna esame (inclusi studente e modulo)
- `DELETE /esami/<id>` - Elimina esame

### Statistiche
- `GET /stats/overview` - Overview generale
- `GET /stats/media-voti-moduli` - Media voti per modulo
- `GET /stats/studenti-per-modulo` - Studenti per modulo
- `GET /stats/distribuzione-voti?modulo_id=<id>` - Distribuzione voti
- `GET /stats/tasso-successo` - Tasso successo per modulo
- `GET /stats/esami-temporale?data_inizio=&data_fine=` - Trend temporale

---

## 🗂️ Struttura del Progetto

```
Gestione-Corsi-ITS/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # App factory con CORS
│   │   ├── config.py                # Configurazione MongoDB
│   │   ├── database.py              # Connection pooling PyMongo
│   │   ├── repositories/            # Pattern Repository
│   │   │   ├── base_repository.py   # CRUD base
│   │   │   ├── studente_repository.py
│   │   │   ├── modulo_repository.py
│   │   │   └── esame_repository.py
│   │   ├── routes/                  # API endpoints
│   │   │   ├── studente.py
│   │   │   ├── modulo.py
│   │   │   ├── esame.py
│   │   │   └── stats.py             # Statistiche
│   │   ├── schemas/                 # Pydantic models
│   │   │   ├── studente_schema.py
│   │   │   ├── modulo_schema.py
│   │   │   ├── esame_schema.py
│   │   │   └── stats_schema.py
│   │   ├── services/                # Business logic
│   │   │   ├── inscrizioniService.py
│   │   │   ├── operazioni.py
│   │   │   └── stats_service.py     # MongoDB aggregations
│   │   └── utils/
│   │       ├── auto_gen_faker_data.py
│   │       ├── objectid_utils.py
│   │       └── serializers.py
│   ├── run.py                       # Entry point
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                 # Entry point
│   │   ├── App.tsx                  # Routing
│   │   ├── api/
│   │   │   └── api.ts               # Axios instance
│   │   ├── components/
│   │   │   ├── Layout/              # Sidebar navigation
│   │   │   ├── Navigation/
│   │   │   └── Footer/
│   │   ├── pages/
│   │   │   ├── Students/            # CRUD Studenti
│   │   │   ├── Modules/             # CRUD Moduli
│   │   │   ├── Exams/               # CRUD Esami
│   │   │   ├── Statistics/          # Dashboard statistiche
│   │   │   └── Dashboard/           # Home
│   │   ├── services/                # API clients
│   │   │   ├── studentService.ts
│   │   │   ├── moduleService.ts
│   │   │   ├── examService.ts
│   │   │   └── statsService.ts
│   │   ├── theme/
│   │   │   └── theme.ts             # Material-UI theme
│   │   └── types/
│   │       └── types.ts             # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── start.ps1                        # Script avvio automatico
└── README.md
```

---

## 🔧 Tecnologie Utilizzate

### Backend
- **Flask 3.1.2**: Web framework Python
- **PyMongo 4.15.4**: Driver MongoDB con aggregation framework
- **Pydantic 2.x**: Data validation e serialization
- **Flask-CORS 5.0.0**: Cross-Origin Resource Sharing
- **Faker**: Generazione dati fake

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety
- **Material-UI v7.3.5**: Component library
- **React Router v7**: Routing
- **React Hook Form**: Form management
- **Recharts 2.x**: Charting library
- **Axios**: HTTP client
- **Vite 7.2.4**: Build tool

### Database
- **MongoDB**: NoSQL document database
- **Collections**: `studente`, `modulo`, `esame`
- **Aggregation Pipelines**: Per statistiche complesse

---

## 📈 Changelog

### v2.0.0 (Dicembre 2025)
- ✅ Migrazione da MongoEngine a **PyMongo + Pydantic**
- ✅ Implementazione **Pattern Repository**
- ✅ **Dashboard Statistiche** con Recharts
- ✅ 6 endpoint statistiche con MongoDB aggregations
- ✅ **Design Responsive** completo (mobile/tablet/desktop)
- ✅ UI/UX improvements (shadows, colors, typography)
- ✅ **Modifica completa esami** (inclusi studente e modulo)
- ✅ **Modifica completa moduli** (incluso campo nome)
- ✅ Aggiornamento dipendenze (React 19, MUI v7, Vite 7)

### v1.0.0 (Novembre 2025)
- ✅ CRUD base per studenti, moduli, esami
- ✅ Gestione referenze bidirezionali
- ✅ Seed data con Faker
- ✅ Frontend React + Material-UI
- ✅ Backend Flask + MongoEngine

---

## 🤝 Contributi

Per contribuire al progetto:
1. Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

---

## 👥 Autori

- **Team ITS** - Progetto Gestione Corsi

---

## 🆘 Supporto

Per problemi o domande:
- Apri un **Issue** su GitHub
- Consulta la documentazione API
- Verifica i log del backend e frontend

---

## 🔮 Roadmap Future

- [ ] Autenticazione e autorizzazione (JWT)
- [ ] Sistema notifiche (email)
- [ ] Export statistiche (PDF/Excel)
- [ ] Calendario esami
- [ ] Gestione presenze
- [ ] Dashboard docenti
- [ ] Mobile app (React Native)
- [ ] Tests automatizzati (Jest, Pytest)
- [ ] CI/CD pipeline
- [ ] Docker containerization
