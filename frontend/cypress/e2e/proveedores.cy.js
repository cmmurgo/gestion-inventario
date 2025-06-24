describe('Pruebas E2E – Módulo Proveedores', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/proveedores', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de proveedores', () => {
        cy.contains('LISTADO DE PROVEEDORES').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra proveedores por nombre', () => {
        cy.get('input[placeholder="🔍 Buscar por nombre"]').type('mendoza');
        cy.get('tbody tr').should('have.length.at.least', 1);
        cy.get('tbody').invoke('text').should('match', /mendoza/i);
    });

    it('Navega a la pantalla de edición de un proveedor activo', () => {
        cy.get('button.text-warning:enabled').first().click();
        cy.url().should('include', '/proveedores/editar');
        cy.contains('EDITAR PROVEEDOR').should('exist');
    });

    it('Navega a la pantalla de detalle de un proveedor', () => {
        cy.get('button.text-primary:enabled').first().click();
        cy.url().should('include', '/proveedores/ver');
        cy.contains(/detalle.*proveedor/i).should('exist');
    });
});