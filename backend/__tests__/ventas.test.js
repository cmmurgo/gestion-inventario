const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

let testVentaId;

beforeAll(async () => {
  // Limpiar primero las ventas y movimientos por seguridad
  await db.query(`DELETE FROM movimientos WHERE id_operacion IN (SELECT id FROM venta WHERE id_cliente = 5555)`);
  await db.query(`DELETE FROM detalle_venta WHERE id_venta IN (SELECT id FROM venta WHERE id_cliente = 5555)`);
  await db.query(`DELETE FROM venta WHERE id_cliente = 5555`);

  await db.query(`DELETE FROM producto WHERE id = 7777`);
  await db.query(`
    INSERT INTO producto (id, nombre, id_rubro, precio_costo, precio_venta, stock_minimo, id_proveedor)
    VALUES (7777, 'Producto QA Venta', 1, 80, 120, 5, 1)
    ON CONFLICT (id) DO NOTHING
  `);

  await db.query(`
    INSERT INTO cliente (id, nombre, apellido, email, cuit_cuil, direccion, telefono)
    VALUES (5555, 'Cliente QA', 'Test', 'clienteqa@test.com', '20111222333', 'Fake 123', '1122334455')
    ON CONFLICT (id) DO UPDATE SET nombre = 'Cliente QA'
  `);

  await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com',
    '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
    ON CONFLICT (id) DO NOTHING
  `);
});

afterAll(async () => {
  if (testVentaId) {
    await db.query(`DELETE FROM movimientos WHERE id_operacion = $1`, [testVentaId]);
    await db.query(`DELETE FROM detalle_venta WHERE id_venta = $1`, [testVentaId]);
    await db.query(`DELETE FROM venta WHERE id = $1`, [testVentaId]);
  }

  await db.query(`DELETE FROM producto WHERE id = 7777`);
  // No eliminar cliente ni usuario si hay riesgo de FK
  // await db.query(`DELETE FROM cliente WHERE id = 5555`);
  // await db.query(`DELETE FROM usuario WHERE id = 9999`);
  // await db.end(); // solo si este es el único archivo que ejecutás
});

describe('Pruebas funcionales – Módulo de Ventas', () => {
  test('GET /api/ventas devuelve listado de ventas', async () => {
    const res = await request(app)
      .get('/api/ventas')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/ventas registra una nueva venta', async () => {
    const venta = {
      fecha: new Date().toISOString().slice(0, 10),
      id_cliente: 5555,
      detalles: [
        { id_producto: 7777, cantidad: 1 }
      ]
    };

    const res = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(venta);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Venta creada correctamente');
    expect(res.body.id).toBeDefined();

    testVentaId = res.body.id;
  });

  test('GET /api/ventas/:id obtiene una venta específica', async () => {
    const res = await request(app)
      .get(`/api/ventas/${testVentaId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testVentaId);
    expect(Array.isArray(res.body.detalles)).toBe(true);
  });

  test('PUT /api/ventas/:id actualiza una venta', async () => {
    const res = await request(app)
      .put(`/api/ventas/${testVentaId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        fecha: new Date().toISOString().slice(0, 10),
        id_cliente: 5555,
        detalles: [{ id_producto: 7777, cantidad: 2 }]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Venta y movimientos actualizados correctamente');
  });

  test('DELETE /api/ventas/:id elimina una venta', async () => {
    const res = await request(app)
      .delete(`/api/ventas/${testVentaId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Venta y movimiento eliminados correctamente');
  });
});