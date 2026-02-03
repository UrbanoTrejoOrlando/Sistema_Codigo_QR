import React, { useState, useEffect } from 'react';
import Modalagregar from './Modalagregar';
import axios from 'axios';
import { getToken } from '../../services/auth'; // Asegúrate de que exista

const Botones = ({ id_grado }) => {  // 👈 ahora recibe el id_grado como prop
  const [showModal, setShowModal] = useState(false);
  const [grados, setGrados] = useState([]);
  const [alerta, setAlerta] = useState({ mensaje: '', tipo: '' });
  const token = getToken();

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    axios.get('http://localhost:3001/alumnos/grados')
      .then(res => setGrados(res.data))
      .catch(err => console.error(err));
  }, []);

  // 👉 Agregar nuevo alumno
  const handleAdd = async (alumno) => {
    try {
      const response = await axios.post('http://localhost:3001/alumnos/nuevoalumno', alumno);
      console.log(response.data);
      setAlerta({ mensaje: 'Alumno agregado correctamente', tipo: 'success' });
      setShowModal(false);
      setTimeout(() => setAlerta({ mensaje: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Error al agregar alumno:', error);
      setAlerta({ mensaje: 'Error al agregar alumno', tipo: 'danger' });
      setTimeout(() => setAlerta({ mensaje: '', tipo: '' }), 3000);
    }
  };

  // 👉 Descargar lista PDF del grupo actual (en formato tabla)
  const downloadListaByGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/alumnos/lista/${id_grado}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `lista_grupo_${id_grado}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar lista del grupo:', error);
      alert('No se pudo descargar la lista del grupo.');
    }
  };


  // 👉 Descargar PDF solo del grupo actual
  const downloadCardsByGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/reporte/grupo/${id_grado}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `tarjetas_grupo_${id_grado}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar tarjetas por grupo:', error);
      alert('No se pudo descargar las tarjetas del grupo.');
    }
  };

  // 👉 Descargar todas las tarjetas PDF
  const downloadAllCards = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/alumnos/card/download-all/${id_grado}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tarjetas_all.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar todas las tarjetas:', error);
      alert('No se pudo descargar todas las tarjetas.');
    }
  };

  return (
    <div>
      {/* 🔔 Alerta Bootstrap */}
      {alerta.mensaje && (
        <div className={`alert alert-${alerta.tipo} alert-dismissible fade show mt-3`} role="alert">
          {alerta.mensaje}
          <button type="button" className="btn-close" onClick={() => setAlerta({ mensaje: '', tipo: '' })}></button>
        </div>
      )}

      <div className="d-flex gap-3 mt-4">
        {/* 🔹 Botón para imprimir solo los QRs del grupo actual */}
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={downloadListaByGroup}
        >
          <i className="bi bi-filetype-pdf m-1"></i>
          Lista de alumnos {id_grado} grado
        </button>

        {/* 🔹 Botón para imprimir todos los QRs */}
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={downloadAllCards}
        >
          <i className="bi bi-filetype-pdf m-1"></i>
          Imprimir Qrs
        </button>

        {/* 🔹 Botón para agregar alumno */}
        <button className="btn btn-warning d-flex align-items-center" onClick={handleOpen}>
          <i className="bi bi-person-add m-1"></i>
          Agregar Alumno
        </button>
      </div>

      <Modalagregar
        show={showModal}
        onClose={handleClose}
        onAdd={handleAdd}
        grados={grados}
      />
    </div>
  );
};

export default Botones;
