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
  console.log(allProducts);
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setAllProducts(products);
      if (products) {
      const productsWithDiscount = products.filter(product => parseFloat(product.discount) > 0);
      setProductsPromotions(productsWithDiscount);
    }
      setProductLoading(false);
    };

    fetchProducts();

  }, []);

  const searchProducts = (searchTerm: string) => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const results = allProducts?.filter((product) =>
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <ProductContext.Provider value={{ allProducts, searchResults, searchProducts , productsPromotions, productLoading}}>
      {children}
    </ProductContext.Provider>
  );
};