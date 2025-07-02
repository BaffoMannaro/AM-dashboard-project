// Definisce gli endpoint REST

const express = require('express');
const router = express.Router();

// Log per debug
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Richiesta ricevuta nel router: ${req.method} ${req.originalUrl}`);
  next();
});


// Importazione dei controller
const typeMaterialiController = require('../controllers/typeMaterialiController');
const materialiController = require('../controllers/materialiController');
const usuraMaterialiController = require('../controllers/usuraMaterialiController');
const trasportoController = require('../controllers/trasportoController');
const preventiviController = require('../controllers/preventiviController');
const preventiviMaterialiController = require('../controllers/preventiviMaterialiController');
const scontiController = require('../controllers/scontiController');

// Importazione corretta dei validatori
const validateMateriale = require('../validators/materialiValidator');
const validatePreventivo = require('../validators/preventiviValidator');
const validatePreventivoMateriale = require('../validators/preventiviMaterialiValidator');
const validateSconto = require('../validators/scontiValidator');
const validateUsuraMateriale = require('../validators/usuraMaterialiValidator');
const validateTrasporto = require('../validators/trasportoValidator');
const validateTypeMateriale = require('../validators/typeMaterialiValidator');

// Type Materiali Routes
router.get('/type_materiali/get-all',
  typeMaterialiController.getAllTypeMateriali);
router.get('/type_materiali/get-by-id/:id',
  typeMaterialiController.getTypeMaterialeById);
router.post('/type_materiali/create',
  validateTypeMateriale,
  typeMaterialiController.createTypeMateriale);
router.post('/type_materiali/update/:id',
  validateTypeMateriale,
  typeMaterialiController.updateTypeMateriale);
router.post('/type_materiali/delete/:id',
  typeMaterialiController.deleteTypeMateriale);

// Materiali Routes
router.get('/materiali/get-all', 
  materialiController.getAllMateriali);
router.get('/materiali/get-by-id/:id', 
  materialiController.getMaterialeById);
router.post('/materiali/create', 
  validateMateriale,
  materialiController.createMateriale);
router.put('/materiali/update/:id', // Modificato da POST a PUT
  validateMateriale,
  materialiController.updateMateriale);
router.delete('/materiali/delete/:id', // Modificato da POST a DELETE
  materialiController.deleteMateriale);

// Usura Materiali Routes
router.get('/usura_materiali/get-all', 
  usuraMaterialiController.getAllUsuraMateriali);
router.get('/usura_materiali/get-by-id/:id', 
  usuraMaterialiController.getUsuraMaterialeById);
router.get('/usura_materiali/by-materiale/:id', 
  usuraMaterialiController.getUsuraByMaterialeId);
router.post('/usura_materiali/create', 
  validateUsuraMateriale,
  usuraMaterialiController.createUsuraMateriale);
router.post('/usura_materiali/update', // Rimuoviamo :id
  validateUsuraMateriale,
  usuraMaterialiController.updateUsuraMateriale);
router.post('/usura_materiale/delete', // Rimuoviamo :id
  usuraMaterialiController.deleteUsuraMateriale);

// Trasporto Routes
router.get('/trasporto/get-all', 
  trasportoController.getAllTrasporto);
router.get('/trasporto/get-by-id/:id', 
  trasportoController.getTrasportoById);
router.post('/trasporto/create', 
  validateTrasporto,
  trasportoController.createTrasporto);
router.post('/trasporto/update/:id', 
  validateTrasporto,
  trasportoController.updateTrasporto);
router.post('/trasporto/delete/:id', 
  trasportoController.deleteTrasporto);

// Preventivi Routes
router.get('/preventivi/get-all',
  preventiviController.getAllPreventivi);
router.get('/preventivi/get-by-id/:id',
  preventiviController.getPreventivoById);
router.post('/preventivi/create',
  validatePreventivo,
  preventiviController.createPreventivo);
router.put('/preventivi/update/:id',
  validatePreventivo,
  preventiviController.updatePreventivo);
router.delete('/preventivi/delete/:id',
  preventiviController.deletePreventivo);
router.get('/preventivi/:id/materiali',
  preventiviController.getPreventivoMateriali);

// Preventivi Materiali Routes
router.get('/preventivi_materiali/get-all', 
  preventiviMaterialiController.getAllPreventiviMateriali);
router.get('/preventivi_materiali/get-by-id/:id', 
  preventiviMaterialiController.getPreventivoMaterialiById);
router.post('/preventivi_materiali/create', 
  validatePreventivoMateriale,
  preventiviMaterialiController.createPreventivoMateriale);
router.post('/preventivi_materiali/update/:id', 
  validatePreventivoMateriale,
  preventiviMaterialiController.updatePreventivoMateriale);
router.post('/preventivi_materiali/delete/:id', 
  preventiviMaterialiController.deletePreventivoMateriale);

// Sconti Routes
router.get('/sconti/get-all', 
  scontiController.getAllSconti);
router.get('/sconti/get-by-id/:id', 
  scontiController.getScontoById);
router.post('/sconti/create', 
  validateSconto,
  scontiController.createSconto);
router.post('/sconti/update/:id', 
  validateSconto,
  scontiController.updateSconto);
router.post('/sconti/delete/:id', 
  scontiController.deleteSconto);

////////
//////// Nuove rotte per query complesse
////////

router.post('/materiali/with-type', materialiController.getMaterialiWithType);
router.post('/preventivi/with-totals', preventiviController.getPreventiviWithTotals);
router.post('/preventivi_materiali/detailed/:id', preventiviMaterialiController.getPreventivoMaterialiById);

// Rotte per la gestione dei preventivi
router.post('/preventivi/calcola-totale', preventiviController.calcolaTotalePreventivo);
router.post('/preventivi/applica-sconto', preventiviController.applicaSconto);

// Rotte per la gestione dell'usura
router.post('/materiali/calcola-usura', materialiController.calcolaUsura);
router.post('/materiali/verifica-stato-usura', materialiController.verificaStatoUsura);



// Aggiungiamo una rotta di test per essere sicuri che il file venga caricato
router.get('/test-routes', (req, res) => {
  res.json({ message: 'File Routes.js caricato e risponde!' });
});

module.exports = router;