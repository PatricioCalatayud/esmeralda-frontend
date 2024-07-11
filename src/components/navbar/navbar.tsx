"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AiOutlineMenu, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa";
import { AiFillProduct, AiFillTag } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { MdHelp } from "react-icons/md";
import { Dropdown } from "flowbite-react";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hideNavbar = pathname === "/login";
  const [nav, setNav] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [userSesion, setUserSesion] = useState();
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleProductClick = () => {
    setSearchTerm("");
    setSearchResults(allProducts);
  };

  const handleNavLinkClick = () => {
    setNav(false);
  };

  if (hideNavbar) {
    return null;
  }

  return (
    <header className="relative text-gray-600 body-font">
      <div className="relative z-10 container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <AiOutlineMenu
            onClick={() => setNav(!nav)}
            size={30}
            className="mr-2 cursor-pointer"
          />
          <Link href="/home" className="flex items-center text-gray-900">
            <div className="w-20 h-25 text-white p-2">
              <img
                src="/esmeraldaLogosolo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/sobre-la-esmeralda" className="mr-5 hover:text-gray-900">Sobre la Esmeralda</Link>
          <Link href="/mision" className="mr-5 hover:text-gray-900">Misión</Link>
          <Link href="/historia" className="mr-5 hover:text-gray-900">Historia</Link>
          <Link href="/locales" className="mr-5 hover:text-gray-900">Locales</Link>
          <Link href="/tienda-online" className="mr-5 hover:text-gray-900">Tienda Online</Link>
          <Link href="/nosotros" className="mr-5 hover:text-gray-900">Nosotros</Link>
        </nav>
        <div className="relative flex items-center w-full md:w-auto justify-between md:justify-start space-x-2">
          <input
            className="bg-gray-200 rounded-full pl-8 pr-4 py-1 focus:outline-none"
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AiOutlineSearch size={20} className="absolute left-2 text-gray-600" />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/cart")}
            className="text-teal-700 flex items-center p-2 rounded-full relative"
          >
            <FaCartPlus size={30} />
            {cartItemCount > 0 && (
              <span className="bg-teal-800 rounded-full w-6 h-6 flex items-center justify-center text-white absolute -top-1 -right-1">
                {cartItemCount}
              </span>
            )}
          </button>
          {!userSesion && (
            <Link href="/login">
              <button className="text-gray-900 font-bold">Iniciar Sesion</button>
            </Link>
          )}
          {userSesion && (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Image
                  src={"/perfil.png"}
                  alt="imagen"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  User
                </span>
                <span className="block truncate text-sm font-medium">
                  User@hotmail.com
                </span>
              </Dropdown.Header>
              <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
              <Dropdown.Item>Salir</Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </div>
      {searchResults.length > 0 && searchTerm && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-white shadow-md">
          {searchResults.map((product: any) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              onClick={handleProductClick}
            >
              <div className="flex items-center p-2 border-b border-gray-200">
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover mr-2"
                />
                <p className="text-gray-800">{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {nav && (
        <div
          className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"
          onClick={() => setNav(false)}
        ></div>
      )}

      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-20 duration-300"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-20 duration-300"
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer dark:text-black"
        />
        <h2 className="text-2xl p-4 dark:text-black">
          La <span className="font-bold">Esmeralda Cafe</span>
        </h2>
        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            <li className="text-xl py-4 flex">
              <TbTruckDelivery size={25} className="mr-4" />
              <Link
                href="/tracking"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Envios
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <FaHome size={25} className="mr-4" />
              <Link
                href="/"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Inicio
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <AiFillProduct size={25} className="mr-4" />
              <Link
                href="/product"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Productos
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <AiFillTag size={25} className="mr-4" />
              <Link
                href="/home"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Promociones
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <FaCartPlus size={25} className="mr-4" />
              <Link
                href="/cart"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Carrito
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <MdHelp size={25} className="mr-4" />
              <Link
                href="/aboutus"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Nosotros
              </Link>
            </li>
            <li className="text-xl py-4 flex">
              <MdHelp size={25} className="mr-4" />
              <Link
                href="/ayuda"
                className="hover:text-orange-400"
                onClick={handleNavLinkClick}
              >
                Ayuda
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full h-40 overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute left-0 top-0 w-20 h-20 bg-hamburger bg-contain bg-no-repeat animate-bounce"></div>
            <div className="absolute left-1/3 top-0 w-20 h-20 bg-fries bg-contain bg-no-repeat animate-bounce delay-150"></div>
            <div className="absolute left-2/3 top-0 w-20 h-20 bg-delivery bg-contain bg-no-repeat animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;