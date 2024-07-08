"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";
import Link from "next/link";
import { IProduct } from "@/interfaces/IProduct";
import { products } from "@/helpers/products";
import { getCategoryById } from "@/helpers/categories";
import { ICategory } from "@/interfaces/ICategory";

const ProductDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const productId = Number(params.id);

  useEffect(() => {
    const fetchedProduct = products.find(
      (product) => product.article_id === productId
    );
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      const fetchedCategory = getCategoryById(fetchedProduct.categoryId);
      setCategory(fetchedCategory || null);

      if (fetchedCategory?.name === "Café en Cápsulas") {
        setSelectedSize("10 cápsulas");
      } else {
        setSelectedSize("250g");
      }
    }
    setIsLoaded(true);
  }, [productId]);

  const renderBreadcrumb = () => {
    if (!category) {
      return (
        <h1 className="text-lg font-bold animate-fade-in-up">
          <Link href="/categories">
            <p className="hover:font-bold">Productos</p>
          </Link>
        </h1>
      );
    }

    return (
      <h1 className="text-lg text-gray-500 animate-fade-in-up">
        <Link href="/categories" className="hover:font-bold hover:text-black">
          Productos
        </Link>
        {" / "}
        <Link
          href={`/categories/${category.id}`}
          className="hover:font-bold hover:text-black"
        >
          {category.name}
        </Link>
        {" / "}
        <span className="font-bold">{product?.description}</span>
      </h1>
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          color="green"
          className="h-12 w-12"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      </div>
    );
  }

  if (!product) {
    return <p>No se encontró el producto.</p>;
  }

  const sizeOptions =
    category?.name === "Café en Cápsulas"
      ? ["10 cápsulas", "20 cápsulas", "50 cápsulas"]
      : category?.name === "Máquinas"
      ? []
      : ["250g", "500g", "1kg"];

  return (
    <div className="container mx-auto p-4 my-32">
      <div
        className={`flex flex-col md:flex-row transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative md:w-1/2">
          <img
            src="/Logo.png"
            alt="Logo"
            className="absolute inset-0 w-full h-full object-contain opacity-0 animate-fade-in-logo"
          />
          <img
            src={product.url_img}
            alt={product.description}
            className="relative w-full h-96 object-contain rounded-lg opacity-0 animate-fade-in-product"
          />
        </div>

        <style jsx>{`
          @keyframes fade-in-logo {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 0.3;
            }
          }
          .animate-fade-in-logo {
            animation: fade-in-logo 0.5s ease-out forwards;
            animation-delay: 0.5s;
          }

          @keyframes fade-in-product {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          .animate-fade-in-product {
            animation: fade-in-product 1.5s ease-out forwards;
            animation-delay: 1.5s;
          }

          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
          }
        `}</style>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0 animate-fade-in-up">
          {renderBreadcrumb()}
          {category && (
            <h3 className="text-gray-500 mt-4 animate-fade-in-up">
              {category.name}
            </h3>
          )}
          <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">
            {product.description}
          </h1>
          <p className="text-2xl font-semibold text-green-700 mb-4 animate-fade-in-up">
            ${product.price}
          </p>
          {sizeOptions.length > 0 && (
            <div className="mb-4 flex space-x-4 animate-fade-in-up">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 rounded-full transition-colors duration-300 ${
                    selectedSize === size
                      ? "bg-brown-800 text-white border-2 border-green-500"
                      : "bg-brown-400 text-white hover:bg-brown-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <button className="bg-green-800 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors duration-300 animate-fade-in-up">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
