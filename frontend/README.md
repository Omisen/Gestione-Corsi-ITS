# 🎨 Frontend - Gestione Corsi ITS

Applicazione web moderna per la gestione di corsi ITS, studenti, moduli ed esami con interfaccia intuitiva e reattiva.

---

## 🛠️ Tecnologie Utilizzate

### Core Framework & Build Tool
- **[React 19](https://react.dev/)** - Libreria UI per interfacce moderne e componenti
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety e developer experience migliorata
- **[Vite 7](https://vite.dev/)** - Build tool velocissimo con HMR (Hot Module Replacement)

### UI & Styling
- **[Material-UI v7](https://mui.com/)** - Sistema di design completo con componenti React pronti all'uso
- **[Emotion](https://emotion.sh/)** - Styling CSS-in-JS performante
- **Material Icons** - Set completo di icone per l'interfaccia

### Routing & Forms
- **[React Router v7](https://reactrouter.com/)** - Navigazione client-side e gestione route
- **[React Hook Form v7](https://react-hook-form.com/)** - Gestione form performante con validazione

### HTTP & State
- **[Axios](https://axios-http.com/)** - Client HTTP per chiamate API REST al backend
- **React Hooks** - Gestione stato locale (useState, useEffect, useContext)

### Dev Tools
- **[ESLint](https://eslint.org/)** - Linting per codice pulito e consistente
- **TypeScript ESLint** - Regole specifiche per TypeScript

---

## 🎯 Panoramica Interfaccia Utente

L'applicazione presenta un'interfaccia moderna e professionale divisa in sezioni chiare:

### 🏠 **Dashboard (Home)**
La pagina principale mostra una panoramica del sistema con:
- **Card statistiche** con contatori animati:
  - Numero totale studenti
  - Numero totale moduli
  - Numero totale esami registrati
- Design pulito con icone colorate e card cliccabili per navigazione rapida
- Messaggio di benvenuto personalizzato

### 👥 **Gestione Studenti**
Sezione completa per la gestione degli studenti con:
- **Lista studenti**: tabella moderna con nome, cognome, email e azioni rapide
- **Dettaglio studente**: vista completa con:
  - Informazioni anagrafiche
  - Moduli iscritti con chip colorati
  - Esami sostenuti con voti e date
  - Statistiche personali (media voti, min/max)
- **Form creazione/modifica**: form validato con campi per nome, cognome ed email
- **Azioni**: modifica, elimina, aggiungi/rimuovi moduli
- **Ricerca e filtri** (espandibile)

### 📚 **Gestione Moduli**
Interfaccia dedicata alla gestione dei moduli didattici:
- **Lista moduli**: tabella con nome, codice, ore totali e azioni
- **Form creazione/modifica**: campi per:
  - Nome modulo
  - Codice identificativo
  - Totale ore
  - Descrizione (campo testuale multi-linea)
- **Validazione real-time** su tutti i campi
- **Cancellazione** con dialog di conferma

### 📝 **Gestione Esami**
Sistema completo per registrare e gestire gli esami:
- **Lista esami**: tabella con studente, modulo, data, voto
- **Form creazione/modifica** con:
  - Select studente (caricamento dinamico)
  - Select modulo (caricamento dinamico)
  - Date picker per la data esame
  - Input numerico per il voto
  - Campo note opzionale
- **Validazione**: campi obbligatori e controlli sui valori
- **Gestione date** con formato italiano

### 🧭 **Navigazione e Layout**

#### Sidebar Menu (Desktop)
- Drawer laterale fisso con logo e menu di navigazione
- Voci menu con icone Material:
  - 🏠 Dashboard
  - 👥 Studenti
  - 📚 Moduli
  - 📝 Esami
- Evidenziazione voce attiva
- Design moderno con bordi arrotondati

#### Top Bar (Mobile)
- AppBar collassabile con hamburger menu
- Drawer temporaneo per navigazione mobile
- Design responsive che si adatta a tablet e smartphone

#### Design System
- **Palette colori**: tonalità blu professionale con accent arancione
- **Tipografia**: Inter per testo, Outfit per titoli
- **Spacing consistente**: 8px base unit
- **Elevazione e ombre**: gerarchie visive chiare
- **Border radius**: 8-12px per elementi moderni
- **Animazioni**: transizioni fluide su hover e interazioni

---

## 📁 Struttura Progetto

```
frontend/
├── src/
│   ├── api/
│   │   └── api.ts                 # Client Axios configurato
│   ├── components/
│   │   ├── Layout/                # Layout principale con sidebar
│   │   ├── Navigation/            # Componenti navigazione (legacy)
│   │   ├── Students/              # Componenti specifici studenti
│   │   │   ├── StudentExams.tsx
│   │   │   └── StudentModules.tsx
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard/             # Pagina dashboard
│   │   ├── Students/              # CRUD studenti
│   │   │   ├── StudentsList.tsx
│   │   │   ├── StudentDetail.tsx
│   │   │   └── StudentForm.tsx
│   │   ├── Modules/               # CRUD moduli
│   │   │   ├── ModulesList.tsx
│   │   │   └── ModuleForm.tsx
│   │   └── Exams/                 # CRUD esami
│   │       ├── ExamsList.tsx
│   │       └── ExamForm.tsx
│   ├── services/
│   │   ├── studentService.ts      # API studenti
│   │   ├── moduleService.ts       # API moduli
│   │   └── examService.ts         # API esami
│   ├── theme/
│   │   └── theme.ts               # Tema Material-UI personalizzato
│   ├── types/
│   │   └── types.ts               # Interfacce TypeScript
│   ├── App.tsx                    # Router principale
│   └── main.tsx                   # Entry point
├── public/                        # Asset statici
├── index.html                     # HTML template
├── package.json                   # Dipendenze npm
├── tsconfig.json                  # Configurazione TypeScript
├── vite.config.ts                 # Configurazione Vite
└── eslint.config.js               # Configurazione ESLint
```

---

## 🚀 Sviluppo

### Installazione Dipendenze
```bash
npm install
```

### Avvio Dev Server
```bash
npm run dev
```
Apre su `http://localhost:5173` con hot reload

### Build Production
```bash
npm run build
```
Output in `dist/`

### Preview Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 🔗 Integrazione Backend

L'applicazione comunica con il backend Flask tramite API REST:

- **Base URL**: `http://localhost:5000`
- **Endpoints**:
  - `/studenti/` - CRUD studenti
  - `/moduli/` - CRUD moduli
  - `/esami/` - CRUD esami
  - `/studenti/:id/media-voti` - Statistiche studente

### CORS
Il backend deve avere CORS abilitato per permettere richieste da `localhost:5173`.

---

## 🎨 Personalizzazione Tema

Il tema Material-UI è configurabile in `src/theme/theme.ts`:

```typescript
{
  palette: {
    primary: { main: '#1976d2' },  // Blu principale
    secondary: { main: '#f57c00' }, // Arancione accento
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1-h6: { fontFamily: 'Outfit' }
  }
}
```

---

## 📱 Responsive Design

L'interfaccia è completamente responsive:
- **Desktop** (>960px): Sidebar fissa, tabelle full-width
- **Tablet** (600-960px): Layout adattivo, sidebar collassabile
- **Mobile** (<600px): Drawer menu, card stack verticali

---

## ✨ Features UX

- ✅ Loading states con spinner Material-UI
- ✅ Error handling con Alert components
- ✅ Conferme eliminazione con Dialog modal
- ✅ Validazione form real-time
- ✅ Feedback visivo su azioni (hover, active states)
- ✅ Navigazione breadcrumb implicita (pulsanti Indietro)
- ✅ Messaggi di errore contestuali
- ✅ Icone intuitive per ogni azione

---

## 🔮 Sviluppi Futuri

Possibili estensioni dell'interfaccia:
- 📊 Grafici e statistiche avanzate (Chart.js, Recharts)
- 🔍 Ricerca e filtri avanzati con debounce
- 📤 Export dati (CSV, PDF)
- 🌙 Dark mode toggle
- 🔔 Sistema notifiche toast
- ♿ Accessibilità WCAG 2.1
- 🌐 Internazionalizzazione (i18n)

---

## 📄 Licenza

Questo progetto è parte del sistema Gestione Corsi ITS.

