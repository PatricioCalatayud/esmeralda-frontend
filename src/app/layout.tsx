import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/Footer";
import { ProductProvider } from "@/context/product.context";
import { AuthProvider } from "@/context/auth.context";
import { CartProvider } from "@/context/cart.context";
import { CategoryProvider } from "@/context/categories.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import ChatBotEsmeralda from "@/components/ChatBot/ChatBot";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "La Esmeralda",
  description: "Descubre los mejores granos de café en La Esmeralda. Tu tienda en línea de café premium, con una selección exclusiva de los mejores cafés del mundo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/cafe.ico" />
       {/* Open Graph Meta Tags */}
    <meta
      property="og:title"
      content="La Esmeralda Café"
    />
    <meta
      property="og:description"
      content="Descubre los mejores granos de café en La Esmeralda. Tu tienda en línea de café premium, con una selección exclusiva de los mejores cafés del mundo."
    />
    <meta
      property="og:image"
      content="/LogoCafe.png"
    />
    <meta property="og:url" content="http://www.cafelaesmeralda.com.ar" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="La Esmeralda Cafe" />

    {/*  Twitter Card Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="La Esmeralda Café"
    />
    <meta
      name="twitter:description"
      content="Descubre los mejores granos de café en La Esmeralda. Tu tienda en línea de café premium, con una selección exclusiva de los mejores cafés del mundo."
    />
    <meta
      name="twitter:image"
      content="/LogoCafe.png"
    />
    <meta name="twitter:site" content="@JupiterDesign" />
	 {/* Canonical URL */}
    <link rel="canonical" href="http://www.cafelaesmeralda.com.ar" />
	{/* Schema */}
  <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "La Esmeralda Cafe",
            "url": "http://www.cafelaesmeralda.com.ar",
            "logo": "/LogoCafe.png",
            "sameAs": [
              "https://www.instagram.com/jupiterrdesign_/",
              "https://www.linkedin.com/company/104610019/admin/inbox/"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+54 - 1158803709",
              "contactType": "Customer Service",
              "areaServed": "Worldwide",
              "availableLanguage": ["Spanish"]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Dr Juan Felipe Aranguren 1528",
              "addressLocality": "Caballito",
              "addressRegion": "Buenos Aires",
              "postalCode": "1406",
              "addressCountry": "AR"
            },
            "description": "Descubre los mejores granos de café en La Esmeralda. Tu tienda en línea de café premium, con una selección exclusiva de los mejores cafés del mundo."
          }`}
        </script> 
        <meta charSet="UTF-8" />
    <meta
      name="keywords"
      content="café, café premium, tienda de café, café en línea, granos de café, La Esmeralda, café gourmet, café orgánico, comprar café"
    />
    <meta name="author" content="La Esmeralda Café" />
      </head>
      <body className={`${inter.className} h-min-screen`}>
      <CartProvider>
        <AuthProvider>
          <CategoryProvider>
            <ProductProvider>
                <Navbar />
                {children}
                <div className="fixed bottom-5 right-6 z-50">

                <ChatBotEsmeralda/>
                </div>       
                <Footer />
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
