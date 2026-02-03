import axios from 'axios';

export const login = (username, password) =>
  axios.post('http://localhost:3001/auth/login', { username, password });

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const getToken = () => localStorage.getItem('token');

// Inicializar token automáticamente al cargar la app
export const initAuth = () => {
  const token = getToken();
  if (token) setAuthToken(token);
};
// services/auth.js
export const logout = () => {
  setAuthToken(null); // elimina token de axios y localStorage
};
