const pool = require('../config/db');

exports.getAll = async () => {
  const result = await pool.query(
    `SELECT pe.id, pe.id_producto, pe.fecha, pe.motivo, pe.cantidad, pr.descripcion, pr.precio_costo
     FROM perdida pe
     inner join producto pr on (pr.id=pe.id_producto)
     WHERE pe.fecha_baja IS NULL 
     ORDER BY pe.id`
  );
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    `SELECT id, id_producto, fecha, motivo, cantidad 
     FROM perdida 
     WHERE id = $1 AND fecha_baja IS NULL`,
    [id]
  );
  return result.rows[0];
};

exports.create = async ({ id_producto, fecha, motivo, cantidad }) => {
  const result = await pool.query(
    `INSERT INTO perdida (id_producto, fecha, motivo, cantidad) 
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [id_producto, fecha, motivo, cantidad]
  );
  return result.rows[0];
};

exports.update = async (id, { id_producto, fecha, motivo, cantidad }) => {
  await pool.query(
    `UPDATE perdida 
     SET id_producto = $1, fecha = $2, motivo = $3, cantidad = $4 
     WHERE id = $5`,
    [id_producto, fecha, motivo, cantidad, id]
  );
};

exports.softDelete = async (id) => {
  await pool.query(
    `UPDATE perdida 
     SET fecha_baja = NOW() 
     WHERE id = $1`,
    [id]
  );
};
