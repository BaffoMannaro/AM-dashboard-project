# Regole di Progetto per Trae IDE

## Configurazione CSS e Tailwind

### Gestione degli errori CSS
- Ignora tutti gli avvisi "Unknown at rule @tailwind" nel file `main.css`
- Le direttive `@tailwind base`, `@tailwind components`, e `@tailwind utilities` sono valide e necessarie per il funzionamento di Tailwind CSS
- Non segnalare errori per le direttive CSS personalizzate di Tailwind

### Validazione CSS
- Disabilita la validazione CSS nativa per i file che contengono direttive Tailwind
- Considera valide tutte le direttive che iniziano con `@` nel contesto di Tailwind CSS
- Non mostrare errori di sintassi per le regole CSS personalizzate di Tailwind

### Configurazione del progetto
- Il progetto utilizza Tailwind CSS v3 con configurazione PostCSS
- Il file `main.css` contiene le direttive base di Tailwind e deve essere considerato valido
- Le classi CSS generate da Tailwind sono dinamiche e non devono essere validate come CSS standard

### Istruzioni per l'AI
- Quando lavori con file CSS in questo progetto, non segnalare errori per le direttive Tailwind
- Considera il setup attuale di Tailwind CSS come corretto e funzionante
- Se richiesto di risolvere errori CSS, concentrati solo su errori reali di sintassi, non su direttive Tailwind