describe('Pruebas E2E – Módulo Productos', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/productos', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de productos', () => {
        cy.contains('LISTADO DE PRODUCTOS').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra productos por nombre', () => {
        cy.get('input[placeholder="🔍 Buscar por nombre"]').type('jugo');
        cy.get('tbody tr').each(($row) => {
            cy.wrap($row).contains(/jugo/i);
        });
    });

    it('Crea y luego elimina un producto correctamente', () => {
        const timestamp = Date.now();
        const nombre = `TestProd${timestamp}`;
        const descripcion = `Producto de prueba Cypress ${timestamp}`;
        const codigo_barra = Math.floor(100000000000 + Math.random() * 899999999999); // 12 dígitos

        // Crear producto
        cy.get('button').contains('NUEVO PRODUCTO').click();
        cy.url().should('include', '/productos/crear');

        cy.get('input[name="nombre"]').type(nombre);
        cy.get('select[name="id_rubro"]').select(1);
        cy.get('textarea[name="descripcion"]').type(descripcion);
        cy.get('input[name="precio_costo"]').type('100');
        cy.get('input[name="precio_venta"]').type('150');
        cy.get('input[name="stock_minimo"]').type('10');
        cy.get('select[name="id_proveedor"]').select(1);
        cy.get('input[name="codigo_barra"]').type(codigo_barra.toString());

        cy.get('button').contains('GUARDAR').click();
        cy.contains('Producto creado exitosamente').should('exist');
        cy.wait(1000);
        cy.visit('/productos');

        // Buscar por nombre para validar
        cy.get('input[placeholder="🔍 Buscar por nombre"]').clear().type(nombre);
        cy.get('tbody').contains(nombre).should('exist');

        // Eliminar producto recién creado
        cy.get('input[placeholder="🔍 Buscar por nombre"]').clear().type(nombre);
        cy.contains(nombre).parent('tr').within(() => {
            cy.get('button.text-danger').click();
        });

        cy.get('.modal-content').contains('Eliminar').click();
        cy.contains('Producto eliminado con éxito', { timeout: 5000 }).should('exist');
        cy.contains(nombre).should('not.exist');
    });

    it('Navega a pantalla de edición de un producto', () => {
        cy.get('button.text-warning').first().click();
        cy.url().should('include', '/productos/editar');
    });

    it('Accede al listado de productos eliminados', () => {
        cy.visit('/productos/eliminados');
        cy.contains('PRODUCTOS ELIMINADOS').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').its('length').should('be.gte', 0);
    });
});