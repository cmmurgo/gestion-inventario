// src/services/ordenCompraService.js
import axios from 'axios';
import { getToken } from './authService';
import { API_URL } from '../api';

const API = `${API_URL}/api/ordenes-compra`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getOrdenesCompra = () => axios.get(API, authConfig());
export const getOrdenCompraById = (id) => axios.get(`${API}/${id}`, authConfig());
export const createOrdenCompra = (data) => axios.post(API, data, authConfig());
export const updateOrdenCompra = (id, data) => axios.put(`${API}/${id}`, data, authConfig());

// NUEVA FUNCIÓN: Cancelar orden de compra (soft delete)
export const cancelarOrdenCompra = (id) => axios.delete(`${API}/${id}`, authConfig());