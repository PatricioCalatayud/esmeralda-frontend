"use client";
import Link from "next/link";
import { useEffect } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import { redirect } from "next/navigation";
import { useAuthContext } from "@/context/auth.context";

const links = [
  { name: "Producto", href: "../../dashboard/product" },
  { name: "Ordenes", href: "../../dashboard/order" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, authLoading } = useAuthContext();


  //! Obtener token de usuario-Session
  useEffect(() => {
    if (!authLoading) {;
      if (!session) {
        console.log("Session no exists:");
        redirect("/login");
      }
    }
  }, [authLoading, session]);

  return (
    <>
      <div className="flex flex-row min-h-screen dark:bg-gray-700">
        {/* Barra lateral */}
        <div className="bg-teal-800 backdrop:w-36 md:w-52">
          <div className="p-1 md:p-4">
            <p className="text-xl text-white font-semibold mb-4 flex items-center">
              <GiSettingsKnobs /> &nbsp;Dashboard
            </p>
            <ul className="space-y-2 pb-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base capitalize text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                  >
                    <span className="ml-3">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          {/* Barra de navegación */}
          <div className="bg-gray-200 p-1 md:p-4 dark:bg-gray-600">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">
              Bienvenido usuario Administrador
            </h2>
            <div className="bg-gray-50 p-4 rounded shadow dark:bg-gray-300">
              {/* Aquí irían los datos del usuario */}
              <p>
                <b>Nombre:</b> {session?.name}
              </p>
              <p>
                <b>Email:</b> {session?.email}
              </p>
              <p>
                <b>Telefono:</b> {session?.phone}
              </p>
              <p>
                <b>Rol:</b> {session?.role}
              </p>
            </div>
          </div>
          <div className="p-1 md:p-1 flex flex-col flex-1">
            <main>
              <div className="pt-1 px-1">
                <div className="w-full min-h-[calc(100vh-230px)]">
                  <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                    {children}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}