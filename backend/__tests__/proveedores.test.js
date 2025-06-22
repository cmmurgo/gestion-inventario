const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const tokenAdmin = jwt.sign(
    { id: 9999, nombre: 'Admin QA', email: 'adminqa@qa.com', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
);

let testProveedorId;

beforeAll(async () => {
    await db.query(`DELETE FROM usuario WHERE id = 9999`);
    await db.query(`
    INSERT INTO usuario (id, nombre, email, clave, rol)
    VALUES (9999, 'Admin QA', 'adminqa@qa.com',
    '$2b$10$abcdabcdabcdabcdabcdababcdefabcdefabcdefabcdefabcdef', 'admin')
  `);

    await db.query(`DELETE FROM proveedor WHERE email = 'proveedor@qa.com'`);
});

afterAll(async () => {
    await db.query(`DELETE FROM proveedor WHERE id = $1`, [testProveedorId]);
    await db.query(`DELETE FROM usuario WHERE id = 9999`);
    await db.end();
});

describe('Pruebas funcionales – Módulo de Proveedores', () => {
    test('POST /api/proveedores crea proveedor', async () => {
        const res = await request(app)
            .post('/api/proveedores')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nombre: 'Proveedor QA',
                cuit: '20333444556',
                direccion: 'Calle Falsa 123',
                telefono: '1122334455',
                email: 'proveedor@qa.com',
                contacto: 'Persona QA',
                id_rubro: 1
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Proveedor creado correctamente');

        // Consulta el ID directamente de la base
        const result = await db.query(`SELECT id FROM proveedor WHERE email = 'proveedor@qa.com'`);
        testProveedorId = result.rows[0].id;
    });

    test('GET /api/proveedores/:id obtiene proveedor específico', async () => {
        const res = await request(app)
            .get(`/api/proveedores/${testProveedorId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('proveedor@qa.com');
    });

    test('Debe devolver la lista de proveedores', async () => {
        const res = await request(app)
            .get('/api/proveedores')
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('nombre');
            expect(res.body[0]).toHaveProperty('email');
        }
    });

    test('PUT /api/proveedores/:id actualiza proveedor', async () => {
        const res = await request(app)
            .put(`/api/proveedores/${testProveedorId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nombre: 'Proveedor QA',
                cuit: '20333444556',
                direccion: 'Calle Falsa 123',
                telefono: '1122334455',
                email: 'proveedor@qa.com',
                contacto: 'Persona QA',
                id_rubro: 1
            })

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Proveedor actualizado correctamente');
    });

    test('DELETE /api/proveedores/:id da de baja proveedor', async () => {
        const res = await request(app)
            .delete(`/api/proveedores/${testProveedorId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/Proveedor dado de baja/i);
    });
});