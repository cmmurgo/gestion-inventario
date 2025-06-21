// src/__tests__/TasaRotacion.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TasaRotacion from '../pages/Inventario/TasaRotacion';
import { MemoryRouter } from 'react-router-dom';

describe('Inventario - TasaRotacion', () => {
    const mockResponse = {
        tasa_rotacion: [
            {
                producto_id: 1,
                nombre: 'Producto A',
                total_ventas_6_meses: 120,
                stock_promedio_mensual: 30,
            },
            {
                producto_id: 2,
                nombre: 'Producto B',
                total_ventas_6_meses: 60,
                stock_promedio_mensual: 20,
            }
        ]
    };

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponse)
            })
        );
        localStorage.setItem('token', 'fake-token');
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renderiza correctamente con datos de rotación', async () => {
        render(<MemoryRouter><TasaRotacion /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText('Producto A')).toBeInTheDocument();
            expect(screen.getByText('4.00')).toBeInTheDocument(); // 120 / 30
        });
    });

    test('muestra mensaje si no hay datos de rotación', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ tasa_rotacion: [] })
            })
        );

        render(<MemoryRouter><TasaRotacion /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText(/no hay datos disponibles/i)).toBeInTheDocument();
        });
    });

    test('permite ordenar por tasa de rotación', async () => {
        render(<MemoryRouter><TasaRotacion /></MemoryRouter>);

        await waitFor(() => screen.getByText('Producto A'));

        const allTasaHeaders = screen.getAllByText(/tasa de rotación/i);
        const header = allTasaHeaders.find((el) => el.tagName === 'TH');

        expect(header).toBeTruthy();

        // Orden ascendente (rotación baja primero)
        fireEvent.click(header);
        let rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Producto B'); // rotación 3.00

        // Orden descendente (rotación alta primero)
        fireEvent.click(header);
        rows = screen.getAllByRole('row'); // refresca los elementos
        expect(rows[1]).toHaveTextContent('Producto A'); // rotación 4.00
    });
});