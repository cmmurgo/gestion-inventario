const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
  { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
);

let testOrdenId;

beforeAll(async () => {
  await db.query(`DELETE FROM movimientos WHERE id_producto = 888`);
  await db.query(`DELETE FROM detalle_orden_compra WHERE id_producto = 888`);
  await db.query(`DELETE FROM detalle_orden_compra WHERE id_orden_compra = $1`, [testOrdenId]);
  await db.query(`DELETE FROM orden_compra WHERE id_proveedor = 777`);
  await db.query(`DELETE FROM producto WHERE id = 888`);
  await db.query(`DELETE FROM proveedor WHERE id = 777`);

  await db.query(`
    INSERT INTO proveedor (id, nombre, email, telefono, contacto, direccion, cuit, id_rubro)
    VALUES (777, 'Proveedor QA', 'proveedor@qa.com', '1122334455', 'Persona QA', 'Calle QA 123', '20333444556', 1)
  `);

  await db.query(`
    INSERT INTO producto (id, nombre, id_rubro, precio_costo, precio_venta, stock_minimo, id_proveedor)
    VALUES (888, 'Producto QA', 1, 50, 80, 5, 777)
  `);
});

afterAll(async () => {
  await db.query(`DELETE FROM movimientos WHERE id_producto = 888`);
  await db.query(`DELETE FROM detalle_orden_compra WHERE id_producto = 888`);
  await db.query(`DELETE FROM detalle_orden_compra WHERE id_orden_compra = $1`, [testOrdenId]);
  await db.query(`DELETE FROM orden_compra WHERE id = $1`, [testOrdenId]);
  await db.query(`DELETE FROM producto WHERE id = 888`);
  await db.query(`DELETE FROM proveedor WHERE id = 777`);
  await db.end();
});

describe('Pruebas funcionales – Módulo Orden de Compra', () => {
  test('POST /api/ordenes-compra crea una orden', async () => {
    const orden = {
      id_proveedor: 777,
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'pendiente',
      detalles: [
        {
          id_producto: 888,
          cantidad: 5
        }
      ]
    };

    const res = await request(app)
      .post('/api/ordenes-compra')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(orden);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Orden de compra creada correctamente');
    testOrdenId = res.body.id;
  });

  test('GET /api/ordenes-compra devuelve listado', async () => {
    const res = await request(app)
      .get('/api/ordenes-compra')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/ordenes-compra/:id obtiene una orden', async () => {
    const res = await request(app)
      .get(`/api/ordenes-compra/${testOrdenId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testOrdenId);
    expect(Array.isArray(res.body.detalles)).toBe(true);
  });

  test('PUT /api/ordenes-compra/:id actualiza una orden', async () => {
    const res = await request(app)
      .put(`/api/ordenes-compra/${testOrdenId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        id_proveedor: 777,
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'confirmada',
        detalles: [
          {
            id_producto: 888,
            cantidad: 10
          }
        ]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Orden de compra y movimientos actualizados correctamente/i);
  });

  test('DELETE /api/ordenes-compra/:id elimina una orden', async () => {
    const res = await request(app)
      .delete(`/api/ordenes-compra/${testOrdenId}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Orden de compra y movimientos eliminados correctamente/i);

  });
});
