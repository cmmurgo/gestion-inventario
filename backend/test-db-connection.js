// test-db-connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: false,
});

(async () => {
  try {
    console.log('Conectando a la base:', process.env.DB_NAME);
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tablas en la base de datos:', res.rows.map(row => row.table_name));
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al conectar o listar tablas:', err.message);
    process.exit(1);
  }
})();
