"use client";
import React, { useState, useEffect } from 'react';

const PaymentFailure: React.FC = () => {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    date: string;
    time: string;
    products: { description: string; imgUrl: string; quantity: number }[];
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
    const id = params.get('orderId');

    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const date = new Date(data.date);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();

          const products = data.productsOrder.map((productOrder: any) => ({
            description: productOrder.product.description,
            imgUrl: productOrder.product.imgUrl,
            quantity: productOrder.quantity,
          }));

          setOrderDetails({
            orderId: data.id,
            date: formattedDate,
            time: formattedTime,
            products,
          });
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    }
  }, []);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

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
        {orderDetails.products.map((product, index) => (
          <div key={index} className="flex items-center mt-4">
            <img 
              className="w-24 h-24 rounded-md mr-4" 
              src={product.imgUrl} 
              alt={product.description} 
            />
            <div>
              <p className="text-lg"><strong>Producto:</strong> {product.description}</p>
              <p className="text-lg"><strong>Cantidad:</strong> {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-around w-full max-w-md">
        <a href="/" className="payment__container-btn text-black bg-yellow-500 text-1xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out">
          Volver a Home
        </a>
        <a href="/cart" className="payment__container-btn text-black bg-yellow-500 text-1xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out">
          Volver al Carro
        </a>
      </div>
    </div>
  );
};

export default PaymentFailure;