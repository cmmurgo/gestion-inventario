// routes/userRoutes.js (o routes.js)
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken,isAdmin } = require('../middlewares/authMiddleware');

// Rutas protegidas con token
router.get('/', verifyToken, usuariosController.getAllUsers);
router.post('/', verifyToken, isAdmin, usuariosController.createUser);
router.get('/:id', verifyToken, usuariosController.getUserById);
router.put('/:id', verifyToken, usuariosController.updateUser);
router.delete('/:id', verifyToken, usuariosController.deleteUser);

module.exports = router;
