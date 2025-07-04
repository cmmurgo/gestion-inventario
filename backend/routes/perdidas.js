const express = require('express');
const router = express.Router();
const perdidasController = require('../controllers/perdidasController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas con token
router.get('/', verifyToken, perdidasController.getAllPerdidas);
router.post('/', verifyToken, perdidasController.createPerdida);
router.get('/:id', verifyToken, perdidasController.getPerdidaById);
router.put('/:id', verifyToken, perdidasController.updatePerdida);
router.delete('/:id', verifyToken, perdidasController.deletePerdida);

module.exports = router;
