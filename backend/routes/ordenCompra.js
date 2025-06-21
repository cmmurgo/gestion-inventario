const express = require('express');
const router = express.Router();
const ordenCompraController = require('../controllers/ordenCompraController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas con token
router.get('/', verifyToken, ordenCompraController.getAllOrdenesCompra);
router.get('/:id', verifyToken, ordenCompraController.getOrdenCompraById);
router.post('/', verifyToken, ordenCompraController.createOrdenCompra);
router.put('/:id', verifyToken, ordenCompraController.updateOrdenCompra);
router.delete('/:id', verifyToken, ordenCompraController.deleteOrdenCompra);

module.exports = router;