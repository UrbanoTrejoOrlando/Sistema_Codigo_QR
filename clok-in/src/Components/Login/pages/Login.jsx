import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, setAuthToken } from '../../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginService(username, password);

      // Guarda token y usuario
      setAuthToken(res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // 👈 importante

      // Redirige al panel principal
      navigate('/');
    } catch (err) {
      console.error('Error en login:', err);
      alert('Usuario o contraseña incorrecta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-fondo">
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card shadow-lg p-4" style={{ minWidth: '390px' }}>
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Ingresa tu usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
