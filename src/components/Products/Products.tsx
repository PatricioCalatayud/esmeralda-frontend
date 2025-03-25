import React, { useState, useEffect } from "react";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
import Link from "next/link";
import { Rating } from "@mui/material";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { useProductContext } from "@/context/product.context";
import { Spinner } from "@material-tailwind/react";

const Products = () => {
  const [products, setProducts] = useState<IProductList[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const { allProducts } = useProductContext();

  useEffect(() => {
    setProducts(allProducts?.slice(0, 6));
    setLoading(false);
  }, [allProducts]);
  const [imageUrls, setImageUrls] = useState<Record<number, string | null>>({});

  const fetchImageBlob = async (productId: number, url: string) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob(); // Convertimos la respuesta a Blob
        return URL.createObjectURL(blob); // Creamos una URL temporal
      } else {
        throw new Error(
          `Error al cargar la imagen para el producto ${productId}`
        );
      }
    } catch (error) {
      console.error(
        `Error al obtener la imagen para el producto ${productId}:`,
        error
      );
      return null;
    }
  };

  // useEffect para cargar las imágenes
  useEffect(() => {
    const fetchAllImages = async () => {
      if (!products) {
        console.error("No products found");
        return; // O cualquier manejo de errores que quieras
      }

      const urls = await Promise.all(
        products.map(async (product) => {
          const blobUrl = await fetchImageBlob(
            Number(product.id),
            `${apiURL}/product/${product.imgUrl}`
          );
          return { id: product.id, url: blobUrl };
        })
      );

      const urlMap = urls.reduce((acc, item) => {
        acc[Number(item.id)] = item.url;
        return acc;
      }, {} as Record<number, string | null>);

      setImageUrls(urlMap);
    };
    fetchAllImages();
  }, [products, apiURL]);

  return (
    <div className="mt-14 mb-12 bg-teal-100 ">
      {loading ? (
        <div className="flex items-center justify-center w-full h-[600px]">
          <Spinner
            color="teal"
            className="h-12 w-12"
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>
      ) : (
        <>
          <div className="text-center mb-10 flex items-center flex-col mx-auto pt-6">
            <h2 className="text-2xl font-bold max-w-[600px]">
              Productos más vendidos
            </h2>
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 place-items-center gap-4 px-10">
              {products?.map((product: IProductList) => (
                <Link
                  href={`/categories/${product.id}`}
                  key={product.id}
                  className="shadow-lg bg-blue-gray-50 rounded-lg  border w-full"
                >
                  <Image
                    priority={true}
                    width={500}
                    height={500}
                    src={
                      String(imageUrls[Number(product.id)]) !== "undefined" &&
                      String(imageUrls[Number(product.id)]) !== "null"
                        ? String(imageUrls[Number(product.id)])
                        : `https://img.freepik.com/vector-gratis/diseno-plano-letrero-foto_23-2149259323.jpg?t=st=1734307534~exp=1734311134~hmac=8c21d768817e50b94bcd0f6cf08244791407788d4ef69069b3de7f911f4a1053&w=740`
                    }
                    alt={product.description}
                    className="h-[260px] w-full object-cover rounded-t-md "
                  />
                  <div className="product-item text-center">
                    <h3 className="font-bold h-14 flex items-center justify-center">
                      {product.description}
                    </h3>
                    <p className="text-lg text-gray-800">
                      Desde $
                      {
                        product.subproducts?.reduce((lowest, current) => {
                          return current.price < lowest.price
                            ? current
                            : lowest;
                        }).price
                      }
                    </p>
                    <div className="flex items-center gap-1"></div>

                    <Rating name="read-only" value={5} readOnly />
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center pb-10">
              <Link
                href="/categories"
                className="inline-flex text-white bg-teal-600 border-0 py-2 px-6 focus:outline-none hover:bg-teal-800 rounded-xl text-lg mt-10"
              >
                Ver Todos
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
