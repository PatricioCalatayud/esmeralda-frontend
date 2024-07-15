import Link from 'next/link';
import React from 'react';

const ReturnsAndExchanges: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-teal-100 text-teal-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className="text-gray-900 text-lg title-font font-medium mb-2">Política de Devolución</h2>
            <p className="leading-relaxed text-base">
              Si no estás satisfecho con tu pedido, puedes devolverlo en el local dentro de las 24hs posteriores a la compra. Asegúrate de que los productos no hayan sido consumidos y estén en su estado original.
            </p>
          </div>
        </div>
        <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className="text-gray-900 text-lg title-font font-medium mb-2">Política de Cambio</h2>
            <p className="leading-relaxed text-base">
              Ofrecemos cambios por productos del mismo valor dentro de las 24hs posteriores a la compra. Los productos deben estar en su estado original y sin consumir. Para iniciar un cambio, visita nuestro local con tu recibo y el producto en cuestión.
            </p>
          </div>
          <div className="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full bg-teal-100 text-teal-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
            </svg>
          </div>
        </div>
        <div className="flex items-center lg:w-3/5 mx-auto sm:flex-row flex-col">
          <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-teal-100 text-teal-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
            <h2 className="text-gray-900 text-lg title-font font-medium mb-2">Reembolsos</h2>
            <p className="leading-relaxed text-base">
              Los reembolsos se procesan en el mismo método de pago utilizado durante la compra. Si pagaste en efectivo, el reembolso se hará en efectivo. Si pagaste con tarjeta, el reembolso se reflejará en tu cuenta dentro de los 3 a 5 días hábiles. Los reembolsos solo se procesan si el producto no ha sido consumido y está en su estado original.
            </p>
          </div>
        </div>
        <Link   href="/chat">
        <button className="flex mx-auto mt-20 text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">
          Contactar Servicio al Cliente
        </button>
        </Link>
      </div>
    </section>
  );
};

export default ReturnsAndExchanges;