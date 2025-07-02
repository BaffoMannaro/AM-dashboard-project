// Definisce le query SQL e l'interazione diretta con il database

const db = require('../config/database');

// GET ALL

exports.getAllTypeMateriali = async function () {
  const [rows] = await db.query('SELECT * FROM type_materiali');
  return rows;
};
exports.getAllMateriali = async function () {
    const [rows] = await db.query(`
        SELECT 
            m.*,
            u.max_usura_perc
        FROM 
            materiali m
        LEFT JOIN 
            (SELECT materiale_id_fk, MAX(usura_mat_percentuale_usura) as max_usura_perc FROM usura_materiali GROUP BY materiale_id_fk) u 
        ON 
            m.materiale_id = u.materiale_id_fk;
    `);
    return rows;
};
exports.getAllUsuraMateriali = async function () {
  const [rows] = await db.query('SELECT * FROM usura_materiali');
  return rows;
};
exports.getAllTrasporto = async function () {
  const [rows] = await db.query('SELECT * FROM trasporto');
  return rows;
};
exports.getAllPreventivi = async function () {
  const [rows] = await db.query('SELECT * FROM preventivi');
  return rows;
};
exports.getAllPreventiviMateriali = async function () {
  const [rows] = await db.query('SELECT * FROM preventivi_materiali');
  return rows;
};
exports.getAllSconti = async function () {
  const [rows] = await db.query('SELECT * FROM sconti');
  return rows;
};

// GET BY ID

exports.getTypeMaterialeById = async function (id) {
  const [rows] = await db.query('SELECT * FROM type_materiali WHERE type_mat_id = ?', [id]);
  return rows[0];
};
exports.getMaterialeById = async function (id) {
  const [rows] = await db.query('SELECT * FROM materiali WHERE materiale_id = ?', [id]);
  return rows[0];
};
exports.getUsuraMaterialeById = async function (id) {
  const [rows] = await db.query('SELECT * FROM usura_materiali WHERE usura_mat_id = ?', [id]);
  return rows[0];
};
exports.getTrasportoById = async function (id) {
  const [rows] = await db.query('SELECT * FROM trasporto WHERE trasporto_id = ?', [id]);
  return rows[0];
};
exports.getPreventivoById = async function (id) {
  const [rows] = await db.query('SELECT * FROM preventivi WHERE preventivo_id = ?', [id]);
  return rows[0];
};
exports.getPreventivoMaterialiById = async function (id) {
  const [rows] = await db.query('SELECT * FROM preventivi_materiali WHERE preventivo_mat_id = ?', [id]);
  return rows[0];
};
exports.getScontoById = async function (id) {
  const [rows] = await db.query('SELECT * FROM sconti WHERE sconto_id = ?', [id]);
  return rows[0];
};

exports.getUsuraByMaterialeId = async function (materialeId) {
  const [rows] = await db.query('SELECT * FROM usura_materiali WHERE materiale_id_fk = ?', [materialeId]);
  return rows;
};

// CREATE NEW

exports.createTypeMateriale = async function (newTypeMateriale) {
  const [result] = await db.query('INSERT INTO type_materiali SET ?', newTypeMateriale);
  return { id: result.insertId, ...newTypeMateriale };
};
exports.createMateriale = async function (newMateriale) {
  const [result] = await db.query('INSERT INTO materiali SET ?', newMateriale);
  return { id: result.insertId, ...newMateriale };
};
exports.createUsuraMateriale = async function (newUsuraMateriale) {
  const [result] = await db.query('INSERT INTO usura_materiali SET ?', newUsuraMateriale);
    return { id: result.insertId, ...newUsuraMateriale };
};
exports.createTrasporto = async function (newTrasporto) {
  const [result] = await db.query('INSERT INTO trasporto SET ?', newTrasporto);
    return { id: result.insertId, ...newTrasporto };
};
exports.createPreventivo = async function (newPreventivi) {
  const [result] = await db.query('INSERT INTO preventivi SET ?', newPreventivi);
    return { id: result.insertId, ...newPreventivi };
};
exports.createPreventivoMateriali = async function (newPreventiviMateriali) {
  const [result] = await db.query('INSERT INTO preventivi_materiali (preventivo_mat_id, preventivo_mat_mat_id, preventivo_mat_quantita) VALUES (?, ?, ?)', 
    [newPreventiviMateriali.preventivo_mat_id, newPreventiviMateriali.preventivo_mat_mat_id, newPreventiviMateriali.preventivo_mat_quantita]);
    return { id: newPreventiviMateriali.preventivo_mat_id, ...newPreventiviMateriali };
};
exports.createSconto = async function (newSconti) {
  const [result] = await db.query('INSERT INTO sconti SET ?', newSconti);
    return { id: result.insertId, ...newSconti };
};

