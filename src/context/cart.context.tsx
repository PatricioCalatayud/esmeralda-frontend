"use client"
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
interface CartContextType {
  cartItemCount: number;
  setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  //! Actualizar la cantidad de elementos en el carrito
  useEffect(() => {
    const updateCartItemCount = () => {
      const cartItems = localStorage.getItem("cart");
  
      if (cartItems) {
        const items = JSON.parse(cartItems);
        setCartItemCount(items.length);
      } else {
        console.log("No hay items en el carrito");
      }
    };
      updateCartItemCount();

  }, []);


  return (
    <CartContext.Provider value={{ cartItemCount, setCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};