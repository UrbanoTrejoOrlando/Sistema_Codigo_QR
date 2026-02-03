import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Panel from '../../Panel';
import Tablaalumnos from '../Tablaalumnos';
import Botones from '../Botones';
import AlumnoCard from '../AlumnoCard';
import { getToken } from '../../../services/auth'; // asegúrate de tener este archivo creado

const Alumnos = () => {
  const { id_grado } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const token = getToken();

  // Cargar alumnos del grado
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/alumnos/alumnosgrado/${id_grado}`);
        setAlumnos(res.data);
      } catch (error) {
        console.error('Error al obtener alumnos:', error);
      }
    };

    fetchAlumnos();
  }, [id_grado]);

  return (
    <div className='login-fondo'>
      <div className='row m-2'>
        <div className='col-2 bg-dark text-white'>
          <Panel />
        </div>
        <div className='col-10'>
          <Botones id_grado={id_grado} />
          <Tablaalumnos id_grado={id_grado} />

          {/* Nueva sección: Tarjetas individuales */}
          <div className="mt-4">
            <h4>Tarjetas individuales</h4>
            <div className="d-flex flex-wrap">
              {alumnos.map((a) => (
                <AlumnoCard key={a.id_alumno} alumno={a} token={token} />
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Alumnos;
