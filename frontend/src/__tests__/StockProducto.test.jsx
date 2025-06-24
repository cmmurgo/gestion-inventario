import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReporteStockProducto from '../pages/Inventario/StockProducto';

// Simular localStorage con token
beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: () => 'mocked-token',
        },
        writable: true,
    });
});

describe('Inventario - StockProducto', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        stock_producto: [
                            {
                                nombre: 'Producto A',
                                rubro: 'Rubro A',
                                descripcion: 'Desc A',
                                stock_minimo: 5,
                                stock_actual: 2,
                            },
                            {
                                nombre: 'Producto B',
                                rubro: 'Rubro B',
                                descripcion: 'Desc B',
                                stock_minimo: 10,
                                stock_actual: 20,
                            },
                        ],
                    }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renderiza correctamente con datos', async () => {
        render(<MemoryRouter><ReporteStockProducto /></MemoryRouter>);
        await waitFor(() => {
            expect(screen.getByText('Producto A')).toBeInTheDocument();
            expect(screen.getByText('Rubro B')).toBeInTheDocument();
        });
    });

    test('muestra mensaje si no hay productos', async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ stock_producto: [] }),
        });

        render(<MemoryRouter><ReporteStockProducto /></MemoryRouter>);
        await waitFor(() => {
            expect(screen.getByText(/no hay datos disponibles/i)).toBeInTheDocument();
        });
    });

    test('permite ordenar por stock actual', async () => {
        render(<MemoryRouter><ReporteStockProducto /></MemoryRouter>);
        await waitFor(() => screen.getByText('Producto A'));

        const header = screen.getAllByText(/stock actual/i).find(el => el.tagName === 'TH');
        expect(header).toBeTruthy();

        // Primer click: orden ascendente (Producto A primero)
        fireEvent.click(header);
        let rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Producto A');

        // Segundo click: orden descendente (Producto B primero)
        fireEvent.click(header);
        rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Producto B');
    });
});