import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MenuInventario from '../pages/Inventario/MenuInventario';

describe('Inventario - MenuInventario', () => {
  test('renderiza el título y los botones de análisis', () => {
    render(
      <MemoryRouter>
        <MenuInventario />
      </MemoryRouter>
    );

    expect(screen.getByText(/menú de análisis/i)).toBeInTheDocument();
    expect(screen.getByText(/ver reporte de stock de productos/i)).toBeInTheDocument();
    expect(screen.getByText(/detectar stock bajo/i)).toBeInTheDocument();
    expect(screen.getByText(/medir rotación de producto/i)).toBeInTheDocument();
    expect(screen.getByText(/productos que generan mayores ingresos/i)).toBeInTheDocument();
    expect(screen.getByText(/productos menos vendidos que requieren estrategias promocionales/i)).toBeInTheDocument();

  });

  test('los botones están correctamente asociados a rutas', () => {
    render(
      <MemoryRouter>
        <MenuInventario />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /📦 Ver reporte de stock de productos/i })).toHaveAttribute('href', '/stock-producto');
    expect(screen.getByRole('link', { name: /🛑 Detectar Stock Bajo/i })).toHaveAttribute('href', '/stock-bajo');
    expect(screen.getByRole('link', { name: /📊 Medir Rotación de Producto/i })).toHaveAttribute('href', '/tasa-rotacion');
    expect(screen.getByRole('link', { name: /💰 Productos que generan mayores ingresos/i })).toHaveAttribute('href', '/productos-mayor-ingreso');
    expect(screen.getByRole('link', { name: /📉 Productos menos vendidos que requieren estrategias promocionales/i })).toHaveAttribute('href', '/productos-menos-vendidos');
  });
});