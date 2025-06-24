import React from 'react';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import IndexRubros from '../pages/Rubros/index';
import VerProductosRubro from '../pages/Rubros/VerProductosRubro';
import * as rubroService from '../services/rubroService';
import * as productoService from '../services/productService';

jest.mock('../services/rubroService');
jest.mock('../services/productService');
jest.mock('../api', () => ({
  API_URL: 'http://localhost'
}));

jest.mock('../services/rubroService', () => ({
  getRubros: jest.fn().mockResolvedValue({
    data: [
      { id: 1, nombre: 'Bebidas', tiene_productos: true },
      { id: 2, nombre: 'Limpieza', tiene_productos: false }
    ]
  }),
  getRubroById: jest.fn().mockResolvedValue({
    data: { nombre: 'Bebidas' }
  }),
  getProductosByRubro: jest.fn().mockResolvedValue({
    data: []
  }),
}));

const mockRubros = [
  { id: 1, nombre: 'Bebidas', cantidad_productos: 3, tiene_productos: true },
  { id: 2, nombre: 'Limpieza', cantidad_productos: 0, tiene_productos: false }
];

const mockProductos = [
  { id: 1, nombre: 'Coca-Cola', precio_venta: 100, stock_minimo: 10 },
  { id: 2, nombre: 'Pepsi', precio_venta: 95, stock_minimo: 15 }
];

describe('Rubros', () => {
  beforeEach(() => {
    rubroService.getRubros.mockResolvedValue({ data: mockRubros });
    productoService.getProductosByRubro.mockResolvedValue({ data: mockProductos });
  });

  test('renderiza listado de rubros en Index', async () => {
    render(
      <MemoryRouter>
        <IndexRubros />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/bebidas/i)).toBeInTheDocument();
      expect(screen.getByText(/limpieza/i)).toBeInTheDocument();
    });
  });

  test('botón "Ver productos" redirige y muestra productos del rubro', async () => {
    render(
      <MemoryRouter initialEntries={['/rubros/1/productos']}>
        <Routes>
          <Route path="/rubros/:id/productos" element={<VerProductosRubro />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/coca-cola/i)).toBeInTheDocument();
      expect(screen.getByText(/pepsi/i)).toBeInTheDocument();
    });
  });

  test('muestra mensaje si no hay productos en VerProductosRubro', async () => {
    productoService.getProductosByRubro.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter initialEntries={['/rubros/99/productos']}>
        <Routes>
          <Route path="/rubros/:id/productos" element={<VerProductosRubro />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.includes('no tiene productos')
      )).toBeInTheDocument();
    });
  });

  test('mostrar mensaje al intentar eliminar rubro con productos', async () => {
    render(
      <MemoryRouter>
        <IndexRubros />
      </MemoryRouter>
    );
    await waitFor(() => {
      const eliminarSpan = screen.getByTitle(/no se puede eliminar/i);
      const eliminarBtn = within(eliminarSpan).getByRole('button');
      expect(eliminarBtn).toBeDisabled();
    });
  });
});