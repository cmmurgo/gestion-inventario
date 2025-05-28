const pool = require('../config/db'); 

exports.buscarProductoPorCodigo = async (codigo) => {
  const result = await pool.query(
    'SELECT * FROM producto WHERE codigo_barra = $1 AND fecha_baja IS NULL',
    [codigo]
  );
  return result.rows[0];
};

exports.getAllProductos = async () => {
  const result = await pool.query(
    'SELECT id, nombre FROM producto WHERE fecha_baja IS NULL ORDER BY id'
  );
  return result.rows;
};
