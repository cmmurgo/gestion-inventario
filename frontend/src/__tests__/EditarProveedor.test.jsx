import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EditarProveedor from '../pages/Proveedores/EditarProveedor';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/authService', () => ({
  getToken: () => 'fake-token',
}));

jest.mock('../services/proveedorService', () => ({
  getProveedorById: jest.fn().mockResolvedValue({
    data: {
      nombre: 'Proveedor Editado',
      email: 'editado@ejemplo.com',
      telefono: '123456789',
      contacto: 'Ana López',
      direccion: 'Av. Siempreviva 742',
      cuit: '20-98765432-1',
      id_rubro: 2,
    }
  }),
}));

jest.mock('../services/rubroService', () => ({
  getRubros: jest.fn().mockResolvedValue({
    data: [
      { id: 1, nombre: 'Rubro A' },
      { id: 2, nombre: 'Rubro B' }
    ]
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

beforeAll(() => {
  localStorage.setItem('userRole', 'admin');
});

test('Renderiza formulario Edición', async () => {
  render(
    <MemoryRouter initialEntries={['/proveedores/editar/1']}>
      <EditarProveedor />
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.getByDisplayValue(/Proveedor Editado/i)).toBeInTheDocument()
  );

  expect(screen.getByDisplayValue(/editado@ejemplo.com/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/CUIT/i).value).toMatch(/20-98765432-1/);
});
