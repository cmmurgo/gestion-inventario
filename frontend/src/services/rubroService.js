import axios from 'axios';
import { getToken } from './authService';
import { API_URL } from '../api';

const API = `${API_URL}/api/rubros`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getRubros = () => axios.get(API, authConfig());
export const getRubroById = (id) => axios.get(`${API}/${id}`, authConfig());
export const crearRubro = (data) => axios.post(API, data, authConfig());
export const actualizarRubro = (id, data) => axios.put(`${API}/${id}`, data, authConfig());
export const eliminarRubro = (id) => axios.delete(`${API}/${id}`, authConfig());
