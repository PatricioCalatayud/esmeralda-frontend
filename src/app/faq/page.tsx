import React from 'react';

const FAQ: React.FC = () => {
  return (
    <section className="text-gray-600 body-font overflow-hidden relative w-full">
      {/* SVG como fondo decorativo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-screen h-full opacity-70 -z-10"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        <rect fill="#1C5529" width="100" height="60" />
        <g fillOpacity="1">
          <rect fill="#1C5529" width="11" height="11" />
          <rect fill="#1d562b" x="10" width="11" height="11" />
          <rect fill="#1d582d" y="10" width="11" height="11" />
          <rect fill="#1e592f" x="20" width="11" height="11" />
          <rect fill="#1e5b31" x="10" y="10" width="11" height="11" />
          <rect fill="#1f5c34" y="20" width="11" height="11" />
          <rect fill="#205d36" x="30" width="11" height="11" />
          <rect fill="#205f38" x="20" y="10" width="11" height="11" />
          <rect fill="#21603a" x="10" y="20" width="11" height="11" />
          <rect fill="#22623c" y="30" width="11" height="11" />
          <rect fill="#22633e" x="40" width="11" height="11" />
          <rect fill="#236540" x="30" y="10" width="11" height="11" />
          <rect fill="#246642" x="20" y="20" width="11" height="11" />
          <rect fill="#256745" x="10" y="30" width="11" height="11" />
          <rect fill="#256947" y="40" width="11" height="11" />
          <rect fill="#266a49" x="50" width="11" height="11" />
          <rect fill="#276c4b" x="40" y="10" width="11" height="11" />
          <rect fill="#286d4d" x="30" y="20" width="11" height="11" />
          <rect fill="#296f4f" x="20" y="30" width="11" height="11" />
          <rect fill="#2a7051" x="10" y="40" width="11" height="11" />
          <rect fill="#2b7153" y="50" width="11" height="11" />
          <rect fill="#2c7356" x="60" width="11" height="11" />
          <rect fill="#2d7458" x="50" y="10" width="11" height="11" />
          <rect fill="#2e765a" x="40" y="20" width="11" height="11" />
          <rect fill="#2f775c" x="30" y="30" width="11" height="11" />
          <rect fill="#30795e" x="20" y="40" width="11" height="11" />
          <rect fill="#317a60" x="10" y="50" width="11" height="11" />
          <rect fill="#327b62" x="70" width="11" height="11" />
          <rect fill="#337d65" x="60" y="10" width="11" height="11" />
          <rect fill="#347e67" x="50" y="20" width="11" height="11" />
          <rect fill="#368069" x="40" y="30" width="11" height="11" />
          <rect fill="#37816b" x="30" y="40" width="11" height="11" />
          <rect fill="#38836d" x="20" y="50" width="11" height="11" />
          <rect fill="#39846f" x="80" width="11" height="11" />
          <rect fill="#3b8571" x="70" y="10" width="11" height="11" />
          <rect fill="#3c8773" x="60" y="20" width="11" height="11" />
          <rect fill="#3d8876" x="50" y="30" width="11" height="11" />
          <rect fill="#3f8a78" x="40" y="40" width="11" height="11" />
          <rect fill="#408b7a" x="30" y="50" width="11" height="11" />
          <rect fill="#428d7c" x="90" width="11" height="11" />
          <rect fill="#438e7e" x="80" y="10" width="11" height="11" />
          <rect fill="#458f80" x="70" y="20" width="11" height="11" />
          <rect fill="#469182" x="60" y="30" width="11" height="11" />
          <rect fill="#489284" x="50" y="40" width="11" height="11" />
          <rect fill="#499486" x="40" y="50" width="11" height="11" />
          <rect fill="#4b9588" x="90" y="10" width="11" height="11" />
          <rect fill="#4c978a" x="80" y="20" width="11" height="11" />
          <rect fill="#4e988d" x="70" y="30" width="11" height="11" />
          <rect fill="#50998f" x="60" y="40" width="11" height="11" />
          <rect fill="#519b91" x="50" y="50" width="11" height="11" />
          <rect fill="#539c93" x="90" y="20" width="11" height="11" />
          <rect fill="#559e95" x="80" y="30" width="11" height="11" />
          <rect fill="#569f97" x="70" y="40" width="11" height="11" />
          <rect fill="#58a099" x="60" y="50" width="11" height="11" />
          <rect fill="#5aa29b" x="90" y="30" width="11" height="11" />
          <rect fill="#5ca39d" x="80" y="40" width="11" height="11" />
          <rect fill="#5da59f" x="70" y="50" width="11" height="11" />
          <rect fill="#5fa6a1" x="90" y="40" width="11" height="11" />
          <rect fill="#61a8a3" x="80" y="50" width="11" height="11" />
          <rect fill="#63A9A5" x="90" y="50" width="11" height="11" />
        </g>
      </svg>


      {/* Contenido principal */}
      <div className="container mx-auto px-5 py-24">
        <div className="-my-8 divide-y-2 divide-gray-100">
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Cuál es el tiempo de entrega promedio?</h2>
              <p className="leading-relaxed text-black text-center mx-4">
                El tiempo de entrega promedio es de 2 a 3 días. Dependiendo de la zona de origen del pedido, nuestras camionetas realizan entregas en diferentes días de la semana: los lunes en la zona norte, los martes en la zona sur, los miércoles en la zona oeste y los jueves en la zona este. Cubrimos toda la ciudad de Buenos Aires y Capital Federal.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Qué métodos de pago aceptan?</h2>
              <p className="leading-relaxed text-black text-center mx-4">
                Aceptamos una variedad de métodos de pago, incluyendo tarjetas de crédito y débito, pagos en efectivo al momento de la entrega y pagos a través de aplicaciones móviles populares. Nos esforzamos por ofrecerte la máxima comodidad.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Puedo realizar un pedido para un evento o grupo grande?</h2>
              <p className="leading-relaxed text-black text-center mx-4">
                Sí, ofrecemos opciones para pedidos grandes y eventos. Por favor, contáctanos con anticipación para que podamos organizar y preparar tu pedido a tiempo, asegurándonos de que recibas todo lo que necesitas para tu evento.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Cómo puedo rastrear mi pedido?</h2>
              <p className="leading-relaxed text-black text-center mx-4">
                Puedes rastrear tu pedido a través de nuestra página web o aplicación móvil utilizando el número de seguimiento proporcionado. Te mantendremos informado sobre el estado de tu entrega en tiempo real.
              </p>
            </div>
          </div>
          <div className="py-8 flex flex-wrap md:flex-nowrap justify-center">
            <div className="md:flex-grow">
              <h2 className="text-3xl font-medium text-gray-900 title-font mb-2 text-center">¿Qué debo hacer si mi pedido llega dañado o incorrecto?</h2>
              <p className="leading-relaxed text-black text-center mx-4">
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