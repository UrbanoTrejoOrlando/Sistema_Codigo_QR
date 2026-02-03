import React, { useState } from 'react'

const Modaladmins = ({ show, onClose }) => {
  const [form, setForm] = useState({
    nombreUsuario: '',
    contrasena: '',
    rol: ''
  })

  const [validated, setValidated] = useState(false)

  if (!show) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    const formElement = e.currentTarget

    if (!formElement.checkValidity()) {
      e.stopPropagation()
      return
    }

    try {
      const response = await fetch("http://localhost:3003/api/createadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: form.nombreUsuario,
          password: form.contrasena,
          rol: form.rol,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar")
      }

      alert("Administrador creado correctamente")

      // Reiniciar formulario
      setForm({ nombreUsuario: '', contrasena: '', rol: '' })
      setValidated(false)
      onClose()

    } catch (error) {
      console.error(error)
      alert("Hubo un error al crear el administrador")
    }
  }

  const handleCancel = () => {
    setForm({ nombreUsuario: '', contrasena: '', rol: '' })
    setValidated(false)
    onClose()
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Nuevo Administrador</h5>
            <button type="button" className="btn-close" onClick={handleCancel}></button>
          </div>

          <form
            className={`needs-validation ${validated ? 'was-validated' : ''}`}
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="modal-body">

              {/* Nombre de Usuario */}
              <div className="mb-3">
                <label className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombreUsuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">El nombre de usuario es obligatorio.</div>
              </div>

              {/* Rol */}
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <input
                  type="text"
                  className="form-control"
                  name="rol"
                  value={form.rol}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">El rol es obligatorio.</div>
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <div className="invalid-feedback">
                  La contraseña debe tener mínimo 6 caracteres.
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                Guardar
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default Modaladmins
