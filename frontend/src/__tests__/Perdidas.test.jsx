import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CrearPerdida from '../pages/Perdidas/CrearPerdida';
import EditarPerdida from '../pages/Perdidas/EditarPerdida';
import VerPerdida from '../pages/Perdidas/VerPerdida';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('Perdidas - CrearPerdida', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ id: 1, nombre: 'Producto A' }] });
    axios.post.mockResolvedValue({ data: { ok: true } });
  });

  test('renderiza campos obligatorios', async () => {
    render(<MemoryRouter><CrearPerdida /></MemoryRouter>);
    expect(await screen.findByText(/REGISTRAR PÉRDIDA/i)).toBeInTheDocument();
    expect(screen.getAllByText(/PRODUCTO/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/CANTIDAD/i)).toBeInTheDocument();
    expect(screen.getByText(/FECHA/i)).toBeInTheDocument();
    expect(screen.getByText(/MOTIVO/i)).toBeInTheDocument();
  });

  test('muestra mensaje de error si hay campos vacíos', async () => {
    render(<MemoryRouter><CrearPerdida /></MemoryRouter>);
    fireEvent.click(screen.getByText(/GUARDAR/i));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

describe('Perdidas - EditarPerdida', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/perdida/1')) {
        return Promise.resolve({ data: { producto_id: 1, cantidad: 2, fecha: '2025-06-01', motivo: 'Roto' } });
      }
      if (url.includes('/productos')) {
        return Promise.resolve({ data: [{ id: 1, nombre: 'Producto A' }] });
      }
    });
    axios.put.mockResolvedValue({ data: { ok: true } });
  });

  test('renderiza datos iniciales correctamente', async () => {
    render(<MemoryRouter><EditarPerdida /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/EDITAR PÉRDIDA/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Producto/i)[0]).toBeInTheDocument();
    });
  });
});

describe('Perdidas - VerPerdida', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { producto: 'Producto A', cantidad: 5, fecha: '2025-06-01', motivo: 'Roto' }
    });
  });

  test('muestra lista de pérdidas', async () => {
    render(<MemoryRouter><VerPerdida /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText(/DETALLE DE PÉRDIDA/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Producto/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/FECHA/i)).toBeInTheDocument();
    });
  });
});