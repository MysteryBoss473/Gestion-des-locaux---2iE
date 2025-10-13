const express = require('express');
const { 
  getAllBatiments,
  getBatiment,
  createBatiment, 
  updateBatiment,
  deleteBatiment
} = require('../controllers/batimentsController');
const { validateBatimentData, validateCreateBatimentData } = require('../middleware/validation');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllBatiments);
router.get('/:idBatiment', getBatiment);
router.post('/', verifyToken, validateCreateBatimentData, createBatiment);
router.put('/:idBatiment', verifyToken, validateBatimentData, updateBatiment);
router.delete('/:idBatiment', verifyToken, deleteBatiment);

module.exports = router;