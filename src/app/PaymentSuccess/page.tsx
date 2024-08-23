import React from 'react';

const PaymentSuccess: React.FC = () => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <h2 className="sm:text-3xl text-2xl text-gray-900 font-medium title-font mb-2 md:w-2/5">Muchas gracias por tu compra</h2>
        <div className="md:w-3/5 md:pl-6">
          <h3 className="text-xl font-semibold mb-4">Detalle de tu compra</h3>
          <div className="leading-relaxed text-base space-y-4">
            <div className="flex items-center">
              <img src="/ruta-de-la-imagen.jpg" alt="Producto" className="w-16 h-16 object-cover mr-4"/>
              <div>
                <p className="font-medium text-gray-900">Nombre del Producto</p>
                <p className="text-gray-600">Cantidad: 1</p>
                <p className="text-gray-600">Fecha: 22/08/2024</p>
              </div>
            </div>
            {/* Puedes añadir más detalles aquí */}
          </div>
          <div className="flex md:mt-4 mt-6">
            <button className="inline-flex text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded">Volver al Inicio</button>
            <a className="text-indigo-500 inline-flex items-center ml-4" href="#">
              Aprender más
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;