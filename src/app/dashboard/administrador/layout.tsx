"use client";
import Link from "next/link";
import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { useAuthContext } from "@/context/auth.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";

const links = [
  {
    name: "Perfil",
    href: "/dashboard/administrador/profile",
    hrefActive: "/dashboard/administrador/profile",
  },
  {
    name: "Producto",
    href: "/dashboard/administrador/product",
    hrefActive: "/dashboard/administrador/product",
  },
  {
    name: "Ordenes",
    href: "/dashboard/administrador/order",
    hrefActive: "/dashboard/administrador/order",
  },
  {
    name: "Usuarios",
    href: "/dashboard/administrador/users",
    hrefActive: "/dashboard/administrador/users",
  },
  {
    name: "Metricas",
    href: "/dashboard/administrador/metricas",
    hrefActive: "/dashboard/administrador/metricas",
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { session, authLoading } = useAuthContext();

  //! Obtener token de usuario-Session
  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        redirect("/login");
      }
    }
  }, [authLoading, session]);

  return (
    <>
      <div className="flex lg:flex-row min-h-screen dark:bg-gray-700 flex-col">
        {/* Barra lateral */}
        <div className="bg-teal-800 backdrop:w-36 lg:w-80 m-4 rounded-2xl shadow-2xl animate-fade-in-up ">
          <div className="p-4">
            <p className="text-xl text-white font-semibold mb-4 flex items-center text-center p-2">
              <FontAwesomeIcon
                icon={faScrewdriverWrench}
                style={{  marginRight: "10px",
                  width: "20px",
                  height: "20px",
                  transition: "none"}}
              />{" "}
              Panel de control
            </p>
            <ul className="space-y-2 pb-2 ">
              {links.map((link) => {
                const isActive = pathname === link.hrefActive;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-base capitalize font-normal rounded-lg flex items-center p-2 hover:font-bold hover:text-gray-100 group ${
                        isActive
                          ? "text-white  border-white border"
                          : "text-white"
                      }`}
                    >
                      <span className="ml-3">{link.name}</span>
                      
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          <main>
            <div className="w-full p-4">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
