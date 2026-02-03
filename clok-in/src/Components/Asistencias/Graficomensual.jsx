import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficomensual = () => {
  const data = {
    labels: ['Primer Grado', 'Segundo Grado', 'Tercer Grado'], // nombres de ejemplo
    datasets: [
      {
        label: 'Asistencias',
        data: [5, 3, 4],
        backgroundColor: 'green',
      },
      {
        label: 'Ausencias',
        data: [0, 2, 1],
        backgroundColor: 'red',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Asistencias y Ausencias por mes',
      },
    },
  };

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graficomensual;
