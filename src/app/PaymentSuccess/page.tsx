"use client";
import React, { useState, useEffect } from 'react';

const PaymentSuccess: React.FC = () => {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [orderDetails, setOrderDetails] = useState<{
    date: string;
    time: string;
    products: { description: string; imgUrl: string; quantity: number }[];
  } | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);  // Nuevo estado para guardar el orderId

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
    const id = params.get('orderId');
    setOrderId(id);  // Guardamos el orderId en el estado
  }, []);

  useEffect(() => {
    if (!searchParams) return;

    const id = searchParams.get('orderId');

    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`)
        .then((response) => response.json())
        .then((data) => {

          const date = new Date(data.create);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();

          const products = data.productsOrder.map((productOrder: any) => ({
            description: productOrder.subproduct.product.description,
            imgUrl: `${process.env.NEXT_PUBLIC_API_URL}/product/${productOrder.subproduct.product.imgUrl}`,
            quantity: productOrder.quantity,
          }));

          setOrderDetails({
            date: formattedDate,
            time: formattedTime,
            products,
          });
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    }
  }, [searchParams]);

  if (!orderDetails) {
    return (
      <div className="payment__container mx-auto bg-white p-20 rounded-lg flex flex-col items-center justify-evenly shadow-lg animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded mb-5"></div>
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-5"></div>
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 w-32 bg-gray-200 rounded mb-5"></div>

        <div className="order-details bg-gray-100 p-6 rounded-lg mb-5 w-full max-w-md">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          
          {/* Skeleton para 2 productos */}
          {[1, 2].map((_, index) => (
            <div key={index} className="flex items-center mt-4">
              <div className="w-24 h-24 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-around w-full max-w-md">
          <div className="h-14 w-40 bg-gray-200 rounded-full"></div>
          <div className="h-14 w-40 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment__container mx-auto bg-white p-20 rounded-lg flex flex-col items-center justify-evenly shadow-lg">
      <h3 className="payment__container-heading text-4xl font-semibold text-center mb-5">¡Pago Exitoso!</h3>
      <img 
        className="payment__container-image w-24 h-24 mb-5" 
        src="https://res.cloudinary.com/dmnazxdav/image/upload/v1599736321/tick_hhudfj.svg" 
        alt="Pago Exitoso"
      />
      <h3 className="payment__container-welcome text-3xl font-semibold text-center mb-2">¡Gracias por hacer tu compra en La Esmeralda!</h3>
      <p className="payment__container-text text-xl font-normal text-center mb-5">
        Una comunidad apasionada por el mejor café.
      </p>
      <h3 className="payment__container-cube text-3xl font-semibold text-center mb-5">Tu número de pedido es {orderId}</h3>

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

      {orderId && (
        <a
          href={`https://valentino-tunnel.flamefactory.io//dashboard/cliente/order/${orderId}`}
          className="payment__container-btn text-white bg-teal-500 text-2xl py-4 px-10 rounded-full font-normal shadow-lg hover:opacity-80 transition duration-150 ease-in-out"
        >
          ¡Explora el estado de tu pedido!
        </a>
      )}
    </div>
  );
};

export default PaymentSuccess;