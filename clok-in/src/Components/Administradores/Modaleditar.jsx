import React, { useState, useEffect } from 'react'

const Modaleditar = ({ show, onClose, admin, onSave }) => {
  const [form, setForm] = useState({
    nombre: '',
    rol: '',
    contrasena: ''
  })

  const [validated, setValidated] = useState(false)

  // Cuando el modal se abre, cargar la info del usuario seleccionado
  useEffect(() => {
    if (admin && show) {
      setForm({
        nombre: admin.nombre_usuario || '',
        rol: admin.rol || '',
        contrasena: ''
      })
    }
  }, [admin, show])

  if (!show) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    if (!e.currentTarget.checkValidity()) {
      e.stopPropagation()
      return
    }

    try {
      // Solo enviar los campos que se modificaron
      const updatedFields = {}
      if (form.nombre !== admin.nombre_usuario) updatedFields.nombre_usuario = form.nombre
      if (form.rol !== admin.rol) updatedFields.rol = form.rol
      if (form.contrasena) updatedFields.contrasena = form.contrasena

      // Si no hay cambios, no hacer PUT
      if (Object.keys(updatedFields).length === 0) {
        alert("No hay cambios para actualizar")
        onClose()
        return
      }

      const response = await fetch(`http://localhost:3003/api/updaeadmin/${admin.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields)
      })

      if (!response.ok) throw new Error("Error al actualizar")

      alert("Usuario actualizado correctamente")
      onSave() // refrescar tabla
      onClose() // cerrar modal

    } catch (error) {
      console.error("Error al actualizar administrador:", error)
      alert("Hubo un error al actualizar el usuario")
    }
  }

  const handleCancel = () => {
    setValidated(false)
    onClose()
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button type="button" className="btn-close" onClick={handleCancel}></button>
          </div>

          <form
            className={`needs-validation ${validated ? 'was-validated' : ''}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="modal-body">

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label">Nombre usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">El nombre es obligatorio.</div>
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
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  minLength={6}
                />
                <div className="invalid-feedback">Mínimo 6 caracteres.</div>
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

export default Modaleditar
