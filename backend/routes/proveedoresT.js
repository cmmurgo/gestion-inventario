// ruta provisional en el backend para tomar listado de proveedores y poder utilizar en el backend

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middlewares/authMiddleware');


router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nombre 
      FROM proveedor 
      WHERE fecha_baja IS NULL OR fecha_baja IS NULL 
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
});

module.exports = router;
