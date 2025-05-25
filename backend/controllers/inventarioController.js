const inventarioModel = require('../models/inventario');

const getProductoPorCodigo = async (req, res) => {
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

module.exports = {
  getProductoPorCodigo,
};
