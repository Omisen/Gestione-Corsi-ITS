# 🤝 Contributing to Gestione Corsi ITS

Grazie per il tuo interesse nel contribuire al progetto **Gestione Corsi ITS**! Questo documento fornisce le linee guida per contribuire al progetto.

## 📋 Indice

- [Codice di Condotta](#codice-di-condotta)
- [Come Contribuire](#come-contribuire)
- [Setup Ambiente di Sviluppo](#setup-ambiente-di-sviluppo)
- [Workflow Git](#workflow-git)
- [Standard di Codifica](#standard-di-codifica)
- [Commit Messages](#commit-messages)
- [Pull Request](#pull-request)
- [Reportare Bug](#reportare-bug)
- [Proporre Nuove Funzionalità](#proporre-nuove-funzionalità)

---

## 📜 Codice di Condotta

Questo progetto adotta un codice di condotta che ci aspettiamo venga rispettato da tutti i contributori:

- Sii rispettoso e inclusivo
- Accetta critiche costruttive
- Concentrati su ciò che è meglio per la comunità
- Mostra empatia verso gli altri membri della comunità

---

## 🚀 Come Contribuire

Ci sono diversi modi per contribuire al progetto:

1. **Reportare bug** - Segnala problemi o comportamenti inattesi
2. **Proporre funzionalità** - Suggerisci nuove feature o miglioramenti
3. **Scrivere codice** - Implementa fix o nuove funzionalità
4. **Migliorare la documentazione** - Aggiorna README, commenti nel codice, guide
5. **Code review** - Rivedi le Pull Request di altri contributori

---

## 🛠️ Setup Ambiente di Sviluppo

### Prerequisiti

- **MongoDB** 4.4+ (in esecuzione su porta 27017)
- **Python** 3.13+
- **Node.js** 18+ e npm
- **Git**

### 1. Fork e Clone

```bash
# Fork del repository su GitHub, poi clona il tuo fork
git clone https://github.com/TUO-USERNAME/Gestione-Corsi-ITS.git
cd Gestione-Corsi-ITS

# Aggiungi il repository originale come remote upstream
git remote add upstream https://github.com/Omisen/Gestione-Corsi-ITS.git
```

### 2. Setup Backend

```bash
cd backend

# Crea virtual environment
python -m venv .venv

# Attiva virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Windows CMD:
.venv\Scripts\activate.bat
# Linux/Mac:
source .venv/bin/activate

# Installa dipendenze
pip install -r requirements.txt

# Crea file di configurazione
# IMPORTANTE: Non committare questo file!
cp app/config.example.py app/config.py
# Modifica config.py con le tue impostazioni MongoDB
```

**File `app/config.py` (esempio):**
```python
class Config:
    DEBUG = True
    MONGO_DB_NAME = 'nome-del-db'
    MONGO_HOST = 'localhost'
    MONGO_PORT = 27017
    MONGO_URI = f'mongodb://{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB_NAME}'
```

### 3. Setup Frontend

```bash
cd ../frontend

# Installa dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev
```

### 4. Avvia l'applicazione

Usa lo script di avvio automatico:

```powershell
# Windows PowerShell (dalla root del progetto)
.\start.ps1
```

Oppure avvia manualmente backend e frontend in due terminali separati.

---

## 🔀 Workflow Git

### Branch Strategy

Il progetto segue il modello **Git Flow** semplificato:

- `main` - Branch principale con codice stabile
- `feature/*` - Nuove funzionalità
- `bugfix/*` - Correzioni di bug
- `hotfix/*` - Fix urgenti per produzione
- `docs/*` - Modifiche alla documentazione

### Creazione di un Branch

```bash
# Aggiorna il tuo fork
git checkout main
git pull upstream main

# Crea un nuovo branch per la tua feature
git checkout -b feature/nome-feature

# Oppure per un bugfix
git checkout -b bugfix/descrizione-bug
```

### Mantieni il Branch Aggiornato

```bash
# Sincronizza regolarmente con upstream
git fetch upstream
git rebase upstream/main
```

---

## 📝 Standard di Codifica

### Backend (Python)

- **Style Guide**: [PEP 8](https://peps.python.org/pep-0008/)
- **Formattazione**: Usa `black` per formattare il codice
- **Linting**: Usa `flake8` o `ruff`
- **Type Hints**: Usa type hints dove possibile

```python
# Esempio di funzione ben documentata
def calcola_media_voti(esami: list[dict]) -> float:
    """
    Calcola la media dei voti da una lista di esami.
    
    Args:
        esami: Lista di dizionari contenenti i dati degli esami
        
    Returns:
        float: Media dei voti, 0.0 se la lista è vuota
        
    Raises:
        ValueError: Se i dati degli esami non sono validi
    """
    if not esami:
        return 0.0
    
    voti = [esame['voto'] for esame in esami]
    return sum(voti) / len(voti)
```

**Naming Conventions:**
- Classi: `PascalCase` (es. `StudenteRepository`)
- Funzioni/metodi: `snake_case` (es. `get_studente_by_id`)
- Costanti: `UPPER_SNAKE_CASE` (es. `MAX_VOTO`)
- Variabili private: `_prefisso` (es. `_db_connection`)

### Frontend (TypeScript/React)

- **Style Guide**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Formattazione**: Usa Prettier
- **Linting**: Usa ESLint
- **TypeScript**: Usa tipi espliciti, evita `any` quando possibile

```typescript
// Esempio di componente React ben strutturato
interface StudentListProps {
  students: Student[];
  onStudentClick: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onStudentClick 
}) => {
  if (!students.length) {
    return <Typography>Nessuno studente trovato</Typography>;
  }

  return (
    <List>
      {students.map((student) => (
        <ListItem 
          key={student.id} 
          onClick={() => onStudentClick(student.id)}
        >
          <ListItemText 
            primary={`${student.nome} ${student.cognome}`}
            secondary={student.email}
          />
        </ListItem>
      ))}
    </List>
  );
};
```

**Naming Conventions:**
- Componenti: `PascalCase` (es. `StudentForm.tsx`)
- File non-component: `camelCase` (es. `studentService.ts`)
- Costanti: `UPPER_SNAKE_CASE` (es. `API_BASE_URL`)
- Hooks custom: `use` prefix (es. `useStudentData`)

### Database (MongoDB)

- **Collection Names**: Singolare e snake_case (es. `studente`, `modulo`, `esame`)
- **Field Names**: snake_case (es. `nome`, `totale_ore`, `data_esame`)
- **References**: ObjectId con suffisso (es. `studente_id`, `modulo_id`)

---

## 💬 Commit Messages

Seguiamo la convenzione **Conventional Commits** per commit messages chiari e consistenti.

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Nuova funzionalità
- `fix`: Correzione bug
- `docs`: Modifiche alla documentazione
- `style`: Formattazione, punto e virgola mancanti, etc (no cambi al codice)
- `refactor`: Refactoring del codice (no fix, no feat)
- `perf`: Miglioramenti delle performance
- `test`: Aggiunta o modifica di test
- `chore`: Modifiche al build process o strumenti ausiliari
- `ci`: Modifiche ai file di CI/CD
- `revert`: Revert di un commit precedente

### Scope (opzionale)

- `backend`: Modifiche al backend Python
- `frontend`: Modifiche al frontend React
- `db`: Modifiche allo schema database
- `api`: Modifiche agli endpoint API
- `ui`: Modifiche all'interfaccia utente
- `docs`: Documentazione

### Esempi

```bash
# Feature
feat(backend): add statistics endpoint for exam trends

# Bug fix
fix(frontend): resolve infinite loop in StudentList component

# Documentation
docs: update README with new installation instructions

# Refactoring
refactor(backend): extract validation logic into separate service

# Multiple scopes
feat(backend,frontend): implement real-time notifications
```

**Subject Line Guidelines:**
- Usa l'imperativo ("add" non "added" o "adds")
- Minuscolo (no maiuscola iniziale)
- Max 50 caratteri
- Non terminare con punto
- Sii specifico e descrittivo

---

## 🔍 Pull Request

### Prima di Aprire una PR

1. ✅ Assicurati che il codice compili senza errori
2. ✅ Esegui i test (se presenti)
3. ✅ Aggiorna la documentazione se necessario
4. ✅ Verifica che il codice segua gli standard del progetto
5. ✅ Fai rebase con `main` per evitare conflitti

```bash
git fetch upstream
git rebase upstream/main
git push origin feature/nome-feature --force-with-lease
```

### Creare una Pull Request

1. Vai su GitHub e apri una PR dal tuo fork al repository originale
2. Compila il template della PR con:
   - **Descrizione**: Cosa fa la PR e perché
   - **Tipo di modifica**: Feature, bug fix, refactoring, etc
   - **Testing**: Come hai testato le modifiche
   - **Screenshots**: Se applicabile (UI changes)
   - **Checklist**: Conferma di aver completato tutti i controlli

### Template PR

```markdown
## Descrizione
Breve descrizione delle modifiche apportate

## Tipo di modifica
- [ ] Bug fix (modifica che risolve un problema)
- [ ] Nuova funzionalità (modifica che aggiunge una feature)
- [ ] Breaking change (fix o feature che causa problemi di compatibilità)
- [ ] Documentazione

## Come è stato testato?
Descrivi i test eseguiti per verificare le tue modifiche

## Checklist
- [ ] Il mio codice segue le linee guida del progetto
- [ ] Ho eseguito una self-review del mio codice
- [ ] Ho commentato il codice, specialmente nelle parti complesse
- [ ] Ho aggiornato la documentazione
- [ ] Le mie modifiche non generano nuovi warning
- [ ] Ho aggiunto test che provano che il mio fix/feature funziona
- [ ] Test esistenti passano localmente con le mie modifiche
```

### Review Process

- Rispondi ai commenti in modo costruttivo
- Effettua le modifiche richieste
- Pusha le modifiche (usa `git push --force-with-lease` se hai fatto rebase)
- Richiedi una nuova review quando pronto

---

## 🐛 Reportare Bug

### Prima di Reportare

1. Cerca nelle **Issues** esistenti se il bug è già stato segnalato
2. Verifica che il bug sia riproducibile nell'ultima versione
3. Raccogli informazioni sul tuo ambiente (OS, versione Python/Node, browser)

### Template Issue per Bug

```markdown
## Descrizione del Bug
Descrizione chiara e concisa del problema

## Steps per Riprodurre
1. Vai a '...'
2. Clicca su '....'
3. Scrolla fino a '....'
4. Vedi l'errore

## Comportamento Atteso
Cosa ti aspettavi che accadesse

## Comportamento Attuale
Cosa è successo invece

## Screenshots
Se applicabile, aggiungi screenshots

## Ambiente
- OS: [es. Windows 11, Ubuntu 22.04, macOS 13]
- Browser: [es. Chrome 120, Firefox 121]
- Python version: [es. 3.13.0]
- Node version: [es. 20.10.0]
- MongoDB version: [es. 7.0.4]

## Log/Error Messages
```
Inserisci qui eventuali messaggi di errore
```

## Informazioni Aggiuntive
Qualsiasi altro contesto utile sul problema
```

---

## 💡 Proporre Nuove Funzionalità

### Template Issue per Feature Request

```markdown
## Descrizione della Feature
Descrizione chiara e concisa della funzionalità proposta

## Problema che Risolve
Questo risolve il problema di... [descrivi il problema]

## Soluzione Proposta
Vorrei che... [descrivi la soluzione]

## Alternative Considerate
Ho considerato anche... [alternative]

## Mockups/Esempi
Se disponibili, aggiungi mockups o esempi di implementazione

## Impatto
- [ ] Backend
- [ ] Frontend
- [ ] Database
- [ ] API
- [ ] Documentazione

## Priorità
- [ ] Must have
- [ ] Should have
- [ ] Nice to have
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📚 Risorse Utili

### Documentazione Tecnologie

- [Flask Documentation](https://flask.palletsprojects.com/)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

### Tool Consigliati

- **VS Code** con estensioni:
  - Python
  - Pylance
  - ESLint
  - Prettier
  - MongoDB for VS Code
- **Postman** o **Thunder Client** per testare API
- **MongoDB Compass** per visualizzare il database

---

## ❓ Domande?

Se hai domande o hai bisogno di aiuto:

1. Controlla la [documentazione](README.md)
2. Cerca nelle [Issues](https://github.com/Omisen/Gestione-Corsi-ITS/issues)
3. Apri una nuova Issue con label `question`
4. Contatta i maintainer del progetto

---

## 🙏 Ringraziamenti

Grazie per aver contribuito a rendere **Gestione Corsi ITS** migliore! 

Ogni contributo, grande o piccolo, è apprezzato. 🎉

---

## 📄 Licenza

Contribuendo a questo progetto, accetti che i tuoi contributi siano rilasciati sotto la [Licenza MIT](LICENSE).
