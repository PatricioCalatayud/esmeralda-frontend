"use client"
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { IProductList } from '@/interfaces/IProductList';
import { getProducts } from '@/helpers/ProductsServices.helper';

interface ProductContextType {
  allProducts: IProductList[] | undefined;
  searchResults: IProductList[] | undefined;
  searchProducts: (searchTerm: string) => void;
  productsPromotions: IProductList[] | undefined;
  productLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<IProductList[] | undefined>([]);
  const [searchResults, setSearchResults] = useState<IProductList[] | undefined>([]);
  const [productsPromotions, setProductsPromotions] = useState<IProductList[] | undefined>([]);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setAllProducts(products);
      if (products) {
        const productsWithDiscount = products.filter(product => 
          product.subproducts.some(subproduct => {
            const discount = Number(subproduct.discount); // Asegúrate de convertirlo a número
            return !isNaN(discount) && discount > 0; // Verifica que es un número y que es mayor a 0
          })
        );

        setProductsPromotions(productsWithDiscount);
      }
      
      setProductLoading(false);
    };

    fetchProducts();

  }, []);

  const searchProducts = (searchTerm: string) => {
    console.log(searchTerm);
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const results = allProducts?.filter((product) =>
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(results);
    setSearchResults(results);
  };

  return (
    <ProductContext.Provider value={{ allProducts, searchResults, searchProducts , productsPromotions, productLoading}}>
      {children}
    </ProductContext.Provider>
  );
};