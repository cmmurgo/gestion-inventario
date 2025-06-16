const request = require('supertest');
const app = require('../server');

const usuarioTest = {
    email: 'cmmurgo@gmail.com',
    password: '12345678'
};

describe('Pruebas funcionales - Autenticación', () => {
    test('Login falla con usuario inexistente', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'noexiste@algo.com',
            password: 'cualquier'
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Usuario no encontrado');
    });

    test('Login falla con contraseña incorrecta', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: usuarioTest.email,
            password: 'incorrecta'
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Contraseña incorrecta');
    });

    test('Login exitoso devuelve token y datos del usuario', async () => {
        const res = await request(app).post('/api/auth/login').send(usuarioTest);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('name');
        expect(res.body.user).toHaveProperty('role');
    });


});
