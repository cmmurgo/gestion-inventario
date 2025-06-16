const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, controller.getAll);
router.get('/eliminados', verifyToken, controller.getEliminados);
router.get('/rubro/:id', verifyToken, controller.getByRubroId);
router.get('/:id', verifyToken, controller.getById);
router.post('/', verifyToken, isAdmin, controller.create);
router.put('/:id/restaurar', verifyToken, isAdmin, controller.restaurar);
router.put('/:id', verifyToken, isAdmin, controller.update);
router.delete('/:id', verifyToken, isAdmin, controller.delete);


module.exports = router;
