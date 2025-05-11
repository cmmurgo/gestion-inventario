// controllers/authController.js
const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');

// Función para el login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.fecha_baja) {
      return res.status(403).json({ message: 'Usuario dado de baja' });
    }

    const match = await authModel.comparePassword(password, user.clave);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, email: user.email, role: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login exitoso', token, user: { name: user.nombre, role: user.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

