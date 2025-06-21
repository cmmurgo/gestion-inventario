import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';
import CrearUsuario from '../pages/Usuarios/CrearUsuario';
import EditarUsuario from '../pages/Usuarios/EditarUsuario';

const renderWithContext = (component) => {
  return render(
    <MemoryRouter>
      <UserProvider>
        {component}
      </UserProvider>
    </MemoryRouter>
  );
};

describe('Usuarios', () => {
  test('renderiza formulario de CrearUsuario', () => {
    renderWithContext(<CrearUsuario />);
    expect(screen.getByText(/crear usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre de usuario/i).closest('div').querySelector('input')).toBeInTheDocument();
    expect(screen.getByText(/email/i).closest('div').querySelector('input')).toBeInTheDocument();
    expect(screen.getByText(/clave/i).closest('div').querySelector('input')).toBeInTheDocument();
    expect(screen.getByText(/rol/i).closest('div').querySelector('select')).toBeInTheDocument();
  });

  test('renderiza formulario de EditarUsuario con datos', () => {
    renderWithContext(<EditarUsuario />);
    expect(screen.getByText(/editar usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre de usuario/i).closest('div').querySelector('input')).toBeInTheDocument();
    expect(screen.getByText(/email/i).closest('div').querySelector('input')).toBeInTheDocument();
    expect(screen.getByText(/clave/i).closest('div').querySelector('input')).toBeInTheDocument();
    expect(screen.getByText(/rol/i).closest('div').querySelector('select')).toBeInTheDocument();
  });

  test('validación de email inválido en CrearUsuario', async () => {
    renderWithContext(<CrearUsuario />);
    const emailInput = screen.getByText(/email/i).closest('div').querySelector('input');
    fireEvent.change(emailInput, { target: { value: 'correo@mal' } });
    fireEvent.click(screen.getByText(/guardar/i));
    const error = await screen.findByText(/ingrese un email válido/i);
    expect(error).toBeInTheDocument();
  });

  test('validación de contraseña corta en CrearUsuario', async () => {
    renderWithContext(<CrearUsuario />);
    const emailInput = screen.getByText(/email/i).closest('div').querySelector('input');
    const passwordInput = screen.getByText(/clave/i).closest('div').querySelector('input');
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(screen.getByText(/guardar/i));
    const error = await screen.findByText(/al menos 8/i);
    expect(error).toBeInTheDocument();
  });

});