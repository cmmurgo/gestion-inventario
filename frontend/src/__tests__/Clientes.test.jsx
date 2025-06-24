import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearCliente from '../pages/Clientes/CrearCliente';
import EditarCliente from '../pages/Clientes/EditarCliente';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/clientes/crear" element={ui} />
        <Route path="/clientes/editar/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};


beforeEach(() => {
  localStorage.setItem('token', 'fake-token');
  localStorage.setItem('userRole', 'admin');
});

afterEach(() => {
  localStorage.clear();
});

describe('Clientes', () => {
  test('renderiza formulario de CrearCliente', () => {
    renderWithRouter(<CrearCliente />, { route: '/clientes/crear' });
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/guardar/i)).toBeInTheDocument();
  });

  test('validación de email inválido en CrearCliente', () => {
    renderWithRouter(<CrearCliente />, { route: '/clientes/crear' });

    fireEvent.change(screen.getAllByRole('textbox')[2], {
      target: { value: 'correo@mal' },
    });
    fireEvent.click(screen.getByText(/guardar/i));

    expect(screen.getByText(/email válido/i)).toBeInTheDocument();
  });

  test('renderiza formulario de EditarCliente con datos', async () => {
    const clienteMock = {
      nombre: 'María',
      apellido: 'Gómez',
      email: 'maria@example.com',
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
      cuit_cuil: '20-12345678-9'
    };

    axios.get.mockResolvedValueOnce({ data: clienteMock });

    renderWithRouter(<EditarCliente />, { route: '/clientes/editar/1' });

    await waitFor(() => {
      expect(screen.getByDisplayValue('María')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Gómez')).toBeInTheDocument();
      expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument();
    });
  });
});
