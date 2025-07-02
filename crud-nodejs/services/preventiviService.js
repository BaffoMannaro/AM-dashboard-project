const db = require('../config/database');

class PreventiviService {
    static async calcolaTotalePreventivo(preventivoId) {
        return new Promise((resolve, reject) => {
            // Query per ottenere i dettagli del preventivo con materiali e sconto
            const query = `
                SELECT 
                    p.*,
                    s.sconto_percentuale,
                    t.trasporto_costo,
                    pm.preventivo_mat_quantita,
                    m.materiale_prezzo_unitario
                FROM preventivi p
                LEFT JOIN sconti s ON p.preventivo_sconto_id_fk = s.sconto_id
                LEFT JOIN trasporto t ON p.preventivo_trasporto_id_fk = t.trasporto_id
                LEFT JOIN preventivi_materiali pm ON p.preventivo_id = pm.preventivo_mat_preventivo_fk
                LEFT JOIN materiali m ON pm.preventivo_mat_materiale_fk = m.materiale_id
                WHERE p.preventivo_id = ?
            `;

            db.query(query, [preventivoId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (results.length === 0) {
                    reject(new Error('Preventivo non trovato'));
                    return;
                }

                // Calcolo del totale
                let totaleMateriali = 0;
                const scontoPercentuale = results[0].sconto_percentuale || 0;
                const trasportoCosto = results[0].trasporto_costo || 0;

                results.forEach(row => {
                    if (row.preventivo_mat_quantita && row.materiale_prezzo_unitario) {
                        totaleMateriali += row.preventivo_mat_quantita * row.materiale_prezzo_unitario;
                    }
                });

                // Applica lo sconto
                const totaleDopoSconto = totaleMateriali * (1 - scontoPercentuale / 100);
                const totaleFinalePiuTrasporto = totaleDopoSconto + trasportoCosto;

                resolve({
                    totaleMateriali,
                    scontoPercentuale,
                    totaleDopoSconto,
                    trasportoCosto,
                    totaleFinalePiuTrasporto
                });
            });
        });
    }

    static async applicaSconto(preventivoId, scontoId) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE preventivi SET preventivo_sconto_id_fk = ? WHERE preventivo_id = ?',
                [scontoId, preventivoId],
                async (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    try {
                        const nuovoTotale = await this.calcolaTotalePreventivo(preventivoId);
                        resolve(nuovoTotale);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }
}

module.exports = PreventiviService;