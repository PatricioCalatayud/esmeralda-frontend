"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/interfaces/IProduct";
import { products } from "@/helpers/products";

const ProductDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const productId = Number(params.id);

  useEffect(() => {
    const fetchedProduct = products.find((product) => product.id === productId);
    setProduct(fetchedProduct || null);
  }, [productId]);

  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-green-700 mb-4">
            ${product.price}
          </p>
          <button className="bg-green-800 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors duration-300">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
