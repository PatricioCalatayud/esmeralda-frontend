import React from 'react';

const FAQ: React.FC = () => {
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-100">
          <div className="py-8 flex flex-wrap md:flex-nowrap">
            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <span className="font-semibold title-font text-gray-700">PREGUNTA 1</span>
              <span className="mt-1 text-gray-500 text-sm">Actualizado el 12 Jun 2023</span>
            </div>
            <div className="md:flex-grow">
              <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">¿Cuál es el tiempo de entrega promedio?</h2>
              <p className="leading-relaxed">
                El tiempo de entrega promedio es de 30 a 45 minutos, dependiendo de tu ubicación y la demanda en el momento del pedido. Nos esforzamos por entregar tus comidas calientes y frescas lo más rápido posible.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap">
            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <span className="font-semibold title-font text-gray-700">PREGUNTA 2</span>
              <span className="mt-1 text-gray-500 text-sm">Actualizado el 12 Jun 2023</span>
            </div>
            <div className="md:flex-grow">
              <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">¿Qué métodos de pago aceptan?</h2>
              <p className="leading-relaxed">
                Aceptamos varios métodos de pago, incluyendo tarjetas de crédito y débito, pagos en efectivo al momento de la entrega y pagos a través de aplicaciones móviles populares. Trabajamos para ofrecerte la máxima comodidad.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap">
            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <span className="font-semibold title-font text-gray-700">PREGUNTA 3</span>
              <span className="text-sm text-gray-500">Actualizado el 12 Jun 2023</span>
            </div>
            <div className="md:flex-grow">
              <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">¿Puedo realizar un pedido para un evento o grupo grande?</h2>
              <p className="leading-relaxed">
                Sí, ofrecemos opciones para pedidos grandes y eventos. Por favor, contáctanos con anticipación para que podamos organizar y preparar tu pedido a tiempo, asegurándonos de que recibas todo lo que necesitas para tu evento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;