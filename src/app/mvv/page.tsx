import Image from 'next/image';
import React from 'react';

const MVV: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
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
            -<span className=' font-bold'>Innovacion</span>: Búsqueda continua de mejoras en técnicas de tostado y preparación.
            <br />
            -<span className=' font-bold'>Pasion</span>: Amor por el café y dedicación a compartirlo con el mundo.
            <br />
            -<span className=' font-bold'>Integridad</span>: Conducta ética y transparencia en todas nuestras operaciones.
          </p>
        
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <Image width={500} height={500} className="object-cover object-center rounded" alt="hero" src="/esmeralda5.png" priority={true} />
        </div>
      </div>
    </section>
  );
}

export default MVV;