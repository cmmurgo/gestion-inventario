const perdidaModel = require('../models/perdidaModel');
const movimientoModel = require('../models/movimientoModel');

exports.getAllPerdidas = async (req, res) => {
  try {
    const perdidas = await perdidaModel.getAll();
    res.json(perdidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las pérdidas' });
  }
};

exports.createPerdida = async (req, res) => {
  const { id_producto, fecha, motivo, cantidad } = req.body;

  if (!id_producto || !fecha || !motivo || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // 1. Registrar la pérdida
    const nuevaPerdida = await perdidaModel.create({ id_producto, fecha, motivo, cantidad });
    // 2. Registrar el movimiento asociado
    await movimientoModel.create({
      id_operacion: nuevaPerdida.id, // ← Vincula con la pérdida
      id_producto,
      cantidad: -Math.abs(cantidad), // Pérdida = cantidad negativa
      tipo: 'perdida',
      fecha
    });

    res.status(201).json({ message: 'Pérdida y movimiento registrados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la pérdida y su movimiento' });
  }
};


exports.getPerdidaById = async (req, res) => {
  const { id } = req.params;

  try {
    const perdida = await perdidaModel.getById(id);
    if (!perdida) {
      return res.status(404).json({ message: 'Pérdida no encontrada' });
    }

    res.json(perdida);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la pérdida' });
  }
};

exports.updatePerdida = async (req, res) => {
  const { id } = req.params;
  const { id_producto, fecha, motivo, cantidad } = req.body;

  try {
    // 1. Actualizar la pérdida
    await perdidaModel.update(id, { id_producto, fecha, motivo, cantidad });

    // 2. Actualizar el movimiento asociado
    await movimientoModel.updateByOperacion({
      id_operacion: id,
      id_producto,
      fecha,
      tipo: 'perdida',
      cantidad: -Math.abs(cantidad)
    });

    res.json({ message: 'Pérdida y movimiento actualizados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la pérdida y su movimiento' });
  }
};

exports.deletePerdida = async (req, res) => {
  const { id } = req.params;

  try {
     // 1. Borrar (soft delete) la pérdida
     await perdidaModel.softDelete(id);

     // 2. Borrar (soft delete) el movimiento asociado
     await movimientoModel.softDeleteByOperacion(id, 'perdida');
     res.json({ message: 'Pérdida y movimiento eliminados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la pérdida y su movimiento' });
  }
};
