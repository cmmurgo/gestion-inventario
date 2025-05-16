const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas con token
router.get('/', verifyToken, clientesController.getAllClientes);
router.post('/', verifyToken, isAdmin, clientesController.createCliente);
router.get('/:id', verifyToken, clientesController.getClienteById);
router.put('/:id', verifyToken, clientesController.updateCliente);
router.delete('/:id', verifyToken, isAdmin, clientesController.deleteCliente);

module.exports = router;
