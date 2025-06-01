const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientosController');

router.get('/saldo/:id_producto', movimientosController.getSaldo);
router.get('/', movimientosController.getAllMovimientos);
router.get('/:id', movimientosController.getMovimientoById);
router.post('/', movimientosController.createMovimiento);
router.delete('/:id', movimientosController.deleteMovimiento);

module.exports = router;
