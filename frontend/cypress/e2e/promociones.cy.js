describe('Pruebas E2E – Módulo Promociones', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/promociones', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de promociones', () => {
        cy.contains('LISTADO DE PROMOCIONES').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra promociones por nombre', () => {
        cy.get('input[placeholder="🔍 Buscar por nombre"]').type('x1');
        cy.get('tbody tr').each(($row) => {
            cy.wrap($row).contains(/x1/i);
        });
    });

    it('Crea y luego elimina una promoción correctamente', () => {
        const timestamp = Date.now();
        const nombre = `PromoTest${timestamp}`;
        const hoy = new Date();
        const inicio = hoy.toISOString().split('T')[0];
        const fin = new Date(hoy.setDate(hoy.getDate() + 7)).toISOString().split('T')[0];

        // Crear promoción
        cy.get('button').contains('NUEVA PROMOCIÓN').click();
        cy.url().should('include', '/promociones/crear');

        cy.get('input[name="nombre"]').type(nombre);
        cy.get('textarea[name="condiciones"]').type('Condiciones de prueba');
        cy.get('input[name="porcentaje"]').type('15');
        cy.get('input[name="fecha_inicio"]').type(inicio);
        cy.get('input[name="fecha_fin"]').type(fin);

        cy.get('button').contains('GUARDAR').click();
        cy.contains('Promoción creada exitosamente').should('exist');
        cy.wait(1000);
        cy.visit('/promociones');

        // Buscar promoción por nombre
        cy.get('input[placeholder="🔍 Buscar por nombre"]').clear().type(nombre);
        cy.get('tbody').contains(nombre).should('exist');

        // Eliminar promoción
        cy.contains(nombre).parent('tr').within(() => {
            cy.get('button.text-danger').click();
        });
        cy.get('.modal-content').contains('Eliminar').click();
        cy.contains('Promoción eliminada con éxito', { timeout: 5000 }).should('exist');
        cy.contains(nombre).should('not.exist');
    });

    it('Navega a pantalla de edición de promoción', () => {
        cy.get('button.text-warning').first().click();
        cy.url().should('include', '/promociones/editar');
    });

    it('Accede al detalle de productos incluidos en una promoción', () => {
        cy.get('button').contains('Ver productos').first().click();
        cy.url().should('include', '/promociones/ver');
        cy.contains('PRODUCTOS CON LA PROMOCIÓN:').should('exist');
    });
});
