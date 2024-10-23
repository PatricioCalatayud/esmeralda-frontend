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
  keywords:"café, café premium, tienda de café, café en línea, granos de café, La Esmeralda, café gourmet, café orgánico, comprar café",
  authors: [{ name: "La Esmeralda" }],
  openGraph: {
    title: "La Esmeralda",
    description: "Descubre los mejores granos de cafe en La Esmeralda. Tu tienda en línea de cafe premium, con una selección exclusiva de los mejores cafees del mundo.",
    url: "http://www.cafelaesmeralda.com.ar",
    siteName: "La Esmeralda",
    images: [
      {
        url: "https://img.freepik.com/vector-gratis/fondo-cafe-realista-dibujos_157027-1115.jpg?t=st=1729018210~exp=1729021810~hmac=ee1ed0a5a88ef8691138c444cb827ce8116bed57f9e05b9c7c451ae22fe7ee16&w=1380",
        width: 800,
        height: 600,
      },
    ],
    locale: "es-AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "La Esmeralda",
    description: "Descubre los mejores granos de cafe en La Esmeralda. Tu tienda en línea de cafe premium, con una selección exclusiva de los mejores cafees del mundo.",
    creator: "@cafelaesmeralda",
    images: [
      {
        url: "https://img.freepik.com/vector-gratis/fondo-cafe-realista-dibujos_157027-1115.jpg?t=st=1729018210~exp=1729021810~hmac=ee1ed0a5a88ef8691138c444cb827ce8116bed57f9e05b9c7c451ae22fe7ee16&w=1380",
        width: 800,
        height: 600,
      },
    ],
  },
  icons: {
    shortcut: "/LogoCafe.png",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "La Esmeralda Cafe",
    "url": "http://www.cafelaesmeralda.com.ar",
    "logo": "/LogoCafe.png",
    "sameAs": [
      "https://www.instagram.com/cafelaesmeralda/",
      "https://www.facebook.com/cafelaesmeralda10/"
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
  };

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/cafe.ico" />

	 {/* Canonical URL*/}
    <link rel="canonical" href="http://www.cafelaesmeralda.com.ar" />

   <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    

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
