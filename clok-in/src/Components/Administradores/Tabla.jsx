import React, { useState, useEffect } from 'react'
import Modaleditar from './Modaleditar'

const Tabla = () => {
    const [admins, setAdmins] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState(null)

    // Obtener administradores desde la API
    const fetchAdmins = async () => {
        try {
            const response = await fetch("http://localhost:3003/api/administradores")
            const data = await response.json()
            setAdmins(data)
        } catch (error) {
            console.error("Error al obtener administradores:", error)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const handleOpen = (admin) => {
        setSelectedAdmin(admin)
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
        setSelectedAdmin(null)
    }

    const handleUpdate = () => {
        fetchAdmins()
        handleClose()
    }

    const handleDelete = async (admin) => {
        if (!window.confirm(`¿Seguro que quieres eliminar a ${admin.nombre_usuario}?`)) return

        try {
            const response = await fetch(`http://localhost:3003/api/deleteadmin/${admin.id_usuario}`, {
                method: "DELETE"
            })

            if (!response.ok) throw new Error("Error al eliminar")

            alert("Usuario eliminado correctamente")
            fetchAdmins()
        } catch (error) {
            console.error(error)
            alert("Hubo un error al eliminar el usuario")
        }
    }

    return (
        <div>
            <table className="table table-bordered table-striped m-2">
                <thead>
                    <tr>
                        <th scope="col">Nombre usuario</th>
                        <th scope="col">Rol</th>
                        <th scope="col"></th>
                    </tr>
                </thead>

                <tbody>
                    {admins.length > 0 ? (
                        admins.map((admin) => (
                            <tr key={admin.id_usuario}>
                                <td>{admin.nombre_usuario}</td>
                                <td>{admin.rol}</td>

                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleOpen(admin)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(admin)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No hay administradores aún
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Modaleditar
                show={showModal}
                onClose={handleClose}
                onSave={handleUpdate}
                admin={selectedAdmin}
            />
        </div>
    )
}

export default Tabla
