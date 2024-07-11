"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";
import { MdFacebook } from "react-icons/md";
import Container from "@/components/container/Container";
import FooterList from "./FooterList";

const Footer = () => {
  const pathname = usePathname();
  const hideFooter = pathname === "/login";
  const [footerHeight, setFooterHeight] = useState("500px");

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth < 640) {
        setFooterHeight("800px");
      } else {
        setFooterHeight("600px");
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
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundImage: 'url("/buenline.jpg")',
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -2,
        }}
      ></div>
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
      ></div>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 pb-8">
          <FooterList>
            <h3 className="text-base text-teal-500 font-bold mb-3">Menú</h3>
            <div>Cafés en Grano</div>
            <div>Accesorios</div>
            <div>Ofertas</div>
            <div>Novedades</div>
          </FooterList>
          <FooterList>
            <h3 className="text-base text-teal-500 font-bold mb-2">Servicio al Cliente</h3>
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
          <div className="mx-4 md:mx-8 flex-1 w-full md:w-auto mb-6 md:mb-0 text-center">
            <h3 className="text-base font-bold mb-2 text-teal-500">Sobre Nosotros</h3>
            <p className="mb-2">
              ¡Bienvenido a Café La Esmeralda, tu destino para los mejores cafés en grano y accesorios! Nos enfocamos en granos seleccionados y productos de alta calidad para ofrecerte una experiencia de café única. Disfruta de nuestra variedad de productos y ofertas hoy. ©2024 Café La Esmeralda. Todos los Derechos Reservados.
            </p>
            <p>
              &copy;{new Date().getFullYear()} Café La Esmeralda. Todos los derechos reservados
            </p>
          </div>
          <FooterList>
            <h3 className="text-base text-teal-500 font-bold mb-2">Síguenos</h3>
            <div className="flex gap-2">
              <Link href={"https://www.facebook.com/"}>
                <MdFacebook size={24} />
              </Link>
              <Link href={"https://twitter.com/"}>
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href={"https://www.instagram.com/"}>
                <AiFillInstagram size={24} />
              </Link>
              <Link href={"https://www.youtube.com/"}>
                <AiFillYoutube size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;