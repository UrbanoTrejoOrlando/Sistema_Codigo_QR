import React, { useState, useEffect } from 'react';
import Modaleditar from './Modaleditar';

const Tablaalumnos = ({ id_grado }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [alumnoId, setAlumnoId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [alumnoEliminar, setAlumnoEliminar] = useState(null);

  const handleOpen = (id) => {
    setAlumnoId(id);
    setShowModalEditar(true);
  };

  const handleClose = () => {
    setShowModalEditar(false);
    setAlumnoId(null);
  };

  const handleUpdateAlumno = (updatedAlumno) => {
    setAlumnos(prev =>
      prev.map(a => (a.id_alumno === updatedAlumno.id_alumno ? updatedAlumno : a))
    );
    handleClose();
  };

  const handleConfirmDelete = (id) => {
    setAlumnoEliminar(id);
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setAlumnoEliminar(null);
    setShowConfirmDelete(false);
  };

  const handleDeleteAlumno = async () => {
    if (!alumnoEliminar) return;
    try {
      const res = await fetch(`http://localhost:3001/alumnos/delete/${alumnoEliminar}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar alumno');
      setAlumnos(prev => prev.filter(a => a.id_alumno !== alumnoEliminar));
    } catch (err) {
      console.error('Error al eliminar alumno:', err);
    } finally {
      setAlumnoEliminar(null);
      setShowConfirmDelete(false);
    }
  };

  useEffect(() => {
    if (!id_grado) return;

    fetch(`http://localhost:3001/alumnos/alumnosgrado/${id_grado}`)
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(err => console.error('Error al cargar alumnos:', err));
  }, [id_grado]);

  const alumnosOrdenados = [...alumnos].sort((a, b) => a.no_lista - b.no_lista);

  return (
    <div className="table-responsive mt-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
      <table className="table table-bordered table-striped align-middle mb-0">
        <thead className="table-success">
          <tr>
            <th>No.Lista</th>
            <th>Folio</th>
            <th>Nombre del alumno</th>
            <th>QR</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {alumnosOrdenados.length > 0 ? (
            alumnosOrdenados.map(alumno => (
              <tr key={alumno.id_alumno}>
                <td>{alumno.no_lista}</td>
                <td>{alumno.folio}</td>
                <td>{alumno.nombre_alumno}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      window.open(`http://localhost:3001/alumnos/qr/image/${alumno.folio}`, '_blank')
                    }
                  >
                    Ver QR
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleOpen(alumno.id_alumno)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleConfirmDelete(alumno.id_alumno)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay alumnos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModalEditar && (
        <Modaleditar
          show={showModalEditar}
          onClose={handleClose}
          alumnoId={alumnoId}
          onUpdate={handleUpdateAlumno}
        />
      )}

      {showConfirmDelete && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de eliminar este alumno?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleDeleteAlumno}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tablaalumnos;
