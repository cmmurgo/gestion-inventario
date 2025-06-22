describe('Pruebas E2E – Módulo Usuarios', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/usuarios', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                }
            });
        });
    });

    it('Accede al listado de usuarios', () => {
        cy.contains('LISTADO DE USUARIOS').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra por nombre de usuario', () => {
        cy.get('input[placeholder="🔍 Buscar por nombre"]').type('marcelo');
        cy.get('tbody tr').each(($row) => {
            cy.wrap($row).contains(/marcelo/i);
        });
    });

    it('Crea y luego elimina un usuario correctamente', () => {
        const timestamp = Date.now();
        const nombre = `Test Cypress ${timestamp}`;
        const email = `cypress_${timestamp}@mail.com`;
        const clave = 'test1234';

        // Crear usuario
        cy.get('button').contains('NUEVO USUARIO').click();
        cy.url().should('include', '/usuarios/crear');

        cy.get('label').contains('NOMBRE DE USUARIO').parent().find('input').type(nombre);
        cy.get('label').contains('EMAIL').parent().find('input').type(email);
        cy.get('label').contains('CLAVE').parent().find('input').type(clave);
        cy.get('label').contains('ROL').parent().find('select').select('Administrador');

        cy.get('button').contains('GUARDAR').click();

        cy.contains('Usuario creado con éxito').should('exist');
        cy.wait(1000);
        cy.visit('/usuarios');
        cy.contains(nombre).should('exist');

        // Eliminar usuario recién creado
        cy.contains(nombre).parent('tr').within(() => {
            cy.get('button.text-danger').click();
        });

        cy.get('.modal-content').contains('OK').click();
        cy.contains('Usuario eliminado con éxito', { timeout: 5000 }).should('exist');
        cy.contains(nombre).should('not.exist');
    });

    it('Navega a pantalla de edición de usuario', () => {
        cy.get('button.text-warning').first().click();
        cy.url().should('include', '/usuarios/editar');
    });
});
