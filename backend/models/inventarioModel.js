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
    'SELECT id, nombre, categoria, descripcion,precio_costo, precio_venta, stock_minimo FROM producto WHERE fecha_baja IS NULL ORDER BY id'
  );
  return result.rows;
};

exports.buscarProductoPorId = async (id) => {
  const result = await pool.query(
    'SELECT * FROM producto WHERE id = $1 AND fecha_baja IS NULL',
    [id]
  );
  return result.rows[0];
};

exports.totalVentas = async () => {
  const result = await pool.query(
    `Select count(id) AS total from venta
      WHERE fecha_baja IS NULL and fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalIngresos = async () => {
  const result = await pool.query(
    `Select sum(dv.cantidad*(p.precio_venta-p.precio_costo)) AS total from detalle_venta dv
      INNER JOIN producto p ON p.id = dv.id_producto
      INNER JOIN venta v ON v.id = dv.id_venta
      WHERE dv.fecha_baja IS NULL 
      and v.fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalCompras = async () => {
  const result = await pool.query(
    `Select count(id) AS total from orden_compra
      WHERE fecha_baja IS NULL and fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalPerdidas = async () => {
  const result = await pool.query(
    `Select count(id) AS total from perdida
      WHERE fecha_baja IS NULL and fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};