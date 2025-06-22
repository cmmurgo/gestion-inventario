// src/__tests__/Proveedores.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CrearProveedor from '../pages/Proveedores/CrearProveedor';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, waitFor } from '@testing-library/react';
import { getRubros } from '../services/rubroService';

jest.mock('../services/proveedorService', () => ({
  crearProveedor: jest.fn(),
}));

jest.mock('../services/rubroService', () => ({
  getRubros: jest.fn().mockResolvedValue({
    data: [
      { id: 1, nombre: 'Rubro A' },
      { id: 2, nombre: 'Rubro B' }
    ]
  }),
}));

jest.mock('../services/authService', () => ({
  getToken: () => 'fake-token',
}));

// Mock del rol para evitar redirección
beforeAll(() => {
  localStorage.setItem('userRole', 'admin');
});

describe('Proveedores - CrearProveedor', () => {
  test('Renderiza formulario Crear Proveedor', async () => {
    render(
      <MemoryRouter initialEntries={['/proveedores/crear']}>
        <CrearProveedor />
      </MemoryRouter>
    );
    expect(await screen.findByText(/CREAR NUEVO PROVEEDOR/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cuit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

});