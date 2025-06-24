// src/__tests__/Productos.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react'; // ✅ Importación correcta
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CrearProducto from '../pages/Productos/CrearProducto';
import EditarProducto from '../pages/Productos/EditarProducto';
import { crearProducto } from '../services/productService';

jest.mock('../services/rubroService', () => ({
    getRubros: jest.fn().mockResolvedValue({ data: [] })
}));
jest.mock('../services/promocionService', () => ({
    getPromocionesActivas: jest.fn().mockResolvedValue({ data: [] })
}));
jest.mock('../services/proveedorService', () => ({
    getProveedores: jest.fn().mockResolvedValue({ data: [] })
}));
jest.mock('../services/productService', () => ({
    getProductoById: jest.fn().mockResolvedValue({
        data: {
            nombre: 'Coca-Cola',
            id_rubro: '',
            descripcion: 'Gaseosa',
            precio_costo: 100,
            precio_venta: 150,
            stock_minimo: 10,
            id_promocion: '',
            id_proveedor: '',
            codigo_barra: 123456789
        }
    }),
    crearProducto: jest.fn().mockRejectedValue(new Error('Error')),
    actualizarProducto: jest.fn()
}));

jest.mock('../api', () => ({
    API_URL: 'http://localhost'
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/productos/crear" element={ui} />
                <Route path="/productos/editar/:id" element={ui} />
            </Routes>
        </MemoryRouter>
    );
};

describe('Productos', () => {
    test('renderiza formulario de CrearProducto', async () => {
        await act(async () => {
            renderWithRouter(<CrearProducto />, { route: '/productos/crear' });
        });
        expect(screen.getByText(/crear producto/i)).toBeInTheDocument();
    });

    test('validación de nombre obligatorio en CrearProducto', async () => {
        crearProducto.mockRejectedValue(new Error('Simulación de error en crearProducto'));

        await act(async () => {
            renderWithRouter(<CrearProducto />, { route: '/productos/crear' });
        });
        fireEvent.click(screen.getByText(/guardar/i));
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });

    test('validación de precio inválido en CrearProducto', async () => {
        await act(async () => {
            renderWithRouter(<CrearProducto />, { route: '/productos/crear' });
        });

        // ✅ Selección por name sin usar "name" accesible
        const precioInput = screen.getAllByRole('spinbutton')[0]; // primer input numérico
        fireEvent.change(precioInput, { target: { value: '-100' } });
        fireEvent.click(screen.getByText(/guardar/i));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });

    test('renderiza formulario de EditarProducto con datos cargados', async () => {
        await act(async () => {
            renderWithRouter(<EditarProducto />, { route: '/productos/editar/1' });
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Coca-Cola')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Gaseosa')).toBeInTheDocument();
            expect(screen.getByText(/guardar/i)).toBeInTheDocument(); // ✅ botón GUARDAR
        });
    });
});