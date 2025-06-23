describe('Pruebas E2E – Módulo Ventas', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/ventas', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de ventas', () => {
        cy.contains('LISTADO DE VENTAS').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra ventas por cliente', () => {
        cy.get('input[placeholder="🔍 Buscar por cliente"]').type('gonzalez');
        cy.get('tbody td').invoke('text').should('match', /gonzalez/i);
    });

    it('Navega a la pantalla de creación de venta', () => {
        cy.get('button').contains('NUEVA VENTA').click();
        cy.url().should('include', '/ventas/crear');
        cy.contains('REGISTRAR VENTA').should('exist'); 
    });
});
