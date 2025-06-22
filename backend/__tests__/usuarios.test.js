const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generar token válido (admin)
const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

let testUserId;

beforeAll(async () => {
  const hashed = await bcrypt.hash('clave123', 10);
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com', $1, 'admin')
    ON CONFLICT (id) DO NOTHING;
  `, [hashed]);
});

afterAll(async () => {
  await db.query(`DELETE FROM usuario WHERE email LIKE 'testuser%@qa.com'`);
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Usuarios', () => {
  test('GET /api/usuarios devuelve lista de usuarios', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('nombre');
  });

  test('POST /api/usuarios crea un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Test User',
        email: 'testuser1@qa.com',
        password: 'clave123',
        rol: 'vendedor'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuario creado correctamente');
  });

  test('GET /api/usuarios/:id devuelve el usuario creado', async () => {
    const consulta = await db.query(`SELECT id FROM usuario WHERE email = 'testuser1@qa.com'`);
    testUserId = consulta.rows[0].id;

    const res = await request(app)
      .get(`/api/usuarios/${testUserId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('testuser1@qa.com');
  });

  test('PUT /api/usuarios/:id actualiza usuario', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${testUserId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Test User Modificado',
        email: 'testuser1@qa.com',
        password: 'clave123',
        rol: 'vendedor'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Usuario actualizado correctamente');
  });

  test('DELETE /api/usuarios/:id da de baja al usuario', async () => {
    const res = await request(app)
      .delete(`/api/usuarios/${testUserId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Usuario dado de baja correctamente');
  });
});
