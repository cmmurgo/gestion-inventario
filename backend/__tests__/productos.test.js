const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

let testProductoId;

beforeAll(async () => {
  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com', '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
    ON CONFLICT (id) DO NOTHING;
  `);
});

afterAll(async () => {
  await db.query(`DELETE FROM producto WHERE nombre LIKE 'Producto QA%'`);
  await db.query(`DELETE FROM usuario WHERE email = 'adminqa@qa.com'`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Productos', () => {
  test('POST /api/productos crea producto', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Producto QA',
        precio: 100,
        stock: 10,
        id_rubro: 1,
        id_proveedor: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Producto creado correctamente');
  });

  test('GET /api/productos devuelve lista', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT actualiza producto', async () => {
    const result = await db.query(`SELECT id FROM producto WHERE nombre = 'Producto QA'`);
    testProductoId = result.rows[0].id;

    const res = await request(app)
      .put(`/api/productos/${testProductoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nombre: 'Producto QA Modificado',
        precio: 150,
        stock: 20,
        id_rubro: 1,
        id_proveedor: 1
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Producto actualizado correctamente');
  });

  test('DELETE da de baja producto', async () => {
    const res = await request(app)
      .delete(`/api/productos/${testProductoId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Producto dado de baja correctamente');
  });
});
