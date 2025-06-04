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
  const { nombre, email, telefono, contacto, direccion, cuit, rubro } = req.body;

  if (!nombre || !email || !telefono || !contacto || !direccion || !cuit || !rubro) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const existe = await proveedoresModel.existsByCuit(cuit);
    if (existe) {
      return res.status(400).json({ message: 'El proveedor ya existe' });
    }

    await proveedoresModel.create({ nombre, email, telefono, contacto, direccion, cuit, rubro });
    res.status(201).json({ message: 'Proveedor creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el proveedor' });
  }
};

exports.updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, contacto, direccion, cuit, rubro } = req.body;

  try {
    await proveedoresModel.update(id, { nombre, email, telefono, contacto, direccion, cuit, rubro });
    res.json({ message: 'Proveedor actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el proveedor' });
  }
};

exports.deleteProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    await proveedoresModel.softDelete(id);
    res.json({ message: 'Proveedor dado de baja correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el proveedor' });
  }
};