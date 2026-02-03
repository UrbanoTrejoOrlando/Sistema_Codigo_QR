import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Panel from '../../Panel'
import Tablaasistencias from '../Tablaasistencias'
import Calendario from '../Calendario'
import Infoalumno from '../Infoalumno'

const Asistencias = () => {
  // 🧠 Obtener el parámetro id_grado desde la URL
  const { id_grado } = useParams()

  // 📦 Estado para guardar el id del alumno seleccionado
  const [idAlumnoSeleccionado, setIdAlumnoSeleccionado] = useState(null)

  return (
    <div className='login-fondo'>
      <div className='row m-2'>
        <div className='col-2 text-white bg-dark'>
          <Panel />
        </div>

        <div className='col-10'>
          <div className='row'>
            <div className='col-6'>
              {/* 🔹 Pasamos el id_grado y la función al componente Tablaasistencias */}
              <Tablaasistencias
                id_grado={id_grado}
                onSelectAlumno={(id) => setIdAlumnoSeleccionado(id)}
              />
            </div>

            <div className='col-6'>
              {/* 🔹 Muestra calendario y detalles del alumno */}
              <Calendario id_alumno={idAlumnoSeleccionado} />
              <Infoalumno id_alumno={idAlumnoSeleccionado} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Asistencias
