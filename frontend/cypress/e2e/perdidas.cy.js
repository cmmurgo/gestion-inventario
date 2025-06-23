describe('Pruebas E2E – Módulo Pérdidas', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/perdidas', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de pérdidas', () => {
        cy.contains('LISTADO DE PÉRDIDAS').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra pérdidas por descripción', () => {
        cy.get('input[placeholder="🔍 Buscar por descripción"]').clear().type('botella');
        cy.get('tbody tr').should('have.length.at.least', 1);
        cy.get('tbody td').invoke('text').should('match', /botella/i);
    });


    it('Crea y elimina una pérdida correctamente', () => {
        cy.get('button').contains('NUEVA PÉRDIDA').click();
        cy.url().should('include', '/perdidas/crear');

        const motivo = `Test pérdida ${Date.now()}`;
        const fecha = new Date().toISOString().split('T')[0];

        cy.get('select').select(1); // Asume que existe el producto con ID 1
        cy.get('input[type="number"]').type('1');
        cy.get('input[type="date"]').type(fecha);
        cy.get('textarea').type(motivo);

        cy.get('button').contains('GUARDAR').click();
        cy.contains('Pérdida registrada con éxito', { timeout: 5000 }).should('exist');

        cy.visit('/perdidas');

        cy.contains('td', motivo, { timeout: 5000 }).should('exist').parent('tr').within(() => {
            cy.get('button.text-danger').click({ force: true });
        });

        cy.get('.modal-content').contains('OK').click();

        cy.contains('Pérdida eliminada con éxito', { timeout: 5000 }).should('exist');
        cy.contains(motivo).should('not.exist');
    });
});