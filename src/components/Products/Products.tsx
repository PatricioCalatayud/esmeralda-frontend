import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Rating } from "@mui/material";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { useProductContext } from "@/context/product.context";
import { Spinner } from "@material-tailwind/react";

const Products = () => {
  const [products, setProducts] = useState<IProductList[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const {allProducts} = useProductContext();

  useEffect(() => {
        setProducts(allProducts?.slice(0, 6));
        setLoading(false);
  }, [allProducts]);

  return (
    <div className="mt-14 mb-12 bg-teal-100 ">
      {loading ? <div className='flex items-center justify-center w-full h-[600px]'>
    <Spinner
    color="teal"
    className="h-12 w-12"
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
  /></div> : (
    <>
      <div className="text-center mb-10 flex items-center flex-col mx-auto pt-6">
        <h2 className="text-2xl font-bold max-w-[600px]">Productos más vendidos</h2>
        <hr className="border-white my-2 w-screen"/>
        <p className="text-sm text-teal-800 sm:max-w-[600px] w-3/4">
          Descubre nuestros cafés en grano más vendidos, seleccionados con los mejores granos para ofrecerte una experiencia única. Desde café suave y aromático hasta nuestras opciones más intensas, encuentra tu sabor perfecto y disfruta de una taza excepcional.
        </p>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 place-items-center gap-4 px-10">
          {products?.map((product: IProductList) => (
            <Link href={`/categories/${product.id}`} key={product.id} className="shadow-lg bg-blue-gray-50 rounded-lg   w-full">
              <Image
                priority={true} width={500} height={500}
                src={product.imgUrl}
                alt={product.description}
                className="h-[260px] w-full object-cover rounded-t-md "
              />
              <div className="product-item text-center">
                
                <h3 className="font-bold h-14 flex items-center justify-center">{product.description}</h3>
                <p className="text-lg text-gray-800">Desde ${
                                product.subproducts?.reduce(
                                  (lowest, current) => {
                                    return current.price < lowest.price
                                      ? current
                                      : lowest;
                                  }
                                ).price
                              }</p>
                <div className="flex items-center gap-1"></div>

                <Rating name="read-only" value={5} readOnly />

              </div>
          </Link>
          ))}
        </div>
        
        <Link href="/categories">
          <div className="flex justify-center pb-10">
            <p className="inline-flex text-white bg-teal-600 border-0 py-2 px-6 focus:outline-none hover:bg-teal-800 rounded-xl text-lg mt-10">
              Ver Todos
            </p>
          </div>
        </Link>
      </div></>)}
    </div>
  );
};

export default Products;