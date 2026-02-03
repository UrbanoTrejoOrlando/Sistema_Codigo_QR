import React, { useEffect, useState } from 'react';

const Infoalumno = ({ id_alumno }) => {
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    if (!id_alumno) return;

    const obtenerInfoAlumno = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3002/api/alumnos/info/${id_alumno}`);
        const data = await respuesta.json();
        setAlumno(data);
      } catch (error) {
        console.error('Error al obtener información del alumno:', error);
      }
    };

    obtenerInfoAlumno();
  }, [id_alumno]);

  if (!id_alumno) {
    return (
      <div className="container mt-4 d-flex justify-content-center">
        <div className="card shadow-sm p-3 text-center" style={{ maxWidth: '350px', width: '100%', borderRadius: '12px' }}>
          <p className="text-muted mb-0">Selecciona un alumno para ver su información</p>
        </div>
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className="container mt-4 d-flex justify-content-center">
        <div className="card shadow-sm p-3 text-center" style={{ maxWidth: '350px', width: '100%', borderRadius: '12px' }}>
          <p className="text-muted mb-0">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div
        className="card shadow-sm p-3"
        style={{
          maxWidth: '350px',
          width: '100%',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
        }}
      >
        <h6 className="text-center mb-3 fw-bold">Información del Alumno</h6>

        <div className="row">
          <div className="col-12 mb-2">
            <label className="form-label">Nombre del Alumno</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.nombre_alumno || ''}
              disabled
            />
          </div>

          <div className="col-6 mb-2">
            <label className="form-label">Grado</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.id_grado ? `${alumno.id_grado}°` : ''}
              disabled
            />
          </div>

          <div className="col-6 mb-2">
            <label className="form-label">Folio</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.folio || ''}
              disabled
            />
          </div>

          <div className="col-6 mb-2">
            <label className="form-label"># Lista</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.no_lista || ''}
              disabled
            />
          </div>

          <div className="col-6 mb-2">
            <label className="form-label">Teléfono Tutor</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.telefono || ''}
              disabled
            />
          </div>

          <div className="col-12 mb-2">
            <label className="form-label">Nombre del Tutor</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.nombre_tutor || ''}
              disabled
            />
          </div>

          <div className="col-12 mb-2">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={alumno.direccion || ''}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infoalumno;
