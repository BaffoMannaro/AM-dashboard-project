// TABELLA preventivi
// Implementa la logica di business per le operazioni CRUD

const PreventiviModel = require('../models/dbModels');
const PreventiviService = require('../services/preventiviService');

exports.getAllPreventivi = async (req, res) => {
    try {
        const data = await PreventiviModel.getAllPreventivi();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei preventivi' });
    }
};

exports.getPreventivoById = async (req, res) => {
    try {
        const data = await PreventiviModel.getPreventivoById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: 'Preventivo non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero del preventivo' });
    }
};

// Funzione helper per convertire date da DD-MM-YYYY a YYYY-MM-DD
function convertDateFormat(dateString) {
    if (!dateString || typeof dateString !== 'string') return dateString;
    
    // Se la data è nel formato DD-MM-YYYY, convertila in YYYY-MM-DD
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }
    
    return dateString;
}

exports.createPreventivo = async (req, res) => {
    try {
        const { materiali, ...preventivoData } = req.body;
        
        // Converte le date dal formato DD-MM-YYYY al formato YYYY-MM-DD per il database
        if (preventivoData.preventivo_data_creazione) {
            preventivoData.preventivo_data_creazione = convertDateFormat(preventivoData.preventivo_data_creazione);
        }
        if (preventivoData.preventivo_data_evento) {
            preventivoData.preventivo_data_evento = convertDateFormat(preventivoData.preventivo_data_evento);
        }
        
        // Converte stringhe vuote in NULL per i campi FK
        if (preventivoData.preventivo_sconto_id_fk === '') {
            preventivoData.preventivo_sconto_id_fk = null;
        }
        if (preventivoData.preventivo_trasporto_id_fk === '') {
            preventivoData.preventivo_trasporto_id_fk = null;
        }
        
        // Crea il preventivo principale
        const result = await PreventiviModel.createPreventivo(preventivoData);
        const preventivoId = result.id;
        
        // Se ci sono materiali associati, li inserisce nella tabella preventivi_materiali
        if (materiali && materiali.length > 0) {
            for (const materiale of materiali) {
                await PreventiviModel.createPreventivoMateriali({
                    preventivo_mat_id: preventivoId,
                    preventivo_mat_mat_id: materiale.materiale_id,
                    preventivo_mat_quantita: materiale.quantita
                });
            }
        }
        
        res.status(201).json({ message: 'Preventivo creato con successo', id: preventivoId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante la creazione del preventivo' });
    }
};

exports.updatePreventivo = async (req, res) => {
    try {
        const { materiali, ...preventivoData } = req.body;
        const preventivoId = req.params.id;
        
        // Converte le date dal formato DD-MM-YYYY al formato YYYY-MM-DD per il database
        if (preventivoData.preventivo_data_creazione) {
            preventivoData.preventivo_data_creazione = convertDateFormat(preventivoData.preventivo_data_creazione);
        }
        if (preventivoData.preventivo_data_evento) {
            preventivoData.preventivo_data_evento = convertDateFormat(preventivoData.preventivo_data_evento);
        }
        
        // Converte stringhe vuote in NULL per i campi FK
        if (preventivoData.preventivo_sconto_id_fk === '') {
            preventivoData.preventivo_sconto_id_fk = null;
        }
        if (preventivoData.preventivo_trasporto_id_fk === '') {
            preventivoData.preventivo_trasporto_id_fk = null;
        }

        // Aggiorna il preventivo principale
        const result = await PreventiviModel.updatePreventivo(preventivoId, preventivoData);
        
        if (result.affectedRows > 0) {
            // Se ci sono materiali, prima elimina quelli esistenti e poi inserisce i nuovi
            if (materiali && materiali.length > 0) {
                // Elimina i materiali esistenti per questo preventivo
                await PreventiviModel.deletePreventivoMaterialiByPreventivoId(preventivoId);
                
                // Inserisce i nuovi materiali
                for (const materiale of materiali) {
                    await PreventiviModel.createPreventivoMateriali({
                        preventivo_mat_id: preventivoId,
                        preventivo_mat_mat_id: materiale.materiale_id,
                        preventivo_mat_quantita: materiale.quantita
                    });
                }
            }
            
            res.json({ message: 'Preventivo aggiornato con successo' });
        } else {
            res.status(404).json({ message: 'Preventivo non trovato' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento del preventivo' });
    }
};

exports.deletePreventivo = async (req, res) => {
    try {
        const preventivoId = req.params.id;
        console.log(`Tentativo di eliminazione preventivo ID: ${preventivoId}`);
        
        // Prima elimina tutti i materiali associati al preventivo
        console.log('Eliminazione materiali associati...');
        const deleteMaterialiResult = await PreventiviModel.deletePreventivoMaterialiByPreventivoId(preventivoId);
        console.log('Risultato eliminazione materiali:', deleteMaterialiResult);
        
        // Poi elimina il preventivo principale
        console.log('Eliminazione preventivo principale...');
        const result = await PreventiviModel.deletePreventivo(preventivoId);
        console.log('Risultato eliminazione preventivo:', result);
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Preventivo cancellato con successo' });
        } else {
            res.status(404).json({ message: 'Preventivo non trovato' });
        }
    } catch (error) {
        console.error('Errore durante l\'eliminazione del preventivo:', error);
        res.status(500).json({ message: 'Errore durante la cancellazione del preventivo', error: error.message });
    }
};

exports.getPreventiviWithTotals = async (req, res) => {
    try {
        const data = await PreventiviModel.getPreventiviWithTotals();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei preventivi con totali' });
    }
};

exports.calcolaTotalePreventivo = async function(req, res) {
    try {
        const totale = await PreventiviService.calcolaTotalePreventivo(req.body.preventivoId);
        res.json(totale);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.applicaSconto = async function(req, res) {
    try {
        const risultato = await PreventiviService.applicaSconto(
            req.body.preventivoId,
            req.body.scontoId
        );
        res.json(risultato);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Ottiene i materiali dettagliati associati a un preventivo specifico
 * Include nome materiale, prezzo unitario, tipo e subtotale
 */
exports.getPreventivoMateriali = async function(req, res) {
    try {
        const preventivoId = req.params.id;
        
        // Ora usa direttamente await senza Promise wrapper
        const materiali = await PreventiviModel.getPreventivoMaterialiDetailed(preventivoId);
        
        res.json(materiali);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il recupero dei materiali del preventivo' });
    }
};
