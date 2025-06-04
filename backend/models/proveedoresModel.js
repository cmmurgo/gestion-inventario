const pool = require('../config/db');

exports.getAll = async () => {
  const result = await pool.query(
    `SELECT id, nombre, email, telefono, contacto, direccion, cuit, rubro 
     FROM proveedor 
     WHERE fecha_baja IS NULL 
     ORDER BY id`
  );
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    `SELECT id, nombre, email, telefono, contacto, direccion, cuit, rubro 
     FROM proveedor 
     WHERE id = $1 AND fecha_baja IS NULL`,
    [id]
  );
  return result.rows[0];
};

exports.existsByCuit = async (cuit) => {
  const result = await pool.query(
    'SELECT * FROM proveedor WHERE cuit = $1 AND fecha_baja IS NULL',
    [cuit]
  );
  return result.rows.length > 0;
};

exports.create = async ({ nombre, email, telefono, contacto, direccion, cuit, rubro }) => {
  await pool.query(
    `INSERT INTO proveedor (nombre, email, telefono, contacto, direccion, cuit, rubro) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [nombre, email, telefono, contacto, direccion, cuit, rubro]
  );
};

exports.update = async (id, { nombre, email, telefono, contacto, direccion, cuit, rubro }) => {
  await pool.query(
    `UPDATE proveedor 
     SET nombre = $1, email = $2, telefono = $3, contacto = $4, direccion = $5, cuit = $6, rubro = $7 
     WHERE id = $8 AND fecha_baja IS NULL`,
    [nombre, email, telefono, contacto, direccion, cuit, rubro, id]
  );
};

exports.softDelete = async (id) => {
  await pool.query(
    `UPDATE proveedor 
     SET fecha_baja = NOW() 
     WHERE id = $1`,
    [id]
  );
};