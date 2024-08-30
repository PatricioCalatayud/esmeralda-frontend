import Image from 'next/image';
import React from 'react';

const SobreNosotros: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <div className="flex flex-col md:flex-row md:justify-center mb-10">
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
            <button className="inline-flex text-white bg-teal-500 border-0 py-2 px-6 focus:outline-none hover:bg-teal-600 rounded text-lg">Aprende más</button>
            <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Contáctanos</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SobreNosotros;