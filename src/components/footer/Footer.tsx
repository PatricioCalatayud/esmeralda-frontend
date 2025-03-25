"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillInstagram } from "react-icons/ai";
import { MdFacebook } from "react-icons/md";
import Container from "@/components/container/Container";
import FooterList from "./FooterList";
import { useCategoryContext } from "@/context/categories.context";
import MercadoPagoIcon from "./MercadoPagoIcon";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/login" ||
    pathname === "/register" ||
    /^\/dashboard(\/|$)/.test(pathname) ||
    /^\/dashboardCliente(\/|$)/.test(pathname) ||
    pathname === "/forgotPassword" ||
    pathname === "/resetPassword" ||
    pathname === "/emailVerify"; // Ocultar footer en login y register
  const [footerHeight, setFooterHeight] = useState("600px");
  const [flexDirection, setFlexDirection] = useState<"row" | "column">("row");
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>(
    {}
  );
  const { categories } = useCategoryContext();

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth < 640) {
        setFooterHeight("800px");
        setFlexDirection("column");
        setBackgroundStyle({ backgroundColor: "white" });
      } else if (window.innerWidth < 1024) {
        setFooterHeight("700px");
        setFlexDirection("column");
        setBackgroundStyle({ backgroundColor: "white" });
      } else {
        setFooterHeight("600px");
        setFlexDirection("row");
        setBackgroundStyle({
          backgroundImage: 'url("/buenline.jpg")',
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        });
      }
    }

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (hideFooter) {
    return null;
  }

  return (
    <footer
      style={{
        position: "relative",
        height: footerHeight,
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
      }}
      className="lg:shadow-3xl"
    >
      <div
        style={{
          ...backgroundStyle,
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -2,
        }}
      />
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          height: "100%",
          width: "100%",

          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <Container className="h-full py-24">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between w-full">
            <FooterList className="w-1/4 flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">Productos</h3>
              {categories?.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <div>{category.name}</div>
                </Link>
              ))}
            </FooterList>
            <FooterList className="w-1/4 flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">
                Servicio al Cliente
              </h3>
              <Link href="/contact">
                <div>Contáctanos</div>
              </Link>
              <Link href="/politica">
                <div>Política de Entrega</div>
              </Link>
              <Link href="/devoluciones">
                <div>Devoluciones y Cambios</div>
              </Link>
              <Link href="/faq">
                <div>Preguntas Frecuentes</div>
              </Link>
            </FooterList>
            <div className="w-1/4 flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">
                Sobre Nosotros
              </h3>
              <p className="mb-2">
                ¡Bienvenido a Café La Esmeralda, tu destino para los mejores cafés
                en grano y accesorios! Nos enfocamos en granos seleccionados y
                productos de alta calidad para ofrecerte una experiencia de café
                única. Disfruta de nuestra variedad de productos y ofertas hoy.
              </p>
            </div>
            <FooterList className="w-1/4 flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">
                Síguenos
              </h3>
              <div className="flex gap-2">
                <Link href={"https://www.facebook.com/cafelaesmeralda10"} target="_blank">
                  <MdFacebook size={24} />
                </Link>
                <Link href={"https://www.instagram.com/cafelaesmeralda/"} target="_blank">
                  <AiFillInstagram size={24} />
                </Link>
                <Link
                  href={
                    "https://listado.mercadolibre.com.ar/_CustId_510408628?item_id=MLA1670664876&category_id=MLA409413&seller_id=510408628&client=recoview-selleritems&recos_listing=true"
                  }
                  target="_blank"
                >
                  <MercadoPagoIcon />
                </Link>
              </div>
            </FooterList>
          </div>
          <div className="w-full text-center border-t pt-4">
            <p>
              &copy;{new Date().getFullYear()} Café La Esmeralda. Todos los
              derechos reservados
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
