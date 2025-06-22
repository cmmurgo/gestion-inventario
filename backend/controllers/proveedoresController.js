// src/controllers/proveedoresController.js
const pool = require('../config/db');
const proveedoresModel = require('../models/proveedoresModel');

exports.getAllProveedores = async (req, res) => {
  try {
    const proveedores = await proveedoresModel.getAll();
    res.json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los proveedores' });
  }
};

exports.getProveedorById = async (req, res) => {
  const { id } = req.params;

  try {
    const proveedor = await proveedoresModel.getById(id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el proveedor' });
  }
};

exports.createProveedor = async (req, res) => {
  const { nombre, email, telefono, contacto, direccion, cuit, id_rubro } = req.body;

  if (!nombre || !email || !telefono || !contacto || !direccion || !cuit || id_rubro === undefined || id_rubro === null) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Check if CUIT already exists
    const existe = await proveedoresModel.existsByCuit(cuit);
    if (existe) {
      return res.status(400).json({ message: 'Ya existe un proveedor con este CUIT' });
    }

    await proveedoresModel.create({ nombre, email, telefono, contacto, direccion, cuit, id_rubro });
    res.status(201).json({ message: 'Proveedor creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el proveedor' });
  }
};

exports.updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, contacto, direccion, cuit, id_rubro } = req.body;

  try {
    const proveedorExiste = await proveedoresModel.getById(id);
    if (!proveedorExiste) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    // Check if CUIT already exists (excluding current provider)
    const cuitExiste = await proveedoresModel.existsByCuit(cuit, id);
    if (cuitExiste) {
      return res.status(400).json({ message: 'Ya existe otro proveedor con este CUIT' });
    }

    await proveedoresModel.update(id, { nombre, email, telefono, contacto, direccion, cuit, id_rubro });
    res.json({ message: 'Proveedor actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el proveedor' });
  }
};

exports.deleteProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    const proveedorExiste = await proveedoresModel.getById(id);
    if (!proveedorExiste) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }

    // Check if supplier is already inactive
    if (proveedorExiste.fecha_baja) {
      return res.status(400).json({ message: 'El proveedor ya está inactivo' });
    }

    await proveedoresModel.softDelete(id);
    res.json({ message: 'Proveedor dado de baja correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el proveedor' });
  }
};

exports.getProductosByProveedorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Buscando productos para proveedor ID:', id);
    
    const query = `
      SELECT 
        p.id, 
        p.nombre, 
        p.precio_costo, 
        p.precio_venta, 
        p.descripcion,
        p.stock_minimo,
        r.nombre as rubro_nombre
      FROM producto p
      LEFT JOIN rubro r ON p.id_rubro = r.id
      WHERE p.id_proveedor = $1 
      AND (p.fecha_baja IS NULL)
      ORDER BY p.nombre
    `;
    
    const result = await pool.query(query, [id]);
    
    console.log(`Productos encontrados para proveedor ${id}:`, result.rows.length);
    console.log('Productos:', result.rows);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos por proveedor:', error);
    res.status(500).json({ 
      message: 'Error al obtener productos por proveedor',
      error: error.message 
    });
  }
};