import React from 'react';
import { FaSeedling, FaLeaf, FaTruck, FaCoffee } from 'react-icons/fa';
import Link from 'next/link';

const ProcesoProductivo: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="text-xs text-teal-500 tracking-widest font-medium title-font mb-1">
            DEL CULTIVO A LA TAZA
          </h2>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
            El Viaje de Tu Café
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Explora el fascinante recorrido del café, desde las plantaciones hasta tu taza. Cada paso en este proceso es fundamental para resaltar los sabores y aromas que convierten al café en una de las bebidas más apreciadas del mundo.
          </p>
        </div>
        <div className="flex flex-wrap">
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <video className="w-full h-40 object-cover mb-4 rounded" autoPlay loop muted>
              <source src="/cultivo.mp4" type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 flex items-center">
              <FaSeedling className="mr-2" /> Cultivo
            </h2>
            <p className="leading-relaxed text-base mb-4">
              El viaje comienza con el cultivo de las plantas de café en climas tropicales. Los agricultores cuidan con esmero estas plantas, asegurando su crecimiento saludable y vigoroso.
            </p>
          </div>
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <video className="w-full h-40 object-cover mb-4 rounded" autoPlay loop muted>
              <source src="/cosecha.mp4" type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 flex items-center">
              <FaLeaf className="mr-2" /> Cosecha
            </h2>
            <p className="leading-relaxed text-base mb-4">
              Cuando las cerezas de café alcanzan su madurez, se recogen a mano con sumo cuidado para seleccionar solo los granos de mejor calidad. Este proceso es laborioso pero esencial para asegurar la excelencia.
            </p>
          </div>
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <video className="w-full h-40 object-cover mb-4 rounded" autoPlay loop muted>
              <source src="/preparacion.mp4" type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 flex items-center">
              <FaTruck className="mr-2" /> Procesamiento y Transporte
            </h2>
            <p className="leading-relaxed text-base mb-4">
              Las cerezas de café se procesan para extraer los granos, que luego se secan, clasifican y empaquetan. Los granos son enviados a distintos lugares del mundo, llegando a tostadores que los preparan para su posterior infusión.
            </p>
          </div>
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <video className="w-full h-40 object-cover mb-4 rounded" autoPlay loop muted>
              <source src="/TomaCafe.mp4" type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2 flex items-center">
              <FaCoffee className="mr-2" /> Preparación
            </h2>
            <p className="leading-relaxed text-base mb-4">
              Finalmente, los granos de café son tostados y molidos, listos para ser infusionados en una taza perfecta. El aroma y sabor del café recién hecho es la culminación de este increíble recorrido.
            </p>
          </div>
        </div>
        <Link href={`/categories`}>
          <button className="flex mx-auto mt-16 text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">
            Disfruta Tu Café
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ProcesoProductivo;
