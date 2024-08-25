"use client";
import React, { useState, useEffect } from 'react';

const PaymentSuccess: React.FC = () => {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    date: string;
    time: string;
    products: { description: string; imgUrl: string; quantity: number }[];
  } | null>(null);

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (!searchParams) return;

    const orderId = searchParams.get('orderId');
    console.log("Order ID from URL:", orderId);  // Para verificar que el orderId se esté capturando correctamente

    if (orderId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);  // Para ver la respuesta completa de la API

          const date = new Date(data.date);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();

          const products = data.productsOrder.map((productOrder: any) => ({
            description: productOrder.product.description,
            imgUrl: productOrder.product.imgUrl,
            quantity: productOrder.quantity,
          }));

          console.log("Formatted Order Details:", {
            date: formattedDate,
            time: formattedTime,
            products,
          });  // Para ver cómo se están formateando los datos antes de guardarlos en el estado

          setOrderDetails({
            date: formattedDate,
            time: formattedTime,
            products,
          });
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);  // Para capturar y mostrar errores de la solicitud
        });
    }
  }, [searchParams]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

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

      <a href="/" className="payment__container-btn text-white bg-teal-500 text-2xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out">
        Explora el estado de tu pedido!
      </a>
    </div>
  );
};

export default PaymentSuccess;