const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventarioController');
const inventarioController = require('../controllers/inventarioController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/producto/:codigo', controller.getProductoPorCodigo);
router.get('/productos/', verifyToken, inventarioController.getProductos);

module.exports = router;
