const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usuarios');
const clientRoutes = require('./routes/clientes');
const inventarioRoutes = require('./routes/inventario');
const perdidaRoutes = require('./routes/perdidas');
const movimientosRoutes = require('./routes/movimientos');
const ventasRoutes = require('./routes/ventas');
const productosRoutes = require('./routes/productos');
const promocionesRoutes = require('./routes/promociones');
const rubrosRoutes = require('./routes/rubros');
const proveedorRoutes = require('./routes/proveedores');
const ordenCompraRoutes = require('./routes/ordenCompra'); // Integración de órdenes de compra

// Middlewares primero
app.use(cors());
app.use(express.json());

// Luego las rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/perdidas', perdidaRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/rubros', rubrosRoutes);
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/ordenes-compra', require('./routes/ordenCompra'));

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});