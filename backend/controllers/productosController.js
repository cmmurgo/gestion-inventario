const productoModel = require('../models/productoModel');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await productoModel.getAll();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { rows } = await productoModel.getById(req.params.id);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto', error });
  }
};

exports.create = async (req, res) => {
  try {
    await productoModel.create(req.body);
    res.status(201).json({ message: 'Producto creado correctamente' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto', error });
  }
};

exports.update = async (req, res) => {
  try {
    await productoModel.update(req.params.id, req.body);
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto', error });
  }
};

exports.delete = async (req, res) => {
  try {
    await productoModel.delete(req.params.id);
    res.json({ message: 'Producto eliminado (baja lógica)' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto', error });
  }
};
