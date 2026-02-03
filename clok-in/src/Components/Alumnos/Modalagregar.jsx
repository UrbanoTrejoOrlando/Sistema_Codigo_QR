import React, { useState } from 'react'

const Modalagregar = ({ show, onClose, onAdd, grados }) => {
  const [form, setForm] = useState({
    nombre: '',
    folio: '',
    nolista: '',
    grado: '',
    tutor: '',
    direccion: '',
    telefono: ''
  })
  const [validated, setValidated] = useState(false)

  if (!show) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "telefono" && !/^\d*$/.test(value)) return
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidated(true)
    if (!e.currentTarget.checkValidity()) return
    onAdd(form)
    setForm({
      nombre: '',
      folio: '',
      nolista: '',
      grado: '',
      tutor: '',
      direccion: '',
      telefono: ''
    })
    setValidated(false)
    onClose()
  }

  const handleCancel = () => {
    setForm({
      nombre: '',
      folio: '',
      nolista: '',
      grado: '',
      tutor: '',
      direccion: '',
      telefono: ''
    })
    setValidated(false)
    onClose()
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Alumno</h5>
            <button type="button" className="btn-close" onClick={handleCancel}></button>
          </div>
          <form className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nombre del alumno</label>
                    <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required maxLength={180} />
                    <div className="invalid-feedback">El nombre es obligatorio y máximo 180 caracteres.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Folio</label>
                    <input type="text" className="form-control" name="folio" value={form.folio} onChange={handleChange} required maxLength={9} />
                    <div className="invalid-feedback">El folio es obligatorio y máximo 9 caracteres.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Número de Lista</label>
                    <input type="text" className="form-control" name="nolista" value={form.nolista} onChange={handleChange} required />
                    <div className="invalid-feedback">El No. de Lista es obligatorio.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Grado</label>
                    <select className="form-select" name="grado" value={form.grado} onChange={handleChange} required>
                      <option value="">Selecciona el grado</option>
                      {grados?.map((g) => (
                        <option key={g.id_grado} value={g.id_grado}>{g.grado}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback">El grado es obligatorio.</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nombre del tutor</label>
                    <input type="text" className="form-control" name="tutor" value={form.tutor} onChange={handleChange} required maxLength={180} />
                    <div className="invalid-feedback">El nombre del tutor es obligatorio y máximo 180 caracteres.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} required maxLength={200} />
                    <div className="invalid-feedback">La dirección es obligatoria y máximo 200 caracteres.</div>
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
                    <div className="invalid-feedback">El teléfono debe ser numérico y de 10 dígitos.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
              <button type="submit" className="btn btn-success">Agregar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Modalagregar
