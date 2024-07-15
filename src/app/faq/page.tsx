import React from 'react';

const FAQ: React.FC = () => {
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container mx-auto px-5 py-24">
        <div className="-my-8 divide-y-2 divide-gray-100">
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Cuál es el tiempo de entrega promedio?</h2>
              <p className="leading-relaxed text-center mx-4">
                El tiempo de entrega promedio es de 2 a 3 días. Dependiendo de la zona de origen del pedido, nuestras camionetas realizan entregas en diferentes días de la semana: los lunes en la zona norte, los martes en la zona sur, los miércoles en la zona oeste y los jueves en la zona este. Cubrimos toda la ciudad de Buenos Aires y Capital Federal.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Qué métodos de pago aceptan?</h2>
              <p className="leading-relaxed text-center mx-4">
                Aceptamos una variedad de métodos de pago, incluyendo tarjetas de crédito y débito, pagos en efectivo al momento de la entrega y pagos a través de aplicaciones móviles populares. Nos esforzamos por ofrecerte la máxima comodidad.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Puedo realizar un pedido para un evento o grupo grande?</h2>
              <p className="leading-relaxed text-center mx-4">
                Sí, ofrecemos opciones para pedidos grandes y eventos. Por favor, contáctanos con anticipación para que podamos organizar y preparar tu pedido a tiempo, asegurándonos de que recibas todo lo que necesitas para tu evento.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Cómo puedo rastrear mi pedido?</h2>
              <p className="leading-relaxed text-center mx-4">
                Puedes rastrear tu pedido a través de nuestra página web o aplicación móvil utilizando el número de seguimiento proporcionado. Te mantendremos informado sobre el estado de tu entrega en tiempo real.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Qué debo hacer si mi pedido llega dañado o incorrecto?</h2>
              <p className="leading-relaxed text-center mx-4">
                Si tu pedido llega dañado o incorrecto, por favor contáctanos inmediatamente. Trabajaremos para resolver el problema lo antes posible y asegurarnos de que recibas tu pedido correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;