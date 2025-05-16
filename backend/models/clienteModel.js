const pool = require('../config/db');

exports.getAll = async () => {
  const result = await pool.query(
    'SELECT id, nombre, apellido, email, cuit_cuil, direccion, telefono FROM cliente WHERE fecha_baja IS NULL ORDER BY id'
  );
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    'SELECT id, nombre, apellido, email, cuit_cuil, direccion, telefono FROM cliente WHERE id = $1 AND fecha_baja IS NULL',
    [id]
  );
  return result.rows[0];
};

exports.existsByCuitCuil = async (cuit_cuil) => {
  const result = await pool.query(
    'SELECT * FROM cliente WHERE cuit_cuil = $1 AND fecha_baja IS NULL',
    [cuit_cuil]
  );
  return result.rows.length > 0;
};

exports.create = async ({ nombre, apellido, email, cuit_cuil, direccion, telefono }) => {
  await pool.query(
    'INSERT INTO cliente (nombre, apellido, email, cuit_cuil, direccion, telefono) VALUES ($1, $2, $3, $4, $5, $6)',
    [nombre, apellido, email, cuit_cuil, direccion, telefono]
  );
};

exports.update = async (id, { nombre, apellido, email, cuit_cuil, direccion, telefono }) => {
  await pool.query(
    'UPDATE cliente SET nombre = $1, apellido = $2, email = $3, cuit_cuil = $4, direccion = $5, telefono = $6 WHERE id = $7',
    [nombre, apellido, email, cuit_cuil, direccion, telefono, id]
  );
};

exports.softDelete = async (id) => {
  await pool.query(
    'UPDATE cliente SET fecha_baja = NOW() WHERE id = $1',
    [id]
  );
};
