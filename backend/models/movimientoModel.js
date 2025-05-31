const pool = require('../config/db');

exports.getAll = async () => {
  const result = await pool.query(
    `SELECT id, id_operacion, id_producto, tipo, cantidad, fecha 
     FROM movimientos 
     WHERE fecha_baja IS NULL 
     ORDER BY id`
  );
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    `SELECT id, id_operacion, id_producto, tipo, cantidad, fecha 
     FROM movimientos 
     WHERE id = $1 AND fecha_baja IS NULL`,
    [id]
  );
  return result.rows[0];
};

exports.create = async ({ id_operacion, id_producto, tipo, cantidad, fecha }) => {
  await pool.query(
    `INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha) 
     VALUES ($1, $2, $3, $4, $5)`,
    [id_operacion, id_producto, tipo, cantidad, fecha]
  );
};

exports.softDelete = async (id) => {
  await pool.query(
    `UPDATE movimientos SET fecha_baja = NOW() WHERE id = $1`,
    [id]
  );
};

exports.updateByOperacion = async ({ id_operacion, id_producto, fecha, tipo, cantidad }) => {
    const query = `
      UPDATE movimientos
      SET id_producto = $1,
          cantidad = $2,
          fecha = $3
      WHERE id_operacion = $4 AND tipo = $5
    `;
  
    const values = [id_producto, cantidad, fecha, id_operacion, tipo];
    await pool.query(query, values);
  };

exports.softDeleteByOperacion = async (id_operacion, tipo) => {
    const query = `
      UPDATE movimientos
      SET fecha_baja = CURRENT_DATE
      WHERE id_operacion = $1 AND tipo = $2
    `;
    const values = [id_operacion, tipo];
  
    await pool.query(query, values);
  };
  
