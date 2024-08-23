"use client"
import React from 'react';

const PaymentFailure: React.FC = () => {
  // Datos de ejemplo, estos deberían ser pasados como props o ser obtenidos dinámicamente
  const orderDetails = {
    orderId: "ORD-123456",
    date: "23/08/2024",
    time: "14:35",
  };

  return (
    <div className="payment__container mx-auto bg-white p-20 rounded-lg flex flex-col items-center justify-evenly shadow-lg">
      <h3 className="payment__container-heading text-4xl font-semibold text-center mb-5 text-red-500">¡Pago Fallido!</h3>
      <img 
        className="payment__container-image w-24 mb-5" 
        src="cross.png" 
        alt="Pago Fallido"
      />
      <h3 className="payment__container-cube text-3xl font-semibold text-center mb-2">Número de Orden</h3>
      <p className="text-2xl font-semibold text-center mb-5">{orderDetails.orderId}</p>

      <div className="order-details bg-gray-100 p-6 rounded-lg mb-5 w-full max-w-md">
        <p className="text-lg"><strong>Fecha:</strong> {orderDetails.date}</p>
        <p className="text-lg"><strong>Hora:</strong> {orderDetails.time}</p>
      </div>

      <div className="flex justify-around w-full max-w-md">
        <a href="/" className="payment__container-btn text-black bg-yellow-500 text-2xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out">
          Volver a Home
        </a>
        <a href="/cart" className="payment__container-btn text-black bg-yellow-500 text-2xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out">
          Volver al Carro
        </a>
      </div>
    </div>
  );
};

export default PaymentFailure;