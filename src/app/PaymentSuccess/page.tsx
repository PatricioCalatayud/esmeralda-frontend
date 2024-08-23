"use client"
import React from 'react';

const PaymentSuccess: React.FC = () => {
  // Datos de ejemplo, estos deberían ser pasados como props o ser obtenidos dinámicamente
  const orderDetails = {
    date: "23/08/2024",
    time: "14:35",
    product: "Café Especial La Esmeralda",
    quantity: 2,
    productImage: "https://linkalaimagen.com/imagen-cafe.png", // Reemplazar con la URL real de la imagen del producto
  };

  return (
    <div className="payment__container mx-auto bg-white p-20 rounded-lg flex flex-col items-center justify-evenly shadow-lg">
      <h3 className="payment__container-heading text-4xl font-semibold text-center mb-5">¡Pago Exitoso!</h3>
      <img 
        className="payment__container-image w-24 mb-5" 
        src="https://res.cloudinary.com/dmnazxdav/image/upload/v1599736321/tick_hhudfj.svg" 
        alt="Pago Exitoso"
      />
      <h3 className="payment__container-welcome text-3xl font-semibold text-center mb-2">Gracias por hacer tu compra en La Esmeralda!</h3>
      <p className="payment__container-text text-xl font-normal text-center mb-5">
        Una comunidad apasionada por el mejor café.
      </p>
      <h3 className="payment__container-cube text-3xl font-semibold text-center mb-5">Tu número de pedido es {"Detalle de la orden"}</h3>

      <div className="order-details bg-gray-100 p-6 rounded-lg mb-5 w-full max-w-md">
        <h4 className="text-xl font-semibold mb-4">Detalles de la Compra:</h4>
        <p className="text-lg"><strong>Fecha:</strong> {orderDetails.date}</p>
        <p className="text-lg"><strong>Hora:</strong> {orderDetails.time}</p>
        <div className="flex items-center mt-4">
          <img 
            className="w-24 h-24 rounded-md mr-4" 
            src={orderDetails.productImage} 
            alt={orderDetails.product} 
          />
          <div>
            <p className="text-lg"><strong>Producto:</strong> {orderDetails.product}</p>
            <p className="text-lg"><strong>Cantidad:</strong> {orderDetails.quantity}</p>
          </div>
        </div>
      </div>

      <a href="/" className="payment__container-btn text-white bg-teal-500 text-2xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out">
        Explora el estado de tu pedido!
      </a>
    </div>
  );
};

export default PaymentSuccess;