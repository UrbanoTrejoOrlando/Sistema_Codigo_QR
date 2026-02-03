import React, { useState } from 'react'
import Panel from '../../Panel'

const Pasemanual = () => {
  const [folio, setFolio] = useState('')
  const [hora, setHora] = useState('')
  const [alerta, setAlerta] = useState({ show: false, message: '', type: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirmado = window.confirm('¿Estás seguro de hacer el pase de lista manual?')
    if (!confirmado) return

    try {
      const response = await fetch('http://localhost:3002/api/asistencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folio, hora_entrada: hora })
      })

      if (!response.ok) throw new Error('Error al registrar la asistencia')

      await response.json()
      setAlerta({ show: true, message: 'Asistencia registrada correctamente', type: 'success' })
      setFolio('')
      setHora('')
    } catch (error) {
      setAlerta({ show: true, message: error.message, type: 'danger' })
    }

    setTimeout(() => setAlerta({ show: false, message: '', type: '' }), 3000)
  }

  return (
    <div className='login-fondo'>
      <div className='row m-2'>
        <div className='col-2 bg-dark text-white'>
          <Panel />
        </div>

        <div className='col-10 d-flex flex-column align-items-center'>
          <h3 className="mt-3 mb-4">Pase de lista manual</h3>

          {/* Alerta */}
          {alerta.show && (
            <div className={`alert alert-${alerta.type} w-100 text-center`} role="alert">
              {alerta.message}
            </div>
          )}

          <form
            className="w-100 p-4 border rounded bg-light shadow"
            style={{ maxWidth: '500px' }}
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="folio" className="form-label fw-bold">Folio</label>
              <input
                type="text"
                className="form-control"
                id="folio"
                placeholder="Ingrese el folio"
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="hora" className="form-label fw-bold">Hora</label>
              <input
                type="time"
                className="form-control"
                id="hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => { setFolio(''); setHora(''); }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Pasemanual
