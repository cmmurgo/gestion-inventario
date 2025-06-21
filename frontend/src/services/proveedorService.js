// src/services/proveedorService.js
import axios from 'axios';
import { getToken } from './authService';
import { API_URL } from '../api';

const API = `${API_URL}/api/proveedores`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getProveedores = () => axios.get(API, authConfig());
export const getProveedorById = (id) => axios.get(`${API}/${id}`, authConfig());
export const crearProveedor = (data) => axios.post(API, data, authConfig());
export const actualizarProveedor = (id, data) => axios.put(`${API}/${id}`, data, authConfig());
export const softDeleteProveedor = (id) => axios.delete(`${API}/${id}`, authConfig());

// NUEVA FUNCIÓN: Obtener productos por ID de proveedor
export const getProductosByProveedorId = (idProveedor) => axios.get(`${API}/${idProveedor}/productos`, authConfig());