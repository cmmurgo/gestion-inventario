const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

/*
console.log('Conectando a la base:', process.env.DB_NAME);

pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'')
  .then(res => {
    console.log('Tablas encontradas en la base:', res.rows.map(r => r.table_name));
  })
  .catch(err => {
    console.error('Error al listar tablas:', err.message);
  });*/

module.exports = pool;

