const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Crear token para usuario admin de pruebas
const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

beforeAll(async () => {
  // Limpiar e insertar datos necesarios
  await db.query(`DELETE FROM usuario WHERE id = 9999`);
  await db.query(`DELETE FROM producto WHERE id = 8889`);

  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com',
    '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
  `);

  await db.query(`
    INSERT INTO producto (id, nombre, id_rubro, precio_costo, precio_venta, stock_minimo, id_proveedor)
    VALUES (8889, 'Producto QA Perdida', 1, 80, 100, 10, 1)
  `);
});

afterAll(async () => {
  // Limpiar registros de prueba
  await db.query(`DELETE FROM movimientos WHERE id_producto = 8889`);
  await db.query(`DELETE FROM producto WHERE id = 8889`);
  await db.query(`DELETE FROM usuario WHERE id = 9999`);
  await db.end();
});

describe('Pruebas funcionales – Módulo de Pérdidas', () => {
  test('GET /api/perdidas devuelve listado de pérdidas', async () => {
    const res = await request(app)
      .get('/api/perdidas')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/movimientos registra una pérdida correctamente', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        id_producto: 8889,
        tipo: 'perdida',
        cantidad: 3,
        fecha: new Date().toISOString().slice(0, 10)
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Movimiento creado correctamente');
  });
});
