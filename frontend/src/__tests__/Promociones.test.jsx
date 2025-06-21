import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CrearPromocion from '../pages/Promociones/CrearPromocion';
import EditarPromocion from '../pages/Promociones/EditarPromocion';
import { crearPromocion } from '../services/promocionService';

// Mocks
jest.mock('../services/promocionService', () => ({
    getPromocionById: jest.fn().mockResolvedValue({
        data: {
            nombre: 'Promo Invierno',
            condiciones: '2x1 en productos seleccionados',
            porcentaje: 20,
            fecha_inicio: '2025-07-01',
            fecha_fin: '2025-07-31'
        }
    }),
    crearPromocion: jest.fn().mockRejectedValue(new Error('Error')),
    actualizarPromocion: jest.fn()
}));

jest.mock('../api', () => ({
    API_URL: 'http://localhost'
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/promociones/crear" element={ui} />
                <Route path="/promociones/editar/:id" element={ui} />
            </Routes>
        </MemoryRouter>
    );
};

describe('Promociones', () => {
    test('renderiza formulario de CrearPromocion', async () => {
        await act(async () => {
            renderWithRouter(<CrearPromocion />, { route: '/promociones/crear' });
        });
        expect(screen.getByText(/crear promoción/i)).toBeInTheDocument();
    });

    test('validación de porcentaje inválido', async () => {
        await act(async () => {
            renderWithRouter(<CrearPromocion />, { route: '/promociones/crear' });
        });

        const porcentajeInput = document.querySelector('input[name="porcentaje"]');
        fireEvent.change(porcentajeInput, { target: { value: '150' } });
        fireEvent.click(screen.getByText(/guardar/i));

        await waitFor(() => {
            const alerta = document.querySelector('.alert.show');
            expect(alerta).toBeTruthy();
            expect(alerta.textContent).toMatch(/completa los campos obligatorios/i);
        });
    });

    test('validación de nombre obligatorio en CrearPromocion', async () => {
        crearPromocion.mockRejectedValueOnce(new Error('Simulación de error en crearPromocion'));

        await act(async () => {
            renderWithRouter(<CrearPromocion />, { route: '/promociones/crear' });
        });

        fireEvent.click(screen.getByText(/guardar/i));

        await waitFor(() => {
            const alert = screen.getByText(/completa los campos obligatorios/i);
            expect(alert).toBeVisible();
        });
    });

    test('renderiza formulario de EditarPromocion con datos cargados', async () => {
        await act(async () => {
            renderWithRouter(<EditarPromocion />, { route: '/promociones/editar/1' });
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Promo Invierno')).toBeInTheDocument();
            expect(screen.getByText(/guardar/i)).toBeInTheDocument();
        });
    });
});