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

exports.getStockBajos = async (req, res) => {
  try {
    const stock_bajos  = await inventarioModel.stockBajos();
    res.json({ stock_bajos: stock_bajos  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los stock bajos' });
  }
};

exports.getTasaRotacion = async (req, res) => {
  try {
    const tasa_rotacion  = await inventarioModel.tasaRotacion();
    res.json({ tasa_rotacion: tasa_rotacion  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener tasa rotacion' });
  }
};

exports.getProductosMayorIngreso = async (req, res) => {
  try {
    const productos_mayor_ingreso  = await inventarioModel.productosMayorIngreso();
    res.json({ productos_mayor_ingreso: productos_mayor_ingreso  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos mayor ingreso' });
  }
};

exports.getProductosMenosVendidos = async (req, res) => {
  try {
    const productos_menos_vendidos  = await inventarioModel.productosMenosVendidos();
    res.json({ productos_menos_vendidos: productos_menos_vendidos  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos mayor ingreso' });
  }
};

exports.getStockProducto = async (req, res) => {
  try {
    const stock_producto  = await inventarioModel.stockProducto();
    res.json({ stock_producto: stock_producto  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos mayor ingreso' });
  }
};


