const movimientoModel = require('../models/movimientoModel');

exports.getAllMovimientos = async (req, res) => {
  try {
    const movimientos = await movimientoModel.getAll();
    res.json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos' });
  }
};

exports.getMovimientoById = async (req, res) => {
  const { id } = req.params;

  try {
    const movimiento = await movimientoModel.getById(id);
    if (!movimiento) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.json(movimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el movimiento' });
  }
};

exports.createMovimiento = async (req, res) => {
  const { id_operacion, id_producto, tipo, cantidad, fecha } = req.body;

  if (!id_producto || !tipo || !cantidad || !fecha) {
    return res.status(400).json({ message: 'Los campos obligatorios son id_producto, tipo, cantidad y fecha' });
  }

  try {
    await movimientoModel.create({ id_operacion, id_producto, tipo, cantidad, fecha });
    res.status(201).json({ message: 'Movimiento creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el movimiento' });
  }
};

exports.deleteMovimiento = async (req, res) => {
  const { id } = req.params;

  try {
    await movimientoModel.softDelete(id);
    res.json({ message: 'Movimiento dado de baja correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el movimiento' });
  }
};

exports.registrarPerdida = async (req, res) => {
    const { id_producto, cantidad } = req.body;
  
    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({ message: 'ID de producto y cantidad positiva son obligatorios' });
    }
  
    try {
      await movimientoModel.registrarPerdida({ id_producto, cantidad });
      res.status(201).json({ message: 'Pérdida registrada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar la pérdida' });
    }
  };
  
