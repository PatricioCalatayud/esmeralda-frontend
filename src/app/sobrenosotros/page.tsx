import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SobreNosotros: React.FC = () => {
  return (
    <section className="text-gray-600 body-font relative w-full overflow-hidden">
      {/* SVG como fondo decorativo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-screen h-full opacity-20 -z-10"
        viewBox="0 0 2 1"
        preserveAspectRatio="none"
      >
        <rect fill="#77aa77" width="2" height="1" />
        <defs>
          <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="1" gradientTransform="rotate(166,0.5,0.5)">
            <stop offset="0" stopColor="#77aa77" />
            <stop offset="1" stopColor="#4fd" />
          </linearGradient>
          <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1" gradientTransform="rotate(217,0.5,0.5)">
            <stop offset="0" stopColor="#cf8" stopOpacity="0" />
            <stop offset="1" stopColor="#cf8" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="2" y2="2" gradientTransform="rotate(360,0.5,0.5)">
            <stop offset="0" stopColor="#cf8" stopOpacity="0" />
            <stop offset="1" stopColor="#cf8" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" fill="url(#a)" width="2" height="1" />
        <g fillOpacity="1">
          <polygon fill="url(#b)" points="0 1 0 0 2 0" />
          <polygon fill="url(#c)" points="2 1 2 0 0 0" />
        </g>
      </svg>

      {/* Contenido principal */}
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col backdrop-blur-sm backdrop-opacity-75">
        <div className="flex flex-col md:flex-row md:justify-center items-center mb-10">
          <Image width={500} height={500} priority={true} className="lg:w-1/3 md:w-1/2 w-5/6 mb-4 md:mb-0 object-cover object-center rounded" alt="historical photo 1" src="https://images.pexels.com/photos/19973361/pexels-photo-19973361/free-photo-of-warehouse-of-coffee-beans.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
          <Image width={500} height={500} priority={true} className="lg:w-1/3 md:w-1/2 w-5/6 md:ml-4 object-cover object-center rounded" alt="historical photo 2" src="https://images.pexels.com/photos/4820660/pexels-photo-4820660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        </div>
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Nuestra Historia</h1>
          <p className="mb-8 leading-relaxed">
            Con más de 80 años de tradición, nuestra empresa ha sido un pilar fundamental en la industria cafetera de Buenos Aires y Argentina. Desde nuestros humildes comienzos, nos hemos dedicado a brindar el mejor café a los bares y restaurantes más prestigiosos de la ciudad.
          </p>
          <p className="mb-8 leading-relaxed">
            A lo largo de nuestra historia, hemos observado los efectos transformadores del café en la vida de las personas. Creemos firmemente en el poder del café para conectar a las personas y crear experiencias memorables.
          </p>
          <p className="mb-8 leading-relaxed">
            Nos hemos mantenido fieles a nuestro compromiso con la calidad y la excelencia. Invertimos en nuestras comunidades y promovemos el crecimiento sostenible, asegurando que cada etapa de nuestra producción respete el medio ambiente y valore a nuestros productores.
          </p>
          <p className="mb-8 leading-relaxed">
            Nuestra misión es ofrecer un café de la más alta calidad, respetando y valorizando cada etapa de su producción. Continuamos elevando los estándares y compartiendo nuestra pasión con cada sorbo, brindando una experiencia inigualable a nuestros clientes.
          </p>
          <div className="flex justify-center">
            <Link href="https://api.whatsapp.com/send?phone=541158803709" className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-teal-200 rounded text-lg">Contáctanos</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SobreNosotros;