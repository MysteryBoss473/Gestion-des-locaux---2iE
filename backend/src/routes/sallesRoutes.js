const express = require('express');
const sallesController = require('../controllers/sallesController');
const { validateSalleData, validateUpdateSalleData } = require('../middleware/validation');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Routes spécifiques d'abord
router.get('/search', sallesController.searchSalles);
router.get('/batiment/:idBatiment', sallesController.getAllSalles);

// Route générique pour obtenir une salle spécifique (doit être après les routes spécifiques)
router.get('/:idSalle', sallesController.getSalleById);
router.post('/', verifyToken, validateSalleData, sallesController.createSalle);
router.put('/:idSalle', verifyToken, validateUpdateSalleData, sallesController.updateSalle);
router.delete('/:idSalle', verifyToken, sallesController.deleteSalle);

module.exports = router;