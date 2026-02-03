// src/services/auth.js
import axios from 'axios';

// 👉 Cambia esta URL si tu backend corre en otro puerto o dominio
const API_URL = 'http://localhost:3001/auth';

// 🟢 LOGIN: Envia usuario y contraseña al backend
export const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

// 🟢 Guarda el token y lo agrega al header de axios
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// 🟢 Recupera token del localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// 🟢 Cierra sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};
