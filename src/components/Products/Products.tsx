import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts } from "@/helpers/products.helper";
import { IProduct } from "@/interfaces/IProduct";
import { Rating } from "@mui/material";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";

const Products = () => {
  const [products, setProducts] = useState<IProductList[] | undefined>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts?.slice(0, 7));
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="mt-14 mb-12 bg-teal-100 m-1">
      <div className="text-center mb-10 max-w-[600px] mx-auto pt-6">
        <p className="text-sm text-primary">Productos más vendidos para ti</p>
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-xs text-teal-400">
          Descubre nuestros cafés en grano más vendidos, seleccionados con los mejores granos para ofrecerte una experiencia única. Desde café suave y aromático hasta nuestras opciones más intensas, encuentra tu sabor perfecto y disfruta de una taza excepcional.
        </p>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 place-items-center gap-5">
          {products?.map((product: IProductList) => (
            <Link href={`/categories/${product.id}`} key={product.id}>
            <div>
              <Image
                priority={true} width={500} height={500}
                src={product.imgUrl}
                alt={product.description}
                className="h-[300px] sm:w-[200px] object-cover rounded-md w-full"
              />
              <div className="product-item text-center">
                <Rating name="read-only" value={5} readOnly />
                <h3 className="font-bold h-14">{product.description}</h3>
                <p className="text-sm text-gray-600">${product.price}</p>
                <div className="flex items-center gap-1"></div>
              </div>
            </div>
          </Link>
          ))}
        </div>
        
        <Link href="/categories">
          <div className="flex justify-center pb-10">
            <p className="text-center mt-10 cursor-pointer bg-teal-400 hover:bg-teal-700 text-white py-1 px-5 rounded-2xl focus:outline-none focus:ring-0">
              Ver Todos
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Products;