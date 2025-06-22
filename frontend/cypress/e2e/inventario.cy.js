describe('Pruebas E2E – Módulo Inventario', () => {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/auth/login', {
            email: 'cmmurgo@gmail.com',
            password: '12345678',
        }).then((res) => {
            const token = res.body.token;

            cy.visit('/inventario', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('token', token);
                    win.localStorage.setItem('userRole', res.body.user.role);
                    win.localStorage.setItem('userId', res.body.user.id.toString());
                },
            });
        });
    });

    it('Accede al menú de inventario', () => {
        cy.contains('Menú de Análisis').should('be.visible');
        cy.get('button').should('have.length.at.least', 4); 
    });

    it('Visualiza el reporte de stock de productos', () => {
        cy.contains('Ver reporte de stock de productos').click();
        cy.url().should('include', '/stock-producto');
        cy.contains('📦 Reporte de Stock de Productos').should('exist');
        cy.get('table').should('exist');
    });

    it('Visualiza productos con stock bajo', () => {
        cy.contains('Detectar Stock Bajo').click();
        cy.url().should('include', '/stock-bajo');
        cy.contains('🛑 Productos con stock bajo').should('exist');
        cy.get('table').should('exist');
    });

    it('Visualiza el reporte de rotación de productos', () => {
        cy.contains('Medir Rotación de Producto').click();
        cy.url().should('include', '/tasa-rotacion');
        cy.contains('📊 Reporte de Rotación de Productos').should('exist');
        cy.get('table').should('exist');
    });

    it('Visualiza productos con mayores ingresos', () => {
        cy.contains('Productos que generan mayores ingresos').click();
        cy.url().should('include', '/productos-mayor-ingreso');
        cy.contains('💰 Productos que Generan Mayores Ingresos').should('exist');
        cy.get('table').should('exist');
    });

    it('Visualiza productos menos vendidos', () => {
        cy.contains('Productos menos vendidos que requieren estrategias promocionales').click();
        cy.url().should('include', '/productos-menos-vendidos');
        cy.contains('📉 Productos Menos Vendidos').should('exist');
        cy.get('table').should('exist');
    });
});