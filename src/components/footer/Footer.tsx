  "use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillInstagram } from "react-icons/ai";
import { MdFacebook, MdWhatsapp } from "react-icons/md";
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
        setFooterHeight("auto");
        setFlexDirection("column");
        setBackgroundStyle({ backgroundColor: "white" });
      } else if (window.innerWidth < 1024) {
        setFooterHeight("auto");
        setFlexDirection("column");
        setBackgroundStyle({ backgroundColor: "white" });
      } else {
        setFooterHeight("auto");
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
        minHeight: footerHeight,
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
      <Container className="h-full py-12 md:py-16 lg:py-24">
        <div className="flex flex-col justify-between h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 w-full">
            <FooterList className="flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">Productos</h3>
              {categories?.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <div className="hover:text-teal-600 transition-colors">{category.name}</div>
                </Link>
              ))}
            </FooterList>
            <FooterList className="flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">
                Servicio al Cliente
              </h3>
              <Link href="/contact">
                <div className="hover:text-teal-600 transition-colors">Contáctanos</div>
              </Link>
              <Link href="/politica">
                <div className="hover:text-teal-600 transition-colors">Política de Entrega</div>
              </Link>
              <Link href="/devoluciones">
                <div className="hover:text-teal-600 transition-colors">Devoluciones y Cambios</div>
              </Link>
              <Link href="/faq">
                <div className="hover:text-teal-600 transition-colors">Preguntas Frecuentes</div>
              </Link>
            </FooterList>
            <div className="flex flex-col items-center text-center gap-3 px-4 lg:px-2">
              <h3 className="text-xl font-bold mb-3 text-teal-600">
                Sobre Nosotros
              </h3>
              <p className="mb-2 text-sm md:text-base">
                ¡Bienvenido a Café La Esmeralda, tu destino para los mejores cafés
                en grano y accesorios! Nos enfocamos en granos seleccionados y
                productos de alta calidad para ofrecerte una experiencia de café
                única. Disfruta de nuestra variedad de productos y ofertas hoy.
              </p>
            </div>
            <FooterList className="flex flex-col items-center text-center gap-3">
              <h3 className="text-xl font-bold mb-3 text-teal-600">
                Síguenos
              </h3>
              <div className="flex gap-4 justify-center">
                <Link href={"https://www.facebook.com/cafelaesmeralda10"} target="_blank" className="hover:text-teal-600 transition-colors">
                  <MdFacebook size={28} />
                </Link>
                <Link href={"https://www.instagram.com/cafelaesmeralda/"} target="_blank" className="hover:text-teal-600 transition-colors">
                  <AiFillInstagram size={28} />
                </Link>
                <Link href={"https://wa.me/541150107956"} target="_blank" className="hover:text-teal-600 transition-colors">
                  <MdWhatsapp size={28} />
                </Link>
                <Link
                  href={
                    "https://listado.mercadolibre.com.ar/_CustId_510408628?item_id=MLA1670664876&category_id=MLA409413&seller_id=510408628&client=recoview-selleritems&recos_listing=true"
                  }
                  target="_blank"
                  className="hover:opacity-80 transition-opacity"
                >
                  <MercadoPagoIcon />
                </Link>
              </div>
            </FooterList>
          </div>
          <div className="w-full text-center border-t pt-4 mt-8">
            <p className="text-sm md:text-base">
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
