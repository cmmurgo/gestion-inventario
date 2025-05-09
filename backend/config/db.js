//Produccion:
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 5432,
//   ssl: {
//     rejectUnauthorized: false, // Puede que sea necesario en algunos entornos
//     sslmode: process.env.SSL_MODE, // Asegura el uso de SSL
//   },
// });

// module.exports = pool;

//Local:
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  // ssl: {
  //   rejectUnauthorized: false, // Puede que sea necesario en algunos entornos
  //   sslmode: process.env.SSL_MODE, // Asegura el uso de SSL
  // },
});

module.exports = pool;

