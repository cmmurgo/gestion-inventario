const ventaModel = require('../models/ventaModel');
const detalleVentaModel = require('../models/detalleVentaModel');

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
    // 1. Crear la cabecera de venta
    const nuevaVenta = await ventaModel.create({ fecha, id_cliente });

    // 2. Insertar los detalles
    for (const detalle of detalles) {
      const { id_producto, cantidad } = detalle;
      await detalleVentaModel.create({
        id_venta: nuevaVenta.id,
        id_producto,
        cantidad
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

  try {
    // 1. Actualizar la cabecera
    await ventaModel.update(id, { fecha, id_cliente });

    // 2. Eliminar lógicamente detalles anteriores
    await detalleVentaModel.softDeleteByVentaId(id);

    // 3. Insertar nuevos detalles
    for (const detalle of detalles) {
      const { id_producto, cantidad } = detalle;
      await detalleVentaModel.create({
        id_venta: id,
        id_producto,
        cantidad
      });
    }

    res.json({ message: 'Venta actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la venta' });
  }
};

exports.deleteVenta = async (req, res) => {
  const { id } = req.params;

  try {
    await ventaModel.softDelete(id);
    await detalleVentaModel.softDeleteByVentaId(id);

    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la venta' });
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
  const { id } = req.params; // ID del detalle de venta
  const { id_producto, cantidad } = req.body;

  try {
    await detalleVentaModel.update({ id, id_producto, cantidad });
    res.status(200).json({ message: 'Detalle de venta actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el detalle de venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

