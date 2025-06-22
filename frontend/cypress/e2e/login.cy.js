describe('Pruebas de Login - Sistema de Inventario', () => {
  beforeEach(() => {
    cy.visit('/'); // Página principal = Login
  });

  it('Login exitoso con credenciales válidas', () => {
    cy.get('input[placeholder="usuario"]').type('cmmurgo@gmail.com'); 
    cy.get('input[placeholder="contraseña"]').type('12345678'); 
    cy.get('button').contains('Ingresar').click();

    cy.url().should('include', '/home');
    cy.contains(/inicio/i);
  });

  it('Login con usuario incorrecto', () => {
    cy.get('input[placeholder="usuario"]').type('usuarioinvalido@gmail.com');
    cy.get('input[placeholder="contraseña"]').type('admin123');
    cy.get('button').contains('Ingresar').click();

    cy.url().should('include', '/'); // Sigue en login
    cy.contains('Usuario o contraseña incorrectos').should('be.visible');
  });

  it('Login con contraseña incorrecta', () => {
    cy.get('input[placeholder="usuario"]').type('admin@gmail.com');
    cy.get('input[placeholder="contraseña"]').type('clave-erronea');
    cy.get('button').contains('Ingresar').click();

    cy.url().should('include', '/');
    cy.contains('Usuario o contraseña incorrectos').should('be.visible');
  });

  it('Validación con campos vacíos', () => {
    cy.get('button').contains('Ingresar').click();

    cy.url().should('include', '/');
  });
});
