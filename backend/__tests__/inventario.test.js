
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
  await db.query(`DELETE FROM usuario WHERE id = 9999`);
  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com',
    '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
  `);
});

afterAll(async () => {
  await db.query(`DELETE FROM usuario WHERE id = 9999`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Inventario', () => {
  test('GET /api/inventario/stock-producto devuelve el stock general', async () => {
    const res = await request(app)
      .get('/api/inventario/stock-producto')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.stock_producto)).toBe(true);
  });

  test('GET /api/inventario/totales/ventas devuelve total de ventas', async () => {
    const res = await request(app)
      .get('/api/inventario/totales/ventas')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total_ventas');
  });

  test('GET /api/inventario/tasa-rotacion devuelve datos de rotación', async () => {
    const res = await request(app)
      .get('/api/inventario/tasa-rotacion')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasa_rotacion)).toBe(true);
  });

  test('GET /api/inventario/productos-mayor-ingreso devuelve lista', async () => {
    const res = await request(app)
      .get('/api/inventario/productos-mayor-ingreso')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.productos_mayor_ingreso)).toBe(true);
  });

  test('GET /api/inventario/movimientos-por-mes devuelve estadísticas mensuales', async () => {
    const res = await request(app)
      .get('/api/inventario/movimientos-por-mes')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.movimientos_por_mes)).toBe(true);
  });

  test('GET /api/inventario/productos-menos-vendidos devuelve lista', async () => {
    const res = await request(app)
      .get('/api/inventario/productos-menos-vendidos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.productos_menos_vendidos)).toBe(true);
  });

  test('GET /api/inventario/stock-bajos devuelve productos con stock crítico', async () => {
    const res = await request(app)
      .get('/api/inventario/stock-bajos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.stock_bajos)).toBe(true);
  });
});
