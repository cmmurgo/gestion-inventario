// src/models/proveedoresModel.js

const pool = require('../config/db');

exports.getAll = async () => {
  const result = await pool.query(
    `SELECT
      p.id,
      p.nombre,
      p.email,
      p.telefono,
      p.contacto,
      p.direccion,
      p.cuit,
      p.id_rubro,
      p.fecha_baja,
      r.nombre AS rubro_nombre,
      CASE WHEN p.fecha_baja IS NULL THEN 'Activo' ELSE 'Inactivo' END AS estado
    FROM proveedor p
    LEFT JOIN rubro r ON p.id_rubro = r.id
    ORDER BY p.id`
  );
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query(
    `SELECT
      p.id,
      p.nombre,
      p.email,
      p.telefono,
      p.contacto,
      p.direccion,
      p.cuit,
      p.id_rubro,
      p.fecha_baja,
      r.nombre AS rubro_nombre,
      CASE WHEN p.fecha_baja IS NULL THEN 'Activo' ELSE 'Inactivo' END AS estado
    FROM proveedor p
    LEFT JOIN rubro r ON p.id_rubro = r.id
    WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Modified to check for active suppliers only by default, with option to include all
exports.existsByCuit = async (cuit, excludeId = null) => {
  let query = 'SELECT id FROM proveedor WHERE cuit = $1 AND fecha_baja IS NULL';
  let params = [cuit];
  
  if (excludeId) {
    query += ' AND id != $2';
    params.push(excludeId);
  }
  
  const result = await pool.query(query, params);
  return result.rowCount > 0;
};

exports.create = async ({ nombre, email, telefono, contacto, direccion, cuit, id_rubro }) => {
  await pool.query(
    `INSERT INTO proveedor (nombre, email, telefono, contacto, direccion, cuit, id_rubro)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [nombre, email, telefono, contacto, direccion, cuit, id_rubro]
  );
};

exports.update = async (id, { nombre, email, telefono, contacto, direccion, cuit, id_rubro }) => {
  await pool.query(
    `UPDATE proveedor
      SET nombre = $1, email = $2, telefono = $3, contacto = $4,
          direccion = $5, cuit = $6, id_rubro = $7
      WHERE id = $8`,
    [nombre, email, telefono, contacto, direccion, cuit, id_rubro, id]
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