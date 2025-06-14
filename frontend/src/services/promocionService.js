import axios from 'axios';
import { getToken } from './authService';
import { API_URL } from '../api';

const API = `${API_URL}/api/promociones`;

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getPromociones = () => axios.get(API, authConfig());
export const getPromocionById = (id) => axios.get(`${API}/${id}`, authConfig());
export const crearPromocion = (data) => axios.post(API, data, authConfig());
export const actualizarPromocion = (id, data) => axios.put(`${API}/${id}`, data, authConfig());
export const eliminarPromocion = (id) => axios.delete(`${API}/${id}`, authConfig());
export const getPromocionesActivas = () => axios.get(API, authConfig());