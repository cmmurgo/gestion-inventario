// models/authModel.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
  return result.rows[0];
};

exports.createUser = async ({ nombre, email, password, rol }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO usuario (nombre, email, clave, rol) VALUES ($1, $2, $3, $4)',
    [nombre, email, hashedPassword, rol]
  );
};

exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
