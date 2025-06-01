const pool = require('../config/db');

exports.getByVentaId = async (id_venta) => {
  const result = await pool.query(
    `SELECT dv.id, dv.id_producto, p.descripcion, dv.cantidad, p.precio_venta
     FROM detalle_venta dv
     INNER JOIN producto p ON p.id = dv.id_producto
     INNER JOIN venta v ON v.id = dv.id_venta
     WHERE v.id = $1 AND dv.fecha_baja IS NULL`,
    [id_venta]
  );
  return result.rows;
};

exports.create = async ({ id_venta, id_producto, cantidad }) => {
  await pool.query(
    `INSERT INTO detalle_venta (id_venta, id_producto, cantidad)
     VALUES ($1, $2, $3)`,
    [id_venta, id_producto, cantidad]
  );
};

exports.update = async ({ id, id_producto, cantidad }) => {
  await pool.query(
    `UPDATE detalle_venta
     SET id_producto = $1,
         cantidad = $2
     WHERE id = $3 AND fecha_baja IS NULL`,
    [id_producto, cantidad, id]
  );
};

exports.softDeleteByVentaId = async (id_venta) => {
  await pool.query(
    `UPDATE detalle_venta
     SET fecha_baja = NOW()
     WHERE id_venta = $1`,
    [id_venta]
  );
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

