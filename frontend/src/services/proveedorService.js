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