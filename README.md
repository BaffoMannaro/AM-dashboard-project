# AM-2 Project

Progetto full-stack con Vue.js frontend e Node.js backend per la gestione di materiali e preventivi.

## Struttura del progetto

- `frontend/` - Applicazione Vue.js con Tailwind CSS
- `crud-nodejs/` - API backend Node.js con Express

## Installazione

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd crud-nodejs
npm install
npm start
```

## 8. File .env.example per il backend

Crea un file `.env.example` nel backend per mostrare le variabili necessarie:

```bash
cp crud-nodejs/.env crud-nodejs/.env.example
```

## Comandi Git utili per il futuro
- git status - Verifica lo stato dei file
- git add . - Aggiungi tutti i file modificati
- git commit -m "messaggio" - Crea un commit
- git push - Carica le modifiche su GitHub
- git pull - Scarica le modifiche da GitHub
- git log --oneline - Visualizza la cronologia dei commit

## Workflow consigliato
1. Prima di iniziare a lavorare: git pull
2. Fai le tue modifiche
3. git add .
4. git commit -m "Descrizione delle modifiche"
5. git push