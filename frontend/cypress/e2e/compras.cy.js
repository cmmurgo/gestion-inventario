describe('Pruebas E2E – Módulo Compras (Órdenes de Compra)', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/compras', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de órdenes de compra', () => {
        cy.contains('LISTADO DE ÓRDENES DE COMPRA').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra órdenes por proveedor', () => {
        cy.get('input[placeholder="🔍 Buscar por proveedor"]').type('mendoza');
        cy.get('tbody tr').should('have.length.at.least', 1);
        cy.get('tbody').invoke('text').should('match', /mendoza/i);
    });

    it('Navega a la pantalla de creación de orden de compra', () => {
        cy.get('button').contains('NUEVA ORDEN DE COMPRA').click();
        cy.url().should('include', '/compras/crear');
    });

    it('Navega a la pantalla de edición de una orden activa', () => {
        cy.get('button')
            .filter('.text-warning:enabled')
            .first()
            .click();

        cy.url().should('include', '/compras/editar');
    });
});