// UPDATE

exports.updateTypeMateriale = async function (id, typeMateriale) {
  await db.query('UPDATE type_materiali SET ? WHERE type_mat_id = ?', [typeMateriale, id]);
  return { id: id, ...typeMateriale };
};
exports.updateMateriale = async function (id, materiale) {
  await db.query('UPDATE materiali SET ? WHERE materiale_id = ?', [materiale, id]);
  return { id: id, ...materiale };
};
exports.updateUsuraMateriale = async function (id, usuraMateriale) {
  await db.query('UPDATE usura_materiali SET ? WHERE usura_mat_id = ?', [usuraMateriale, id]);
  return { id: id, ...usuraMateriale };
};
exports.updateTrasporto = async function (id, trasporto) {
  await db.query('UPDATE trasporto SET ? WHERE trasporto_id = ?', [trasporto, id]);
  return { id: id, ...trasporto };
};
exports.updatePreventivo = async function (id, preventivo) {
  await db.query('UPDATE preventivi SET ? WHERE preventivo_id = ?', [preventivo, id]);
  return { id: id, ...preventivo };
};
exports.updatePreventivoMateriali = async function (id, preventivoMateriali) {
  await db.query('UPDATE preventivi_materiali SET ? WHERE preventivo_mat_id = ?', [preventivoMateriali, id]);
  return { id: id, ...preventivoMateriali };
};
exports.updateSconto = async function (id, sconti) {
  // Rimuoviamo un eventuale campo 'id' per evitare errori, dato che la colonna si chiama 'sconto_id'
  delete sconti.id;
  const [result] = await db.query('UPDATE sconti SET ? WHERE sconto_id = ?', [sconti, id]);
  return result;
};

// DELETE

exports.deleteTypeMateriale = async function (id) {
  await db.query('DELETE FROM type_materiali WHERE type_mat_id = ?', [id]);
  return { message: 'TypeMateriale eliminato con successo' };
};
exports.deleteMateriale = async function (id) {
  await db.query('DELETE FROM materiali WHERE materiale_id = ?', [id]);
  return { message: 'Materiale eliminato con successo' };
};
exports.deleteUsuraMateriale = async function (id) {
  await db.query('DELETE FROM usura_materiali WHERE usura_mat_id = ?', [id]);
  return { message: 'UsuraMateriale eliminato con successo' };
};
exports.deleteTrasporto = async function (id) {
  await db.query('DELETE FROM trasporto WHERE trasporto_id = ?', [id]);
  return { message: 'Trasporto eliminato con successo' };
};
exports.deletePreventivo = async function (id) {
  const [result] = await db.query('DELETE FROM preventivi WHERE preventivo_id = ?', [id]);
  return { message: 'Preventivo eliminato con successo', affectedRows: result.affectedRows };
};
exports.deletePreventivoMateriali = async function (id) {
  await db.query('DELETE FROM preventivi_materiali WHERE preventivo_mat_id = ?', [id]);
  return { message: 'PreventivoMateriali eliminato con successo' };
};
exports.deletePreventivoMaterialiByPreventivoId = async function (preventivoId) {
  const [result] = await db.query('DELETE FROM preventivi_materiali WHERE preventivo_mat_id = ?', [preventivoId]);
  return { message: 'Materiali del preventivo eliminati con successo', affectedRows: result.affectedRows };
};
exports.deleteSconto = async function (id) {
  await db.query('DELETE FROM sconti WHERE sconto_id = ?', [id]);
  return { message: 'Sconto eliminato con successo' };
};

////////
//////// Query con JOIN e filtri
////////

