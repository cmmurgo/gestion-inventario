const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/movimientos-por-mes', verifyToken, inventarioController.getMovimientosPorMes);
router.get('/totales/perdidas', verifyToken, inventarioController.getTotalPerdidas);
router.get('/totales/ventas', verifyToken, inventarioController.getTotalVentas);
router.get('/totales/ingresos', verifyToken, inventarioController.getTotalIngresos);
router.get('/totales/compras', verifyToken, inventarioController.getTotalCompras);
router.get('/totales/gastos', verifyToken, inventarioController.getTotalGastos);
router.get('/producto/:codigo', inventarioController.getProductoPorCodigo);
router.get('/productos/', verifyToken, inventarioController.getProductos);
router.get('/productos/:id', verifyToken, inventarioController.getProductoPorId);

module.exports = router;
