import React, { useEffect, useState } from 'react'

const Tablaasistencias = ({ id_grado, onSelectAlumno }) => {
  const [alumnos, setAlumnos] = useState([])

  useEffect(() => {
    if (!id_grado) return

    const fetchAlumnos = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/alumnos/${id_grado}`)
        if (!response.ok) throw new Error("Error al obtener los alumnos")
        const data = await response.json()
        setAlumnos(data)
      } catch (error) {
        console.error("Error al cargar los alumnos:", error)
      }
    }

    fetchAlumnos()
  }, [id_grado])

  const handleClick = (alumno) => {
    if (onSelectAlumno) {
      onSelectAlumno(alumno.id_alumno)
    }
  }

  return (
    <div>
      <h5 className="mt-3 mb-3 fs-4">
        Lista de Alumnos {id_grado && `(Grado ${id_grado})`}
      </h5>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table table-bordered table-striped mb-0">
          <thead className="table-success">
            <tr>
              <th>Número de lista</th>
              <th>Nombre del alumno</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length > 0 ? (
              alumnos.map((alumno) => (
                <tr
                  key={alumno.id_alumno}
                  onClick={() => handleClick(alumno)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{alumno.no_lista}</td>
                  <td>{alumno.nombre_alumno}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  No hay alumnos registrados para este grado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tablaasistencias
