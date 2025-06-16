const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

let testPromoId;

beforeAll(async () => {
  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com', '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
    ON CONFLICT (id) DO NOTHING;
  `);
});

afterAll(async () => {
  await db.query(`DELETE FROM promocion WHERE nombre LIKE 'Promo QA%'`);
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Promociones', () => {
  test('POST /api/promociones crea una promoción', async () => {
    const res = await request(app)
      .post('/api/promociones')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Promo QA',
        descuento: 10,
        fecha_inicio: '2025-06-01',
        fecha_fin: '2025-06-30'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Promoción creada correctamente');
  });

  test('GET /api/promociones devuelve lista', async () => {
    const res = await request(app)
      .get('/api/promociones')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /api/promociones actualiza una promoción', async () => {
    const result = await db.query(`SELECT id FROM promocion WHERE nombre = 'Promo QA'`);
    testPromoId = result.rows[0].id;

    const res = await request(app)
      .put(`/api/promociones/${testPromoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Promo QA Actualizada',
        descuento: 15,
        fecha_inicio: '2025-06-05',
        fecha_fin: '2025-07-01'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Promoción actualizada correctamente');
  });

  test('DELETE da de baja la promoción', async () => {
    const res = await request(app)
      .delete(`/api/promociones/${testPromoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Promoción dada de baja correctamente');
  });
});
