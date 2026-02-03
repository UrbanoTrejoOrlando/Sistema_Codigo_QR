import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Metriccards = () => {
  const [totales, setTotales] = useState({
    total_general: 0,
    totales_por_grado: []
  })

  useEffect(() => {
    axios.get('http://localhost:3002/api/totales-grado')
      .then(res => setTotales(res.data))
      .catch(err => console.error('Error al obtener los totales:', err))
  }, [])

  const { total_general, totales_por_grado } = totales

  const primero = totales_por_grado.find(g => g.id_grado === 1)?.total_alumnos || 0
  const segundo = totales_por_grado.find(g => g.id_grado === 2)?.total_alumnos || 0
  const tercero = totales_por_grado.find(g => g.id_grado === 3)?.total_alumnos || 0

  return (
    <div className="d-flex justify-content-between mt-3" style={{ gap: '0.5rem' }}>
      <div className="card text-white bg-success mb-3 shadow-lg rounded-lg" style={{ minWidth: '200px' }}>
        <div className="card-body text-center">
          <h5 className="card-title">Total de Alumnos</h5>
          <p className="card-text fs-5 mb-0">
            <i className="bi bi-mortarboard m-1"></i>
            {total_general} alumnos
          </p>
        </div>
      </div>

      <div className="card text-white bg-success mb-3 shadow-lg rounded-lg" style={{ minWidth: '200px' }}>
        <div className="card-body text-center">
          <h5 className="card-title">Primer Grado</h5>
          <p className="card-text fs-5 mb-0">
            <i className="bi bi-people-fill m-1"></i>
            {primero} alumnos
          </p>
        </div>
      </div>

      <div className="card text-white bg-success mb-3 shadow-lg rounded-lg" style={{ minWidth: '200px' }}>
        <div className="card-body text-center">
          <h5 className="card-title">Segundo Grado</h5>
          <p className="card-text fs-5 mb-0">
            <i className="bi bi-people-fill m-1"></i>
            {segundo} alumnos
          </p>
        </div>
      </div>

      <div className="card text-white bg-success mb-3 shadow-lg rounded-lg" style={{ minWidth: '200px' }}>
        <div className="card-body text-center">
          <h5 className="card-title">Tercer Grado</h5>
          <p className="card-text fs-5 mb-0">
            <i className="bi bi-people-fill m-1"></i>
            {tercero} alumnos
          </p>
        </div>
      </div>
    </div>
  )
}

export default Metriccards
