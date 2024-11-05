import Image from 'next/image';
import React from 'react';

const MVV: React.FC = () => {
  return (
    <section className="text-gray-600 body-font relative">
      {/* SVG como fondo decorativo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full opacity-20 -z-10"
        viewBox="0 0 2 1"
      >
        <rect fill="#77aa77" width="2" height="1" />
        <defs>
          <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#77aa77" />
            <stop offset="1" stopColor="#4fd" />
          </linearGradient>
          <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cf8" stopOpacity="0" />
            <stop offset="1" stopColor="#cf8" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="2" y2="2">
            <stop offset="0" stopColor="#cf8" stopOpacity="0" />
            <stop offset="1" stopColor="#cf8" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" fill="url(#a)" width="2" height="1" />
        <g fillOpacity="0.5">
          <polygon fill="url(#b)" points="0 1 0 0 2 0" />
          <polygon fill="url(#c)" points="2 1 2 0 0 0" />
        </g>
      </svg>

      {/* Contenido principal */}
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center backdrop-blur-sm backdrop-opacity-75">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Nuestra Misión</h1>
          <p className="mb-8 leading-relaxed">
            Nuestra misión es brindar a nuestros clientes una experiencia de café excepcional, destacando los sabores únicos de cada grano, cultivado y tostado con los más altos estándares de calidad y sostenibilidad.
          </p>
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Nuestra Visión</h1>
          <p className="mb-8 leading-relaxed">
            Ser reconocidos globalmente como líderes en la industria del café, innovando constantemente y promoviendo prácticas responsables que beneficien tanto a los productores como a los consumidores.
          </p>
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Nuestros Valores</h1>
          <p className="mb-8 leading-relaxed">
            -<span className=' font-bold'>Calidad</span>: Compromiso con la excelencia en cada taza de café.
            <br />
            -<span className=' font-bold'>Sostenibilidad</span>: Apoyo a prácticas agrícolas y de negocio responsables.
            <br />
            -<span className=' font-bold'>Innovación</span>: Búsqueda continua de mejoras en técnicas de tostado y preparación.
            <br />
            -<span className=' font-bold'>Pasión</span>: Amor por el café y dedicación a compartirlo con el mundo.
            <br />
            -<span className=' font-bold'>Integridad</span>: Conducta ética y transparencia en todas nuestras operaciones.
          </p>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <Image width={500} height={500} className="object-cover object-center rounded" alt="hero" src="/esmeralda5.webp" priority={true} />
        </div>
      </div>
    </section>
  );
}

export default MVV;