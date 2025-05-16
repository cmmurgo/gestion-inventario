const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.getAll = async () => {
  const result = await pool.query('SELECT id, nombre, email, rol FROM usuario WHERE fecha_baja IS NULL ORDER BY id');
  return result.rows;
};

exports.getById = async (id) => {
  const result = await pool.query('SELECT id, nombre, email, rol FROM usuario WHERE id = $1 AND fecha_baja IS NULL', [id]);
  return result.rows[0];
};

exports.existsByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
  return result.rows.length > 0;
};

exports.create = async ({ nombre, email, password, rol }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO usuario (nombre, email, clave, rol) VALUES ($1, $2, $3, $4)',
    [nombre, email, hashedPassword, rol]
  );
};

exports.update = async (id, { nombre, email, password, rol }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'UPDATE usuario SET nombre = $1, email = $2, clave = $3, rol = $4 WHERE id = $5',
    [nombre, email, hashedPassword, rol, id]
  );
};

exports.softDelete = async (id) => {
  await pool.query(
    'UPDATE usuario SET fecha_baja = NOW() WHERE id = $1',
    [id]
  );
};
