// src/__tests__/OrdenCompra.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearOrdenCompra from '../pages/OrdenCompra/CrearOrdenCompra';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

// Mock ComboboxProveedores como componente simple
jest.mock('../pages/OrdenCompra/ComboboxProveedores', () => () => (
  <select data-testid="combobox-proveedores"><option>Proveedor A</option></select>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('Compras - CrearOrdenCompra', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] }); // productos vacíos
  });

  test('renderiza formulario de creación', async () => {
    render(<MemoryRouter><CrearOrdenCompra /></MemoryRouter>);
    expect(await screen.findByText(/DETALLES DE PRODUCTOS/i)).toBeInTheDocument();
    expect(screen.getByTestId('combobox-proveedores')).toBeInTheDocument();
  });

  test('muestra error si no hay productos cargados', async () => {
    render(<MemoryRouter><CrearOrdenCompra /></MemoryRouter>);
    fireEvent.click(screen.getByText(/GUARDAR/i));
    await waitFor(() => {
      const alertas = screen.getAllByRole('alert');
      expect(alertas.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/todos los campos son obligatorios/i)).toBeInTheDocument();
    });
  });
});

/*
describe('Compras - EditarOrdenCompra', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/ordenes-compra/1')) {
        return Promise.resolve({
          data: {
            id: 1,
            fecha: '2025-06-22',
            proveedor_id: 1,
            productos: [{ id: 1, nombre: 'Producto A', cantidad: 2, precio_unitario: 100 }]
          }
        });
      }
      if (url.includes('/proveedores/1/productos')) {
        return Promise.resolve({
          data: [{ id: 1, nombre: 'Producto A' }]
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  test('renderiza datos para editar', async () => {
    render(<MemoryRouter><EditarOrdenCompra /></MemoryRouter>);
    expect(await screen.findByText(/DETALLES DE PRODUCTOS/i)).toBeInTheDocument();
    expect(screen.getByText(/Proveedor A/i)).toBeInTheDocument();
  });
});

describe('Compras - VerOrdenCompra', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        proveedor: 'Proveedor A',
        fecha: '2025-06-22',
        productos: [{ nombre: 'Producto A', cantidad: 2, precio_unitario: 100 }]
      }
    });
  });

  test('muestra detalle de orden de compra', async () => {
    render(<MemoryRouter><VerOrdenCompra /></MemoryRouter>);
    expect(await screen.findByText(/DETALLE DE ORDEN DE COMPRA/i)).toBeInTheDocument();
    expect(screen.getByText(/Proveedor A/i)).toBeInTheDocument();
    expect(screen.getByText(/Producto A/i)).toBeInTheDocument();
  });
});
*/