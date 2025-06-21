const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedoresController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, proveedoresController.getAllProveedores);
router.post('/', verifyToken, proveedoresController.createProveedor);
router.get('/:id', verifyToken, proveedoresController.getProveedorById);
router.put('/:id', verifyToken, proveedoresController.updateProveedor);
router.delete('/:id', verifyToken, proveedoresController.deleteProveedor);
// Al final del archivo, antes de module.exports:
router.get('/:id/productos', verifyToken, proveedoresController.getProductosByProveedorId);

module.exports = router;