exports.getMaterialiWithType = async function (filters) {
  let query = `
    SELECT m.*, tm.type_mat_name
    FROM materiali m
    JOIN type_materiali tm ON m.materiale_type_fk = tm.type_mat_id
    WHERE 1=1
  `;
  const values = [];

  if (filters.name) {
    query += ' AND m.materiale_name LIKE ?';
    values.push(`%${filters.name}%`);
  }
  if (filters.minPrezzo) {
    query += ' AND m.materiale_prezzo_unit >= ?';
    values.push(filters.minPrice);
  }
  if (filters.maxPrezzo) {
    query += ' AND m.materiale_prezzo_unit <= ?';
    values.push(filters.maxPrice);
  }
  if (filters.minCosto) {
    query += ' AND m.materiale_costo_unit >= ?';
    values.push(filters.minCosto);
  }
  if (filters.maxCosto) {
    query += ' AND m.materiale_costo_unit <= ?';
    values.push(filters.maxCosto);
  }
  if (filters.type) {
    query += ' AND tm.type_mat_name = ?';
    values.push(filters.type);
  }
  if (filters.orderBy) {
    query += ` ORDER BY ${filters.orderBy} ${filters.orderDir || 'ASC'}`;
  }

  const [rows] = await db.query(query, values);
  return rows;
};

// Query per il calcolo dei totali dei preventivi
exports.getPreventiviWithTotals = function (filters, callback) {
  let query = `
        SELECT 
            p.*,
            COALESCE(s.sconto_percentuale, 0) as sconto_percentuale,
            t.trasporto_costo,
            (
                SELECT SUM(pm.preventivo_mat_quantita * m.materiale_prezzo_unitario)
                FROM preventivi_materiali pm
                JOIN materiali m ON pm.preventivo_mat_materiale_fk = m.materiale_id
                WHERE pm.preventivo_mat_preventivo_fk = p.preventivo_id
            ) as totale_materiali,
            (
                SELECT SUM(pm.preventivo_mat_quantita * m.materiale_prezzo_unitario * (1 - COALESCE(s.sconto_percentuale, 0)/100)) + COALESCE(t.trasporto_costo, 0)
                FROM preventivi_materiali pm
                JOIN materiali m ON pm.preventivo_mat_materiale_fk = m.materiale_id
                WHERE pm.preventivo_mat_preventivo_fk = p.preventivo_id
            ) as totale_finale
        FROM preventivi p
        LEFT JOIN sconti s ON p.preventivo_sconto_id_fk = s.sconto_id
        LEFT JOIN trasporto t ON p.preventivo_trasporto_id_fk = t.trasporto_id
        WHERE 1=1
    `;
  const values = [];

  if (filters.dataInizio) {
    query += ' AND p.preventivo_data_evento >= ?';
    values.push(filters.dataInizio);
  }
  if (filters.dataFine) {
    query += ' AND p.preventivo_data_evento <= ?';
    values.push(filters.dataFine);
  }
  if (filters.minTotal) {
    query += ' HAVING totale_finale >= ?';
    values.push(filters.minTotal);
  }
  if (filters.maxTotal) {
    query += ' HAVING totale_finale <= ?';
    values.push(filters.maxTotal);
  }
  if (filters.orderBy) {
    query += ` ORDER BY ${filters.orderBy} ${filters.orderDir || 'ASC'}`;
  }

  db.query(query, values, callback);
};

// Query per ottenere i dettagli dei materiali in un preventivo
exports.getPreventivoMaterialiDetailed = function (preventivoId, callback) {
  const query = `
        SELECT 
            pm.*,
            m.materiale_name,
            m.materiale_prezzo_unitario,
            t.type_mat_name,
            (pm.preventivo_mat_quantita * m.materiale_prezzo_unitario) as subtotale
        FROM preventivi_materiali pm
        JOIN materiali m ON pm.preventivo_mat_materiale_fk = m.materiale_id
        JOIN type_materiali t ON m.materiale_type_fk = t.type_mat_id
        WHERE pm.preventivo_mat_preventivo_fk = ?
        ORDER BY t.type_mat_name, m.materiale_name
    `;

  db.query(query, [preventivoId], callback);
};