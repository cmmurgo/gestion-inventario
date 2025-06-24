// src/__tests__/StockBajo.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StockBajo from '../pages/Inventario/StockBajo';
import { MemoryRouter } from 'react-router-dom';

// Mock localStorage
beforeAll(() => {
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
});

// Mock global fetch
beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve({
                    stock_bajos: [
                        {
                            nombre: 'Producto A',
                            categoria: 'Bebidas',
                            descripcion: 'Botella 1L',
                            stock_minimo: 10,
                            stock_actual: 5,
                            umbral_stock_bajo: 8
                        },
                        {
                            nombre: 'Producto B',
                            categoria: 'Snacks',
                            descripcion: 'Paquete 300g',
                            stock_minimo: 15,
                            stock_actual: 10,
                            umbral_stock_bajo: 12
                        }
                    ]
                }),
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Inventario - StockBajo', () => {
    test('renderiza productos con stock bajo correctamente', async () => {
        render(<MemoryRouter><StockBajo /></MemoryRouter>);

        await waitFor(() => screen.getByText('Producto A'));
        expect(screen.getByText('Producto B')).toBeInTheDocument();
        expect(screen.getByText('Botella 1L')).toBeInTheDocument();
        expect(screen.getByText('Paquete 300g')).toBeInTheDocument();
    });

    test('muestra mensaje si no hay productos con stock bajo', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ stock_bajos: [] }),
            })
        );

        render(<MemoryRouter><StockBajo /></MemoryRouter>);
        await waitFor(() => screen.getByText(/no hay productos con stock bajo/i));
        expect(screen.getByText(/no hay productos con stock bajo/i)).toBeInTheDocument();
    });

    test('permite ordenar por stock actual', async () => {
        render(<MemoryRouter><StockBajo /></MemoryRouter>);
        await waitFor(() => screen.getByText('Producto A'));

        const stockActualHeader = screen.getAllByText(/stock actual/i).find(el => el.tagName === 'TH');
        fireEvent.click(stockActualHeader); // Orden ascendente
        fireEvent.click(stockActualHeader); // Orden descendente

        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Producto B'); // stock_actual = 10
        expect(rows[2]).toHaveTextContent('Producto A'); // stock_actual = 5
    });
});