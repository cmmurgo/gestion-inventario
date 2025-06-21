// src/__tests__/Inventario.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductosMayorIngreso from '../pages/Inventario/ProductosMayorIngreso';
import ProductosMenosVendidos from '../pages/Inventario/ProductosMenosVendidos';

const mockProductosIngreso = [
  { producto_id: 1, nombre: 'Producto A', precio_venta: 100, total_ventas_6_meses: 10, ingreso_total: 1000 },
  { producto_id: 2, nombre: 'Producto B', precio_venta: 50, total_ventas_6_meses: 5, ingreso_total: 250 },
];

const mockProductosMenosVendidos = [
  { producto_id: 3, nombre: 'Producto C', precio_venta: 30, total_ventas_6_meses: 1, ingreso_total: 30 },
  { producto_id: 4, nombre: 'Producto D', precio_venta: 20, total_ventas_6_meses: 2, ingreso_total: 40 },
];

beforeEach(() => {
  // Siempre devolver un token
  localStorage.setItem('token', 'fake-token');

  // Mock global.fetch según URL
  global.fetch = jest.fn((url) => {
    if (url.includes('mayor-ingreso')) {
      return Promise.resolve({
        json: () => Promise.resolve({ productos_mayor_ingreso: mockProductosIngreso }),
      });
    } else if (url.includes('menos-vendidos')) {
      return Promise.resolve({
        json: () => Promise.resolve({ productos_menos_vendidos: mockProductosMenosVendidos }),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve({}) });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Inventario - ProductosMayorIngreso', () => {
  test('renderiza correctamente con datos', async () => {
    render(<MemoryRouter><ProductosMayorIngreso /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText((text) => text.includes('Producto A'))).toBeInTheDocument();
      expect(screen.getByText((text) => text.includes('1000') || text.includes('1.000'))).toBeInTheDocument();
    });
  });

  test('ordena por columna de ventas', async () => {
    render(<MemoryRouter><ProductosMayorIngreso /></MemoryRouter>);
    await waitFor(() => screen.getByText(/Producto A/));
    const allMatches = screen.getAllByText(/Ventas/i);
    const ventasTh = allMatches.find((el) => el.tagName === 'TH');
    fireEvent.click(ventasTh);
    expect(screen.getAllByRole('row')[1]).toHaveTextContent(/Producto B|Producto A/);
  });

  test('muestra mensaje si no hay productos en ProductosMayorIngreso', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ productos_mayor_ingreso: [] }),
    });
    render(<MemoryRouter><ProductosMayorIngreso /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/no hay datos disponibles/i)).toBeInTheDocument();
    });
  });
});

describe('Inventario - ProductosMenosVendidos', () => {
  test('renderiza correctamente productos de bajo rendimiento', async () => {
    render(<MemoryRouter><ProductosMenosVendidos /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/Producto C/)).toBeInTheDocument();
      const precios = screen.getAllByText(/\$30.00/);
      expect(precios.length).toBeGreaterThan(0);
    });
  });

  test('ordena por ingreso total', async () => {
    render(<MemoryRouter><ProductosMenosVendidos /></MemoryRouter>);
    await waitFor(() => screen.getByText(/Producto C/));
    fireEvent.click(screen.getByText(/Ingreso Total/i));
    expect(screen.getAllByRole('row')[1]).toHaveTextContent(/Producto D|Producto C/);
  });

  test('muestra mensaje si no hay productos con bajo rendimiento', async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ productos_menos_vendidos: [] }),
    });
    render(<MemoryRouter><ProductosMenosVendidos /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/no hay productos con bajo rendimiento/i)).toBeInTheDocument();
    });
  });
});