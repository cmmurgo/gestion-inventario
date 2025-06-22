import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CrearVenta from '../pages/Ventas/CrearVenta';
import EditarVenta from '../pages/Ventas/EditarVenta';
import VerVenta from '../pages/Ventas/VerVenta';
import DetalleProductos from '../pages/Ventas/DetalleProductos';

describe('Ventas - General', () => {
    test('Renderiza formulario de crear venta', async () => {
        render(<MemoryRouter><CrearVenta /></MemoryRouter>);
        expect(await screen.findByText(/registrar venta/i)).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('CLIENTE'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('FECHA'))).toBeInTheDocument();
    });

    test('Validación de campos vacíos en crear venta', async () => {
        render(<MemoryRouter><CrearVenta /></MemoryRouter>);
        fireEvent.click(screen.getByText(/guardar/i));
        expect(await screen.findByText(/todos los campos son obligatorios/i)).toBeInTheDocument();
    });

    test('Visualiza datos de una venta', async () => {
        render(<MemoryRouter><VerVenta /></MemoryRouter>);
        expect(await screen.findByText(/ver venta/i)).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('FECHA'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('CLIENTE'))).toBeInTheDocument();
    });

    test('Renderiza datos de edición', async () => {
        render(<MemoryRouter><EditarVenta /></MemoryRouter>);
        expect(await screen.findByText(/editar venta/i)).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('CLIENTE'))).toBeInTheDocument();
    });

    test('Renderiza productos asociados en DetalleProductos', () => {
        const detallesMock = [
            { nombre: 'Producto A', cantidad: 1, precio_venta: 100, descuento: 0, total: 90 },
            { nombre: 'Producto B', cantidad: 2, precio_venta: 50, descuento: 0, total: 100 },
        ];

        const productosMock = [
            { id: 1, nombre: 'Producto A' },
            { id: 2, nombre: 'Producto B' },
        ];

        render(
            <DetalleProductos
                detalles={detallesMock}
                setDetalles={() => { }}
                productos={productosMock}
            />
        );

        const productosA = screen.getAllByText(/producto a/i);
        const productosB = screen.getAllByText(/producto b/i);

        expect(productosA.length).toBeGreaterThan(0);
        expect(productosB.length).toBeGreaterThan(0);
    });
});