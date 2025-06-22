const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

beforeAll(async () => {
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com', 
    '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 
    'admin')
  `);
});

afterAll(async () => {
  await db.query(`DELETE FROM rubro WHERE nombre = 'Rubro QA'`);
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Rubros', () => {
  let testRubroId;

  test('POST /api/rubros crea rubro nuevo', async () => {
    const res = await request(app)
      .post('/api/rubros')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Rubro QA' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Rubro creado correctamente');
  });

  test('GET /api/rubros devuelve lista', async () => {
    const res = await request(app)
      .get('/api/rubros')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE da de baja rubro', async () => {
    const result = await db.query(`SELECT id FROM rubro WHERE nombre = 'Rubro QA'`);
    testRubroId = result.rows[0].id;

    const res = await request(app)
      .delete(`/api/rubros/${testRubroId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Rubro eliminado con éxito');
  });
});
