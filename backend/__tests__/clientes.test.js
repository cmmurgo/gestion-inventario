const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

let testClienteId;

beforeAll(async () => {
  // Insertar usuario admin QA (si no existe)
  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com', '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
    ON CONFLICT (id) DO NOTHING;
  `);
});

afterAll(async () => {
  await db.query(`DELETE FROM cliente WHERE email LIKE 'testcliente%@qa.com'`);
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Clientes', () => {
  test('POST /api/clientes crea un cliente nuevo', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Test',
        apellido: 'Cliente',
        email: 'testcliente1@qa.com',
        cuit_cuil: '20123456789',
        direccion: 'Calle Falsa 123',
        telefono: '1122334455'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Cliente creado correctamente');
  });

  test('GET /api/clientes devuelve lista de clientes', async () => {
    const res = await request(app)
      .get('/api/clientes')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/clientes/:id devuelve el cliente creado', async () => {
    const result = await db.query(`SELECT id FROM cliente WHERE email = 'testcliente1@qa.com'`);
    testClienteId = result.rows[0].id;

    const res = await request(app)
      .get(`/api/clientes/${testClienteId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('testcliente1@qa.com');
  });

  test('PUT /api/clientes/:id actualiza cliente', async () => {
    const res = await request(app)
      .put(`/api/clientes/${testClienteId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Cliente Modificado',
        apellido: 'Test',
        email: 'testcliente1@qa.com',
        cuit_cuil: '20123456789',
        direccion: 'Av. Siempre Viva 742',
        telefono: '1199887766'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cliente actualizado correctamente');
  });

  test('DELETE /api/clientes/:id da de baja al cliente', async () => {
    const res = await request(app)
      .delete(`/api/clientes/${testClienteId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cliente dado de baja correctamente');
  });
});
