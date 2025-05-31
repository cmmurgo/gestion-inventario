const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas con token
router.get('/', verifyToken, ventasController.getAllVentas);
router.post('/', verifyToken, ventasController.createVenta);
router.get('/total_ventas/', verifyToken, ventasController.getTotalVentas);
router.get('/:id', verifyToken, ventasController.getVentaById);
router.put('/:id', verifyToken, ventasController.updateVenta);
router.delete('/:id', verifyToken, ventasController.deleteVenta);
router.get('/detalle/:id', verifyToken, ventasController.getDetalleVentaById);
router.put('/detalle/:id', verifyToken, ventasController.updateDetalleVenta);

module.exports = router;
