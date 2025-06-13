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
  let monto = null;

  if (tipo === 'venta') {
    const res = await pool.query(
      `SELECT p.precio_venta, pr.porcentaje
       FROM producto p
       LEFT JOIN promocion pr ON pr.id = p.id_promocion
       WHERE p.id = $1`,
      [id_producto]
    );

    const precio_venta = res.rows[0]?.precio_venta || 0;
    const porcentaje = res.rows[0]?.porcentaje || 0;
    const precio_final = precio_venta - (precio_venta * porcentaje / 100);
    monto = Math.round(cantidad * precio_final);

  } else if (tipo === 'compra' || tipo === 'perdida') {
    const res = await pool.query(
      `SELECT precio_costo FROM producto WHERE id = $1`,
      [id_producto]
    );

    const precio_costo = res.rows[0]?.precio_costo || 0;
    monto = Math.round(cantidad * precio_costo);
  }

  await pool.query(
    `INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, monto)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id_operacion, id_producto, tipo, cantidad, fecha, monto]
  );
};



exports.softDelete = async (id) => {
  await pool.query(
    `UPDATE movimientos SET fecha_baja = NOW() WHERE id = $1`,
    [id]
  );
};

exports.updateByOperacion = async ({ id_operacion, id_producto, fecha, tipo, cantidad }) => {
  let monto = null;

  if (tipo === 'venta') {
    const res = await pool.query(
      `SELECT p.precio_venta, pr.porcentaje
       FROM producto p
       LEFT JOIN promocion pr ON pr.id = p.id_promocion
       WHERE p.id = $1`,
      [id_producto]
    );

    const precio_venta = res.rows[0]?.precio_venta || 0;
    const porcentaje = res.rows[0]?.porcentaje || 0;
    const precio_final = precio_venta - (precio_venta * porcentaje / 100);
    monto = Math.round(cantidad * precio_final);

  } else if (tipo === 'compra' || tipo === 'perdida') {
    const res = await pool.query(
      `SELECT precio_costo FROM producto WHERE id = $1`,
      [id_producto]
    );

    const precio_costo = res.rows[0]?.precio_costo || 0;
    monto = Math.round(cantidad * precio_costo);
  }

  const query = `
    UPDATE movimientos
    SET id_producto = $1,
        cantidad = $2,
        fecha = $3,
        monto = $4
    WHERE id_operacion = $5 AND tipo = $6
  `;

  const values = [id_producto, cantidad, fecha, monto, id_operacion, tipo];
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

  exports.controlSaldo = async ( id_producto ) => {
    const query = `
      SELECT SUM(cantidad) AS saldo from movimientos
      WHERE id_producto = $1         
      AND fecha_baja IS NULL
    `;
  
    const values = [id_producto];
    const result = await pool.query(query, values);

    return result.rows[0].saldo;
  };

  
