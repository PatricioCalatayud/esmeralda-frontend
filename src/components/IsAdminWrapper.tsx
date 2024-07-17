"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

import Footer from "./footer/Footer";
import Navbar from "./navbar/navbar";


const IsAdminWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAddProductPage = pathname.startsWith("/productAdd");
  const isAdminPage = pathname.startsWith("/dashboardAdmin");
  const isUpdateProductPage = pathname.startsWith("/productList/"); // Assuming this is your correct route pattern

  useEffect(() => {
    console.log("Ruta actual:", pathname);
  }, [pathname]);

  return (
    <>
      {/* Mostrar Navbar, Chatbot y Footer solo si no es /productAdd, /dashboardAdmin ni /productList/{id} */}
      {!isAddProductPage && !isAdminPage && !isUpdateProductPage && <Navbar />}
      {children}
      {!isAddProductPage && !isAdminPage && !isUpdateProductPage && <Footer />}
    </>
  );
};

export default IsAdminWrapper;
