const request = require('supertest');
const app = require('../server');

// Mock de nodemailer
jest.mock('nodemailer', () => {
  return {
    createTransport: () => ({
      sendMail: jest.fn().mockResolvedValue('Correo simulado enviado')
    })
  };
});

// Mock de updatePasswordByEmail
jest.mock('../models/usuarioModel', () => ({
  ...jest.requireActual('../models/usuarioModel'),
  updatePasswordByEmail: jest.fn().mockResolvedValue()
}));

// Importar el mock para hacer asserts
const usuarioModel = require('../models/usuarioModel');

describe('Pruebas funcionales - Recuperación de contraseña', () => {
  test('Falla si no se envía email', async () => {
    const res = await request(app).post('/api/auth/recuperar').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('El correo es obligatorio');
  });

  test('Falla si el email no existe en el sistema', async () => {
    const res = await request(app)
      .post('/api/auth/recuperar')
      .send({ email: 'noexiste@algo.com' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('No existe un usuario con ese correo');
  });

  test('Éxito al enviar recuperación con email válido (mocked)', async () => {
    const email = 'cmmurgo@gmail.com';

    const res = await request(app)
      .post('/api/auth/recuperar')
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Contraseña enviada a tu correo');

    // Validar que se haya llamado correctamente
    expect(usuarioModel.updatePasswordByEmail).toHaveBeenCalledWith(
      email,
      expect.any(String) // cualquier string hasheado
    );
  });
});
