"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/helpers/ProductsServices.helper";
import ProductList from "../../components/ProductList/ProductList";
import { IProductList } from "@/interfaces/IProductList";

export default function ProductsPage() {
  const [products, setProducts] = useState<IProductList[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        console.log(products);
        if (products) {
          setProducts(products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // <- Agregamos el array de dependencias vacío para que se ejecute solo una vez

  return (
    <ProductList
      selectedCategory={null}
      category={null}
      productsList={products}
    />
  );
}
