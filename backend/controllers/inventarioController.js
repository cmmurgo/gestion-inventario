const inventarioModel = require('../models/inventarioModel');

exports.getProductoPorCodigo = async (req, res) => {
  try {
    const codigo = req.params.codigo.trim();
    const producto = await inventarioModel.buscarProductoPorCodigo(codigo);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

exports.getProductos = async (req, res) => {
  try {
    const producto = await inventarioModel.getAllProductos();
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

exports.getProductoPorId = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const producto = await inventarioModel.buscarProductoPorId(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

exports.getTotalVentas = async (req, res) => {
  try {
    const total = await inventarioModel.totalVentas();
    res.json({ total_ventas: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el total de las ventas' });
  }
};

exports.getTotalIngresos = async (req, res) => {
  try {
    const total = await inventarioModel.totalIngresos();
    res.json({ total_ingresos: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el total de los ingresos netos' });
  }
};

exports.getTotalPerdidas = async (req, res) => {
  try {
    const total = await inventarioModel.totalPerdidas();
    res.json({ total_perdidas: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el total de las perdidas' });
  }
};

exports.getTotalCompras = async (req, res) => {
  try {
    const total = await inventarioModel.totalCompras();
    res.json({ total_compras: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el total de las compras' });
  }
};

exports.getTotalGastos = async (req, res) => {
  try {
    const total = await inventarioModel.totalGastos();
    res.json({ total_gastos: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el total de los gastos' });
  }
};

exports.getMovimientosPorMes = async (req, res) => {
  try {
    const movimientos  = await inventarioModel.movimientosPorMes();
    res.json({ movimientos_por_mes: movimientos  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos por mes' });
  }
};