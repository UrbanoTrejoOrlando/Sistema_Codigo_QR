import React from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const Panel = () => {
  const navigate = useNavigate();

  // 🟢 Recuperar usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const rol = user.rol || "worker"; // por defecto worker si no hay rol

  // 🚀 Navegaciones
  const irAAlumnos = (id_grado) => navigate(`/alumnos/${id_grado}`);
  const irAEstadisticas = () => navigate("/estadisticas");
  const irDashboard = () => navigate("/");
  const irAdministradores = () => navigate("/administradores");
  const irPasemanual = () => navigate("/pasemanual");

  // 🚀 Nueva función: Ir a asistencias por grado
  const irAsistenciasPorGrado = (id_grado) => navigate(`/asistencias/${id_grado}`);

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div
        style={{ minHeight: '100vh' }}
        className='d-flex flex-column justify-content-start align-items-center'
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            irDashboard();
          }}
          className="nav-link text-white link-transition fs-3 mt-4"
        >
          <i className="bi bi-journal-bookmark m-2"></i>
          Clok-in
        </a>

        <p className='text-start fs-4 mb-4 mt-4 w-100'>
          <i className="bi bi-browser-safari m-3"></i>Panel ({rol})
        </p>

        <div className="w-100 d-flex flex-column align-items-center">

          {/* === SOLO ADMIN: Alumnos === */}
          {rol === "admin" && (
            <div
              className="accordion w-100"
              id="accordionAlumnos"
              style={{
                background: 'rgba(8, 6, 17, 0.808)',
                color: '#fff',
                maxWidth: '350px',
                width: '100%',
                borderRadius: '8px',
              }}
            >
              <div className="accordion-item" style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff', border: 'none' }}>
                <h2 className="accordion-header" id="headingAlumnos">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseAlumnos"
                    aria-expanded="true"
                    aria-controls="collapseAlumnos"
                    style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff' }}
                  >
                    <i className="bi bi-backpack2 m-3"></i>
                    Alumnos
                  </button>
                </h2>
                <div
                  id="collapseAlumnos"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingAlumnos"
                  data-bs-parent="#accordionAlumnos"
                >
                  <div className="accordion-body" style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff' }}>
                    <ul className="list-unstyled mb-0">
                      <li className='mb-3'>
                        <button onClick={() => irAAlumnos(1)} className="nav-link text-white btn btn-link p-0" style={{ textAlign: 'left' }}>
                          <i className="bi bi-1-circle m-3"></i>
                          Primer Grado
                        </button>
                      </li>
                      <li className='mb-3'>
                        <button onClick={() => irAAlumnos(2)} className="nav-link text-white btn btn-link p-0" style={{ textAlign: 'left' }}>
                          <i className="bi bi-2-circle m-3"></i>
                          Segundo Grado
                        </button>
                      </li>
                      <li className='mb-3'>
                        <button onClick={() => irAAlumnos(3)} className="nav-link text-white btn btn-link p-0" style={{ textAlign: 'left' }}>
                          <i className="bi bi-3-circle m-3"></i>
                          Tercer Grado
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === SOLO ADMIN: Asistencias === */}
          {rol === "admin" && (
            <div
              className="accordion w-100"
              id="accordionAsistencias"
              style={{
                background: 'rgba(8, 6, 17, 0.808)',
                color: '#fff',
                maxWidth: '350px',
                width: '100%',
                borderRadius: '8px',
              }}
            >
              <div className="accordion-item" style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff', border: 'none' }}>
                <h2 className="accordion-header" id="headingAsistencias">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseAsistencias"
                    aria-expanded="true"
                    aria-controls="collapseAsistencias"
                    style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff' }}
                  >
                    <i className="bi bi-clipboard2 m-3"></i>
                    Asistencias
                  </button>
                </h2>
                <div
                  id="collapseAsistencias"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingAsistencias"
                  data-bs-parent="#accordionAsistencias"
                >
                  <div className="accordion-body" style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff' }}>
                    <ul className="list-unstyled mb-0">
                      <li className='mb-3'>
                        <button onClick={() => irAsistenciasPorGrado(1)} className="nav-link text-white link-transition btn btn-link p-0">
                          <i className="bi bi-clipboard2 m-3"></i>
                          Asistencias 1° Grado
                        </button>
                      </li>
                      <li className='mb-3'>
                        <button onClick={() => irAsistenciasPorGrado(2)} className="nav-link text-white link-transition btn btn-link p-0">
                          <i className="bi bi-clipboard2 m-3"></i>
                          Asistencias 2° Grado
                        </button>
                      </li>
                      <li className='mb-3'>
                        <button onClick={() => irAsistenciasPorGrado(3)} className="nav-link text-white link-transition btn btn-link p-0">
                          <i className="bi bi-clipboard2 m-3"></i>
                          Asistencias 3° Grado
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === OTROS === */}
          <div
            className="accordion mb-3 w-100"
            id="accordionNotificacion"
            style={{
              background: 'rgba(8, 6, 17, 0.808)',
              color: '#fff',
              maxWidth: '350px',
              width: '100%',
              borderRadius: '8px',
            }}
          >
            <div className="accordion-item" style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff', border: 'none' }}>
              <h2 className="accordion-header" id="headingNotificacion">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseNotificaciones"
                  aria-expanded="true"
                  aria-controls="collapseNotificaciones"
                  style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff' }}
                >
                  <i className="bi bi-motherboard m-3"></i>
                  Otros
                </button>
              </h2>
              <div
                id="collapseNotificaciones"
                className="accordion-collapse collapse show"
                aria-labelledby="headingNotificacion"
                data-bs-parent="#accordionNotificacion"
              >
                <div className="accordion-body" style={{ background: 'rgba(8, 6, 17, 0.808)', color: '#fff' }}>
                  <ul className="list-unstyled mb-0">
                    {/* Solo admin: Administradores */}
                    {rol === "admin" && (
                      <li className='mb-3'>
                        <button onClick={irAdministradores} className="nav-link text-white link-transition btn btn-link p-0">
                          <i className="bi bi-person-fill-gear m-3"></i>
                          Administradores
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* === BOTÓN LOGOUT === */}
          <button
            onClick={handleLogout}
            className="btn btn-danger mt-4 mb-4"
            style={{ maxWidth: '300px', width: '90%' }}
          >
            <i className="bi bi-box-arrow-right m-2"></i>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
