const model = require('../models/promocionModel');

exports.getAll = async (req, res) => {
  try {
    const { rows } = await model.getAll();
    res.json(rows);
  } catch (err) {
    console.error('Error en getAll promociones:', err);
    res.status(500).json({ message: 'Error al obtener promociones', error: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const { rows } = await model.getById(req.params.id);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error en getById promociones:', err);
    res.status(500).json({ message: 'Error al obtener promoción', error: err });
  }
};

exports.create = async (req, res) => {
  try {
    await model.create(req.body);
    res.status(201).json({ message: 'Promoción creada correctamente' });
  } catch (err) {
    console.error('Error en create promociones:', err);
    res.status(500).json({ message: 'Error al crear promoción', error: err });
  }
};

exports.update = async (req, res) => {
  try {
    await model.update(req.params.id, req.body);
    res.json({ message: 'Promoción actualizada correctamente' });
  } catch (err) {
    console.error('Error en update promociones:', err);
    res.status(500).json({ message: 'Error al actualizar promoción', error: err });
  }
};

exports.delete = async (req, res) => {
  try {
    await model.delete(req.params.id);
    res.json({ message: 'Promoción eliminada (baja lógica)' });
  } catch (err) {
    console.error('Error en delete promociones:', err);
    res.status(500).json({ message: 'Error al eliminar promoción', error: err });
  }
};

exports.getActivas = async (req, res) => {
  try {
    const { rows } = await model.getActivas();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener promociones activas:', error);
    res.status(500).json({ message: 'Error al obtener promociones activas' });
  }
};