import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../src/services/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  // Obtener el rol desde el token (o guardarlo en localStorage)
  const user = JSON.parse(localStorage.getItem('user')); // si guardaste el usuario
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />; // redirige si no tiene permiso
  }

  return children;
};

export default PrivateRoute;
