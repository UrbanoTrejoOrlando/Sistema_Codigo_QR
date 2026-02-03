import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth";
import Metriccards from "../Metriccards";
import Historial from "../Historial";
import Calendario from "../Calendario";
import Adminscard from "../Adminscard";
import Panel from "../../Panel";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // elimina el token del usuario
    navigate("/login"); // redirige al login
  };

  return (
    <div className="login-fondo">
      <div className="row m-2">
        {/* 🧭 Panel lateral */}
        <div className="col-2 bg-dark text-white vh-100 p-0">
          <Panel />
        </div>

        {/* 📊 Contenido principal */}
        <div className="col-10">
          {/* Tarjetas de métricas */}
          <Metriccards />

          <div className="row mt-3">
            {/* Historial */}
            <div className="col-6">
              <Historial />
            </div>

            {/* Calendario + administración */}
            <div className="col-6">
              <Calendario />

              <div className="d-flex justify-content-start mt-3">
                <Adminscard />
              </div>

              {/* Botón de asistencia */}
              <div className="d-flex justify-content-start mt-4">
                <button
                  className="btn btn-success d-flex align-items-center mt-4"
                  onClick={() => navigate("/asistencia")}
                >
                  <i className="bi bi-skip-start-circle-fill me-2"></i>
                  Iniciar Asistencia
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
