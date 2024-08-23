"use cleint";
import React from 'react';

const PaymentFailure: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">¡Pago Rechazado!</h1>
        <p className="text-gray-700 mb-8">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
        <button
          onClick={() => {
            // Aquí puedes manejar la acción del botón, como redirigir a otra página
          }}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;