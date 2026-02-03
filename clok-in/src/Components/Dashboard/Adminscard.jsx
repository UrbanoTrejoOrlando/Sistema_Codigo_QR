import React, { useState } from 'react'
import Modaladmins from './Modaladmins'

const Adminscard = () => {
    const [showModal, setShowModal] = useState(false)

    const handleOpen = () => setShowModal(true)
    const handleClose = () => setShowModal(false)
    const handleAdd = (e) => {
        e.preventDefault()
        setShowModal(false)
    }

    const handleDeleteAll = async () => {
        const confirmado = window.confirm("¿Seguro que quieres eliminar todo el registro?")
        if (!confirmado) return

        try {
            const response = await fetch('http://localhost:3002/api/deleteregister', {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error("Error al borrar el registro")

            alert("Registro eliminado correctamente")
        } catch (error) {
            console.error(error)
            alert("Hubo un error al eliminar el registro")
        }
    }

    return (
        <div className="card shadow-lg rounded-lg p-4 d-flex flex-column align-items-start" style={{ maxWidth: '500px', minWidth: '320px' }}>
            <div className="d-flex flex-row align-items-center justify-content-between w-100 mb-3">
                <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle fs-2 me-3"></i>
                    <span className="fs-5 fw-bold">Admins</span>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-success d-flex align-items-center" onClick={handleOpen}>
                        <i className="bi bi-person-plus fs-4"></i>
                    </button>
                    <button className="btn btn-danger d-flex align-items-center" onClick={handleDeleteAll}>
                        <i className="bi bi-trash fs-4"></i>
                    </button>
                </div>
            </div>

            <Modaladmins show={showModal} onClose={handleClose} onSave={handleAdd} />
        </div>
    )
}

export default Adminscard
