# 📘 Gestione Corsi ITS

## 📝 Descrizione del Progetto
Questo progetto implementa un sistema completo di **Gestione Corsi ITS**, basato sul caso d’uso fornito (moduli, studenti, esami e funzionalità avanzate).  
L’applicazione è una **full-stack web app** composta da:

- **Frontend:** React  
- **Backend:** Python + Flask  
- **Database:** MongoDB  
- **Dati di test:** Faker (Python)

L’obiettivo è semplificare e centralizzare la gestione di corsi, studenti ed esami, garantendo aggiornamenti automatici e strumenti di analisi.

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
