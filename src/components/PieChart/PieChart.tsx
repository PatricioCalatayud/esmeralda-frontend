// BarChart.tsx
"use client";
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios para el gráfico de tipo "Pie"
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    
      // Opciones de configuración del gráfico
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const, // Coloca la leyenda en la parte superior
          },
          tooltip: {
            enabled: true, // Muestra los tooltips al pasar el mouse
          },
        },
      };
    
      return <div className='w-1/2'><Pie data={data} options={options} /></div>;
    };

export default PieChart;
