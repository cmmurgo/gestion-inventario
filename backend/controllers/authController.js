// controllers/authController.js
const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
const User = require('../models/usuarioModel');
const nodemailer = require('nodemailer');

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

    res.json({ message: 'Login exitoso', token, user: { id: user.id, name: user.nombre, role: user.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

function generarPassword() {
  return crypto.randomBytes(4).toString('hex');
}

exports.recuperarContrasena = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'El correo es obligatorio' });

  try {
    const user = await User.findByEmail( email );
    if (!user) return res.status(404).json({ error: 'No existe un usuario con ese correo' });

    const nuevaPassword = generarPassword();
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await User.updatePasswordByEmail(email, hashedPassword);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,      // usar variables de entorno
        pass: process.env.EMAIL_PASSWORD,  // contraseña de aplicación
      },
    });

    const mailOptions = {
      from: 'Inventario <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Tu nueva contraseña temporal es: ${nuevaPassword}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Contraseña enviada a tu correo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};


