import React, { useState, useEffect } from 'react';

const Modaleditar = ({ show, onClose, alumnoId, onUpdate }) => {
  const [form, setForm] = useState({
    nombre: '',
    folio: '',
    nolista: '',
    grado: '',
    tutor: '',
    direccion: '',
    telefono: ''
  });
  const [validated, setValidated] = useState(false);
  const [showConfirmSave, setShowConfirmSave] = useState(false); // Modal de confirmación de guardado

  const gradosMap = {
    1: '1 grado',
    2: '2 grado',
    3: '3 grado'
  };

  useEffect(() => {
    if (!alumnoId) return;

    fetch(`http://localhost:3001/alumnos/alumnoporid/${alumnoId}`)
      .then(res => {
        if (!res.ok) throw new Error('Alumno no encontrado');
        return res.json();
      })
      .then(alumno => {
        setForm({
          nombre: alumno.nombre_alumno || '',
          folio: alumno.folio || '',
          nolista: alumno.no_lista || '',
          grado: alumno.id_grado ? alumno.id_grado.toString() : '',
          tutor: alumno.nombre_tutor || '',
          direccion: alumno.direccion || '',
          telefono: alumno.telefono || ''
        });
      })
      .catch(err => console.error('Error al cargar alumno:', err));
  }, [alumnoId]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono" && !/^\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  // Mostrar modal de confirmación antes de guardar
  const handleSaveClick = (e) => {
    e.preventDefault();
    setValidated(true);
    const formElement = e.currentTarget.closest('form');
    if (formElement.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    setShowConfirmSave(true);
  };

  const handleConfirmSave = async () => {
    try {
      const res = await fetch(`http://localhost:3001/alumnos/editalumno/${alumnoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Error al actualizar alumno');

      const updatedAlumno = await res.json();
      onUpdate(updatedAlumno);
      setShowConfirmSave(false);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setForm({
      nombre: '',
      folio: '',
      nolista: '',
      grado: '',
      tutor: '',
      direccion: '',
      telefono: ''
    });
    setValidated(false);
    setShowConfirmSave(false);
    onClose();
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Alumno</h5>
              <button type="button" className="btn-close" onClick={handleCancel}></button>
            </div>
            <form
              className={`needs-validation ${validated ? 'was-validated' : ''}`}
              noValidate
              autoComplete="off"
            >
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre del alumno</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        maxLength={180}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Folio</label>
                      <input
                        type="text"
                        className="form-control"
                        name="folio"
                        value={form.folio}
                        onChange={handleChange}
                        required
                        maxLength={9}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Numero de Lista</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nolista"
                        value={form.nolista}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Grado</label>
                      <select
                        className="form-select"
                        name="grado"
                        value={form.grado}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona el grado</option>
                        {Object.entries(gradosMap).map(([id, nombre]) => (
                          <option key={id} value={id}>
                            {nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre del tutor</label>
                      <input
                        type="text"
                        className="form-control"
                        name="tutor"
                        value={form.tutor}
                        onChange={handleChange}
                        required
                        maxLength={180}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        required
                        maxLength={200}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono del tutor</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                        pattern="\d{10}"
                        maxLength={10}
                        minLength={10}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success" onClick={handleSaveClick}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de guardado */}
      {showConfirmSave && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar cambios</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmSave(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de guardar los cambios?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmSave(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleConfirmSave}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modaleditar;
