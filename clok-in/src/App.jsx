import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login/pages/Login';
import Dashbooard from './Components/Dashboard/pages/Dashbooard';
import Alumnos from './Components/Alumnos/pages/Alumnos';
import Asistencias from './Components/Asistencias/pages/Asistencias';
import Administradores from './Components/Administradores/pages/Administradores';
import Pasemanual from './Components/Pasemanual/pages/Pasemanual';
import PrivateRoute from './PrivateRoute';
import Asistencia from './pages/Asistencia';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashbooard />
            </PrivateRoute>
          }
        />

        <Route
          path="/alumnos/:id_grado"
          element={
            <PrivateRoute>
              <Alumnos />
            </PrivateRoute>
          }
        />

        <Route
          path="/asistencias/:id_grado"
          element={
            <PrivateRoute>
              <Asistencias />
            </PrivateRoute>
          }
        />

        <Route
          path="/administradores"
          element={
            <PrivateRoute>
              <Administradores />
            </PrivateRoute>
          }
        />

        <Route
          path="/pasemanual"
          element={
            <PrivateRoute>
              <Pasemanual />
            </PrivateRoute>
          }
        />

        {/* 👇 Aquí está la nueva ruta de asistencia */}
        <Route
          path="/asistencia"
          element={
            <PrivateRoute>
              <Asistencia />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
