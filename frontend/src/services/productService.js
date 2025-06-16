import axios from 'axios';
import { getToken } from './authService';
import { API_URL } from '../api';

const API = `${API_URL}/api/productos`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getProductos = () => axios.get(API, authConfig());
export const getProductoById = (id) => axios.get(`${API}/${id}`, authConfig());
export const crearProducto = (data) => axios.post(API, data, authConfig());
export const actualizarProducto = (id, data) => axios.put(`${API}/${id}`, data, authConfig());
export const eliminarProducto = (id) => axios.delete(`${API}/${id}`, authConfig());
export const getProductosByRubro = (id) => axios.get(`${API}/rubro/${id}`, authConfig());
export const getProductosEliminados = () => axios.get(`${API}/eliminados`, authConfig());
export const restaurarProducto = (id) => axios.put(`${API}/${id}/restaurar`, {}, authConfig());

