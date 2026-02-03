import React, { useState } from 'react'
import Panel from '../../Panel'
import Tabla from '../Tabla'
import Newadmin from '../Newadmin'
import Modaladmins from '../../Dashboard/Modaladmins'

const Administradores = () => {
  const [showNewModal, setShowNewModal] = useState(false)

  const handleOpen = () => setShowNewModal(true)
  const handleClose = () => setShowNewModal(false)
  const handleAdd = (e) => {
    e.preventDefault()
    setShowNewModal(false)
  }

  return (
    <div className='login-fondo'>
      <div className='row m-2'>
        {/* Panel lateral */}
        <div className='col-2 bg-dark text-white'>
          <Panel />
        </div>

        {/* Contenido principal */}
        <div className='col-10'>
          <button
            className='btn btn-warning d-flex align-items-center m-4'
            onClick={handleOpen}
          >
            <i className='bi bi-person-add m-1'></i>
            Agregar Administrador
          </button>

          {/* Modal de agregar administrador */}
          <Modaladmins
            show={showNewModal}
            onClose={handleClose}
            onAdd={handleAdd}
          />

          {/* Tabla de administradores */}
          <Tabla />

          {/* Formulario adicional (si aplica) */}
          <Newadmin />
        </div>
      </div>
    </div>
  )
}

export default Administradores
