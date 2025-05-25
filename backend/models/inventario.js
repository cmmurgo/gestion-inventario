const pool = require('../config/db'); 

const buscarProductoPorCodigo = async (codigo) => {
  const result = await pool.query(
    'SELECT * FROM producto WHERE codigo_barra = $1 AND fecha_baja IS NULL',
    [codigo]
  );
  return result.rows[0];
};

module.exports = {
  buscarProductoPorCodigo,
};
