describe('Pruebas E2E – Módulo Rubros', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/rubros', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Filtra rubros por nombre', () => {
        cy.get('input[placeholder="🔍 Filtrar por nombre"]').type('bebidas');
        cy.contains(/bebidas/i).should('exist');
    });

    it('Accede al listado de rubros', () => {
        cy.contains('GESTIÓN DE RUBROS').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Accede a la vista de productos del rubro', () => {
        cy.get('button').contains('Ver productos').first().click();
        cy.url().should('include', '/rubros/');
        cy.contains('Productos del Rubro:').should('exist');
    });
});
