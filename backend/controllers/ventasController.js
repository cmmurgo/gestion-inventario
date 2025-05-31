const ventaModel = require('../models/ventaModel');
const detalleVentaModel = require('../models/detalleVentaModel');
const movimientoModel = require('../models/movimientoModel');

exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await ventaModel.getAll();
    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las ventas' });
  }
};

exports.createVenta = async (req, res) => {
  const { fecha, id_cliente, detalles } = req.body;

  if (!fecha || !id_cliente || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios y debe haber al menos un detalle' });
  }

  try {
    const nuevaVenta = await ventaModel.create({ fecha, id_cliente });

    for (const detalle of detalles) {
      const { id_producto, cantidad } = detalle;

      await detalleVentaModel.create({
        id_venta: nuevaVenta.id,
        id_producto,
        cantidad
      });

      await movimientoModel.create({
        id_operacion: nuevaVenta.id,
        id_producto,
        cantidad: -Math.abs(cantidad),
        tipo: 'venta',
        fecha
      });
    }

    res.status(201).json({ message: 'Venta creada correctamente', id: nuevaVenta.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la venta' });
  }
};

exports.getVentaById = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await ventaModel.getById(id);
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const detalles = await detalleVentaModel.getByVentaId(id);
    res.json({ ...venta, detalles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la venta' });
  }
};

exports.updateVenta = async (req, res) => {
  const { id } = req.params;
  const { fecha, id_cliente, detalles } = req.body;

  if (!fecha || !id_cliente || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios y debe haber al menos un detalle' });
  }

  try {
    // 1. Actualizar la cabecera
    await ventaModel.update(id, { fecha, id_cliente });

    // 2. Eliminar lógicamente los detalles y movimientos anteriores
    await detalleVentaModel.softDeleteByVentaId(id);
    await movimientoModel.softDeleteByOperacion(id, 'venta');

    // 3. Insertar nuevos detalles y movimientos
    for (const detalle of detalles) {
      const { id_producto, cantidad } = detalle;

      // Crear detalle
      await detalleVentaModel.create({
        id_venta: id,
        id_producto,
        cantidad
      });

      // Crear movimiento
      await movimientoModel.create({
        id_operacion: id,
        id_producto,
        cantidad: -Math.abs(cantidad),
        tipo: 'venta',
        fecha
      });
    }

    res.json({ message: 'Venta y movimientos actualizados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la venta y sus movimientos' });
  }
};


exports.deleteVenta = async (req, res) => {
  const { id } = req.params;

  try {
    await ventaModel.softDelete(id);
    await detalleVentaModel.softDeleteByVentaId(id);
    await movimientoModel.softDeleteByOperacion(id, 'venta');

    res.json({ message: 'Venta y movimiento eliminados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la venta y su movimiento' });
  }
};

exports.getDetalleVentaById = async (req, res) => {
  const id_venta = req.params.id;
  try {
    const detalles = await detalleVentaModel.getByVentaId(id_venta);
    res.json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener detalles de la venta' });
  }
};

exports.updateDetalleVenta = async (req, res) => {
  const { id } = req.params;
  const { id_producto, cantidad } = req.body;

  try {
    await detalleVentaModel.update({ id, id_producto, cantidad });
    res.status(200).json({ message: 'Detalle de venta actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el detalle de venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
