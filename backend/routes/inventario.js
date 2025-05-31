const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventarioController');
const inventarioController = require('../controllers/inventarioController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/producto/:codigo', controller.getProductoPorCodigo);
router.get('/productos/', verifyToken, inventarioController.getProductos);
router.get('/productos/:id', verifyToken, inventarioController.getProductoPorId);

module.exports = router;
