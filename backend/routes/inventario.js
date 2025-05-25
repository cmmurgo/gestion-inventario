const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventarioController');

router.get('/producto/:codigo', controller.getProductoPorCodigo);

module.exports = router;
