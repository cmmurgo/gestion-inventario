const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000; //Para Producción
//const PORT = process.env.PORT || 3001; //Para Local
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
