import Link from 'next/link';
import React from 'react';

const DeliveryPolicy: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="text-xs text-teal-500 tracking-widest font-medium title-font mb-1">Cafe La Esmeralda</h1>
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Política de Entrega</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Nos comprometemos a entregar nuestro delicioso Cafe de forma rápida y eficiente. A continuación, encontrarás los detalles de nuestra política de entrega.
          </p>
        </div>
        <div className="flex flex-wrap">
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Tiempo de Entrega</h2>
            <p className="leading-relaxed text-base mb-4">
              El tiempo estimado de entrega es de 48 a 72 hs  dependiendo de la ubicación. Trabajamos arduamente para asegurar que nuestras entregas lleguen a tiempo, manteniendo siempre la calidad y frescura de nuestros productos. En caso de retrasos, notificaremos al cliente con anticipación.
            </p>
          </div>
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Áreas de Cobertura</h2>
            <p className="leading-relaxed text-base mb-4">
              Cubrimos una amplia área dentro de la ciudad, incluyendo los barrios más alejados. Si te encuentras fuera de nuestra zona de entrega, por favor contáctanos y haremos todo lo posible para acomodar tu pedido. Consulta nuestra página de áreas de cobertura para más detalles.
            </p>
          </div>
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Costos de Entrega</h2>
            <p className="leading-relaxed text-base mb-4">
              Los costos de entrega varían según la distancia del lugar de entrega desde nuestra ubicación. Ofrecemos tarifas competitivas y promociones especiales para clientes frecuentes. Los costos exactos se calculan al momento de realizar tu pedido y se muestran antes de confirmar la compra.
            </p>
          </div>
          <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Métodos de Pago</h2>
            <p className="leading-relaxed text-base mb-4">
              Aceptamos varios métodos de pago para tu comodidad. Puedes pagar con tarjetas de crédito y débito, además de pagos en efectivo al momento de la entrega. Próximamente, también ofreceremos opciones de pago a través de billeteras digitales y aplicaciones móviles para mayor facilidad.
            </p>
          </div>
        </div>
        <Link href="/categories">
        <button className="flex mx-auto mt-16 text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">
          Ordenar Ahora
        </button>
        </Link>
      </div>
    </section>
  );
};

export default DeliveryPolicy;