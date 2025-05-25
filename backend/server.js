const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usuarios');
const clientRoutes = require('./routes/clientes');
const inventarioRoutes = require('./routes/inventario');

// Middlewares primero
app.use(cors());
app.use(express.json());

// Luego las rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/inventario', inventarioRoutes);

// Exportar app para pruebas
module.exports = app;

// Iniciar el servidor solo si NO estamos corriendo tests
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

/*
 //Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
*/