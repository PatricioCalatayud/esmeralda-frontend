"use client";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import { useRouter, usePathname } from "next/navigation"
import Swal from "sweetalert2";

const links = [
  { name: "Producto", href: "../../dashboard/product" },
  { name: "Ordenes", href: "../../dashboard/order" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [view, setView] = useState<string>("modifyProducts");
  const [userSession, setUserSession] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userTelefono, setUserTelefono] = useState<string | null>(null);
  const router = useRouter();

  //! Obtener token de usuario-Session
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userSessionString = localStorage.getItem("userSession");
      if (userSessionString) {
        const userSession = JSON.parse(userSessionString);
        const accessToken = userSession.accessToken;
        setUserSession(accessToken);
        if (accessToken) {
          const decodedToken: any = jwtDecode(accessToken);
          if (decodedToken) {
            setUserEmail(decodedToken.email);
            setUserName(decodedToken.name);
            setUserRole(decodedToken.roles ? decodedToken.roles[0] : null);
            setUserTelefono(decodedToken.phone);
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Debes estar logueado para poder hacer un comentario",
          text: "Redirigiendo a la página de inicio de sesión...",
        }).then(() => {
          router.push("/login");
        });
      }
    }
  }, [router]);

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
                <b>Nombre:</b> {userName}
              </p>
              <p>
                <b>Email:</b> {userEmail}
              </p>
              <p>
                <b>Telefono:</b> {userTelefono}
              </p>
              <p>
                <b>Rol:</b> {userRole}
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