import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import IndexProveedores from '../pages/Proveedores/IndexProveedores';
import { MemoryRouter } from 'react-router-dom';
import { getProveedores } from '../services/proveedorService';

jest.mock('../services/proveedorService', () => ({
  getProveedores: jest.fn().mockResolvedValue({
    data: [
      { id: 1, nombre: 'Proveedor A', email: 'a@mail.com', telefono: '', cuit: '20-11111111-1', id_rubro: 1 },
      { id: 2, nombre: 'Proveedor B', email: 'b@mail.com', telefono: '', cuit: '20-22222222-2', id_rubro: 2 }
    ]
  }),
}));

jest.mock('../services/authService', () => ({
  getToken: () => 'fake-token',
}));

beforeAll(() => {
  localStorage.setItem('userRole', 'admin');
});

describe('Proveedores - IndexProveedores', () => {
  test('Listado de proveedores', async () => {
    render(
      <MemoryRouter initialEntries={['/proveedores']}>
        <IndexProveedores />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Proveedor A/i)).toBeInTheDocument();
    expect(screen.getByText(/Proveedor B/i)).toBeInTheDocument();
  });
});