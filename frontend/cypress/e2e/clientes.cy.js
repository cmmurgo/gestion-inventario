function generarCuitAleatorio() {
    const base = Math.floor(10000000 + Math.random() * 89999999);
    return `20-${base}-9`;
}

describe('Pruebas E2E – Módulo Clientes', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/clientes', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al listado de clientes', () => {
        cy.contains('LISTADO DE CLIENTES').should('be.visible');
        cy.get('table').should('exist');
        cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('Filtra clientes por apellido', () => {
        cy.get('input[placeholder="🔍 Buscar por apellido"]').type('gonzalez');
        cy.get('tbody tr').each(($row) => {
            cy.wrap($row).contains(/gonzalez/i);
        });
    });

    it('Navega a la pantalla de edición de un cliente', () => {
        // Asumimos que hay al menos un cliente en la tabla
        cy.get('[data-testid^="editar-"]').first().click();
        cy.url().should('include', '/clientes/editar');
    });

    it('Crea y luego elimina un cliente correctamente', () => {
        const timestamp = Date.now();
        const nombre = `TestNombre${timestamp}`;
        const apellido = `TestApellido${timestamp}`;
        const email = `cliente_${timestamp}@mail.com`;
        const cuit = generarCuitAleatorio();

        // Crear cliente
        cy.get('button').contains('NUEVO CLIENTE').click();
        cy.url().should('include', '/clientes/crear');

        cy.get('label').contains('NOMBRE').parent().find('input').type(nombre);
        cy.get('label').contains('APELLIDO').parent().find('input').type(apellido);
        cy.get('label').contains('EMAIL').parent().find('input').type(email);
        cy.get('label').contains('TELÉFONO').parent().find('input').type('1122334455');
        cy.get('label').contains('DIRECCIÓN').parent().find('input').type('Av. Siempreviva 123');
        cy.get('label').contains('CUIT/CUIL').parent().find('input').type(cuit);

        cy.get('button').contains('GUARDAR').click();
        cy.contains('Cliente creado con éxito').should('exist');
        cy.wait(1000);
        cy.visit('/clientes');
        cy.contains(apellido).should('exist');

        // Eliminar cliente recién creado
        cy.contains(apellido).parent('tr').within(() => {
            cy.get('button.text-danger').click();
        });

        cy.get('.modal-content').contains('OK').click();
        cy.contains('Cliente eliminado con éxito', { timeout: 5000 }).should('exist');
        cy.contains(apellido).should('not.exist');
    });
});
