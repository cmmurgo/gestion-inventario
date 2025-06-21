
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { UserProvider } from '../context/UserContext';
import axios from 'axios';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');

const renderWithProviders = (ui) => {
  return render(<UserProvider>{ui}</UserProvider>);
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('renderiza campos de usuario y contraseña', () => {
  renderWithProviders(<Login />);
  expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
});

test('guarda token y navega al login exitoso', async () => {
  const mockResponse = {
    data: {
      token: 'fake-jwt',
      user: { id: 1, role: 'admin', nombre: 'Fernando' },
    },
  };
  axios.post.mockResolvedValueOnce(mockResponse);

  renderWithProviders(<Login />);
  fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
    target: { value: 'admin@test.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: '123456' },
  });

  fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

  await waitFor(() => {
    expect(localStorage.getItem('token')).toBe('fake-jwt');
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});

test('muestra mensaje con credenciales incorrectas (401)', async () => {
  axios.post.mockRejectedValueOnce({ response: { status: 401 } });

  renderWithProviders(<Login />);
  fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
    target: { value: 'fake@user.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: 'wrongpass' },
  });

  fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

  await waitFor(() =>
    expect(screen.getByText(/usuario o contraseña incorrectos/i)).toBeInTheDocument()
  );
});

test('muestra mensaje de error del servidor', async () => {
  axios.post.mockRejectedValueOnce({});

  renderWithProviders(<Login />);
  fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
    target: { value: 'error@test.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
    target: { value: '123456' },
  });

  fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

  await waitFor(() =>
    expect(screen.getByText(/error al conectar con el servidor/i)).toBeInTheDocument()
  );
});
