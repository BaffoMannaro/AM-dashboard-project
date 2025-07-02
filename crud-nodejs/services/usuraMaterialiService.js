const db = require('../config/database');

class UsuraMaterialiService {
    static async calcolaUsuraMateriale(materialeId, numeroUtilizzi) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    m.*,
                    um.usura_mat_percentuale,
                    um.usura_mat_vita_restante
                FROM materiali m
                LEFT JOIN usura_materiali um ON m.materiale_id = um.usura_mat_materiale_fk
                WHERE m.materiale_id = ?
            `;

            db.query(query, [materialeId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    reject(new Error('Materiale non trovato'));
                    return;
                }

                const materiale = results[0];
                const percentualeUsuraPerUtilizzo = materiale.usura_mat_percentuale || 0;
                const vitaRestanteAttuale = parseFloat(materiale.usura_mat_vita_restante) || 100;

                // Calcola la nuova vita restante
                const usuraTotale = percentualeUsuraPerUtilizzo * numeroUtilizzi;
                const nuovaVitaRestante = Math.max(0, vitaRestanteAttuale - usuraTotale);

                // Aggiorna il database con la nuova vita restante
                const updateQuery = `
                    UPDATE usura_materiali 
                    SET usura_mat_vita_restante = ? 
                    WHERE usura_mat_materiale_fk = ?
                `;

                db.query(updateQuery, [nuovaVitaRestante, materialeId], (updateErr) => {
                    if (updateErr) {
                        reject(updateErr);
                        return;
                    }

                    resolve({
                        materialeId,
                        usuraPrecedente: vitaRestanteAttuale,
                        usuraApplicata: usuraTotale,
                        nuovaVitaRestante: nuovaVitaRestante
                    });
                });
            });
        });
    }

    static async verificaStatoUsura(materialeId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    m.materiale_name,
                    um.usura_mat_vita_restante,
                    um.usura_mat_percentuale
                FROM materiali m
                LEFT JOIN usura_materiali um ON m.materiale_id = um.usura_mat_materiale_fk
                WHERE m.materiale_id = ?
            `;

            db.query(query, [materialeId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    reject(new Error('Materiale non trovato'));
                    return;
                }

                const materiale = results[0];
                const vitaRestante = parseFloat(materiale.usura_mat_vita_restante) || 100;

                resolve({
                    materialeId,
                    nome: materiale.materiale_name,
                    vitaRestante,
                    statoUsura: this.getStatoUsura(vitaRestante)
                });
            });
        });
    }

    static getStatoUsura(vitaRestante) {
        if (vitaRestante >= 75) return 'Ottimo';
        if (vitaRestante >= 50) return 'Buono';
        if (vitaRestante >= 25) return 'Usurato';
        if (vitaRestante > 0) return 'Critico';
        return 'Da Sostituire';
    }
}

module.exports = UsuraMaterialiService;