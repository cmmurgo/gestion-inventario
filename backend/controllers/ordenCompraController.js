// backend/src/controllers/ordenCompraController.js
const OrdenCompra = require('../models/ordenCompraModel');
const detalleOrdenCompraModel = require('../models/detalleOrdenCompraModel');
const movimientoModel = require('../models/movimientoModel');

const getAllOrdenesCompra = async (req, res) => {
  try {
    const ordenesCompra = await OrdenCompra.findAll();
    res.status(200).json(ordenesCompra);
  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes de compra' });
  }
};

const getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenCompra = await OrdenCompra.findById(id);
    
    if (!ordenCompra) {
      return res.status(404).json({ error: 'Orden de compra no encontrada' });
    }

    // Obtener los detalles
    const detalles = await detalleOrdenCompraModel.getByOrdenCompraId(id);
    
    res.status(200).json({ ...ordenCompra, detalles });
  } catch (error) {
    console.error('Error al obtener orden de compra:', error);
    res.status(500).json({ error: 'Error al obtener la orden de compra' });
  }
};

const createOrdenCompra = async (req, res) => {
  const { fecha, id_proveedor, detalles, estado = 'Creada' } = req.body;

  if (!fecha || !id_proveedor || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios y debe haber al menos un detalle' 
    });
  }

  try {
    // Crear la orden de compra
    const nuevaOrden = await OrdenCompra.create({ fecha, id_proveedor, estado });

    // Crear detalles y movimientos
    for (const detalle of detalles) {
      const { id_producto, cantidad } = detalle;

      // Crear detalle
      await detalleOrdenCompraModel.create({
        id_orden_compra: nuevaOrden.id,
        id_producto,
        cantidad
      });

      // Crear movimiento POSITIVO (entrada de stock)
      await movimientoModel.create({
        id_operacion: nuevaOrden.id,
        id_producto,
        cantidad: Math.abs(cantidad),
        tipo: 'compra',
        fecha
      });
    }

    res.status(201).json({ 
      message: 'Orden de compra creada correctamente', 
      id: nuevaOrden.id 
    });
  } catch (error) {
    console.error('Error al crear orden de compra:', error);
    res.status(500).json({ 
      error: 'Error al crear la orden de compra', 
      details: error.message 
    });
  }
};

const updateOrdenCompra = async (req, res) => {
  const { id } = req.params;
  const { fecha, id_proveedor, estado, detalles } = req.body;

  if (!fecha || !id_proveedor || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios y debe haber al menos un detalle' 
    });
  }

  try {
    // 1. Actualizar la cabecera
    await OrdenCompra.update(id, { fecha, id_proveedor, estado });

    // 2. Eliminar lógicamente los detalles y movimientos anteriores
    await detalleOrdenCompraModel.softDeleteByOrdenCompraId(id);
    await movimientoModel.softDeleteByOperacion(id, 'compra');

    // 3. Si el estado es 'Cancelada', también hacer soft delete de la orden
    if (estado === 'Cancelada') {
      await OrdenCompra.softDelete(id);
    } else {
      // 4. Solo si NO está cancelada, insertar nuevos detalles y movimientos
      for (const detalle of detalles) {
        const { id_producto, cantidad } = detalle;

        // Crear detalle
        await detalleOrdenCompraModel.create({
          id_orden_compra: id,
          id_producto,
          cantidad
        });

        // Crear movimiento POSITIVO (entrada de stock)
        await movimientoModel.create({
          id_operacion: id,
          id_producto,
          cantidad: Math.abs(cantidad),
          tipo: 'compra',
          fecha
        });
      }
    }

    res.status(200).json({ 
      message: 'Orden de compra y movimientos actualizados correctamente' 
    });
  } catch (error) {
    console.error('Error al actualizar orden de compra:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la orden de compra', 
      details: error.message 
    });
  }
};

const deleteOrdenCompra = async (req, res) => {
  const { id } = req.params;

  try {
    // Eliminar lógicamente la orden, detalles y movimientos
    await OrdenCompra.softDelete(id);
    await detalleOrdenCompraModel.softDeleteByOrdenCompraId(id);
    await movimientoModel.softDeleteByOperacion(id, 'compra');

    res.status(200).json({ 
      message: 'Orden de compra y movimientos eliminados correctamente' 
    });
  } catch (error) {
    console.error('Error al eliminar orden de compra:', error);
    res.status(500).json({ 
      error: 'Error al eliminar la orden de compra', 
      details: error.message 
    });
  }
};

module.exports = {
  getAllOrdenesCompra,
  getOrdenCompraById,
  createOrdenCompra,
  updateOrdenCompra,
  deleteOrdenCompra
};