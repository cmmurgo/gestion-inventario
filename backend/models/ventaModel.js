const pool = require('../config/db');

exports.getAll = async () => {
  const result = await pool.query(
    `SELECT  
      v.id, 
      v.fecha, 
      v.id_cliente,
      CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre_completo,
      COALESCE(SUM(-m.monto), 0) AS total_venta,
      c.cuit_cuil
      FROM venta v
      INNER JOIN cliente c ON c.id = v.id_cliente
      LEFT JOIN movimientos m 
          ON m.id_operacion = v.id 
        AND m.tipo = 'venta' 
        AND m.fecha_baja IS NULL
      WHERE v.fecha_baja IS NULL
      GROUP BY v.id, v.fecha, v.id_cliente, cliente_nombre_completo, c.cuit_cuil
      ORDER BY v.id DESC;
`
  );
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    `SELECT v.id, v.fecha, v.id_cliente, 
     CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre_completo,
     c.cuit_cuil
     FROM venta v
     INNER JOIN cliente c ON c.id = v.id_cliente
     WHERE v.id = $1 AND v.fecha_baja IS NULL`,
    [id]
  );
  return result.rows[0];
};

exports.create = async ({ fecha, id_cliente }) => {
  const result = await pool.query(
    `INSERT INTO venta (fecha, id_cliente)
     VALUES ($1, $2)
     RETURNING id`,
    [fecha, id_cliente]
  );
  return result.rows[0]; // retorna { id: <nuevo_id> }
};

exports.update = async (id, { fecha, id_cliente }) => {
  await pool.query(
    `UPDATE venta
     SET fecha = $1, id_cliente = $2
     WHERE id = $3`,
    [fecha, id_cliente, id]
  );
};

exports.softDelete = async (id) => {
  await pool.query(
    `UPDATE venta
     SET fecha_baja = NOW()
     WHERE id = $1`,
    [id]
  );
};


