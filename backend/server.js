const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usuarios');

// Middlewares primero
app.use(cors());
app.use(express.json());

// Luego las rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
