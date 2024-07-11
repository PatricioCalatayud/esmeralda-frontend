"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaUsersCog } from 'react-icons/fa';
import { GiSettingsKnobs } from 'react-icons/gi';
import { HiChartBar, HiClipboardList } from 'react-icons/hi';
import { SiAzureartifacts } from 'react-icons/si';
import { TbCategoryPlus, TbLogout } from 'react-icons/tb';

const DashboardAdmin = () => {
//const [token, setToken] = useState<userSession>();
  const [view, setView] = useState<string>("modifyProducts"); // Estado para la vista actual, por defecto "pedidos"
  const router = useRouter();

//   useEffect(() => {
//     if (typeof window !== "undefined" && window.localStorage) {
//       const userToken = localStorage.getItem("userSession");

//       if (userToken) {
//         const parsedToken = JSON.parse(userToken);

//         try {
//           const decodedToken = jwtDecode(parsedToken.userData.token) as {
//             isAdmin: boolean;
//             isSuperAdmin: boolean;
//           };

//           if (!decodedToken.isAdmin && !decodedToken.isSuperAdmin) {
//             // Si no es admin o superadmin, redirigir a home
//             router.push("/home");
//           } else {
//             // Si es admin o superadmin, guardar el token en el estado
//             setToken(parsedToken);
//           }
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           router.push("/home"); // En caso de error decodificando, redirigir a home
//         }
//       } else {
//         router.push("/home"); // Si no hay token, redirigir a home
//       }
//     }
//   }, [router]);

//   if (!token) {
//     return null; // Puedes mostrar un loader o similar mientras se verifica el token
//   }
  return (

<div className="flex flex-row min-h-screen dark:bg-gray-700">
      {/* Barra lateral */}
      <div className="bg-black text-green-800 w-36 md:w-52">
        <div className="p-1 md:p-4">
          <p className="text-xl text-white font-semibold mb-4 flex items-center">
            <GiSettingsKnobs /> &nbsp;Dashboard
          </p>
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setView("modifyProducts")}
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-gray-100 w-full text-left"
              >
                <SiAzureartifacts /> &nbsp; Productos
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setView("pedidos")}
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-gray-100 w-full text-left"
              >
                <HiClipboardList /> &nbsp; Pedidos
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setView("categories")}
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-gray-100 w-full text-left"
              >
                <TbCategoryPlus /> &nbsp; Categorías
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setView("topVentas")}
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-gray-100 w-full text-left"
              >
                <HiChartBar /> &nbsp; Ventas
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setView("users")}
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-gray-100 w-full text-left"
              >
                <FaUsersCog /> &nbsp; Usuarios
              </button>
              <li className="mb-2 text-yellow-300">
                <button
                  onClick={() => setView("users")}
                  className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-red-700 w-full text-left"
                >
                  <TbLogout className="text-white" /> &nbsp; Salir
                </button>
              </li>
            </li>
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
            {/* <p>
              <b>Nombre:</b> {token?.userData.data.name}
            </p>
            <p>
              <b>Email:</b> {token?.userData.data.email}
            </p>
            <p>
              <b>Teléfono:</b> {token?.userData.data.phone}
            </p>
            <p>
              <b>Dirección:</b> {token?.userData.data.address}
            </p>
            <p>
              <b>País:</b> {token?.userData.data.country}
            </p>
            <p>
              <b>Ciudad:</b> {token?.userData.data.city}
            </p> */}
          </div>
        </div>
        <div className="p-1 md:p-4 flex flex-col flex-1">
          {view === "modifyProducts" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Modificar Producto</h2>
              {/* <ProductList /> */}
            </div>
          )}

          {view === "pedidos" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Pedidos</h2>
              {/* <PedidosList /> */}
            </div>
          )}

          {view === "categories" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Modificar Categoría
              </h2>
              {/* <CategoriesList /> */}
            </div>
          )}

          {view === "topVentas" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Top Ventas</h2>
              {/* <TopVentas /> */}
            </div>
          )}
          {view === "users" && (
            <div>
              <h2 className="text-lg font-semibold mb-2"></h2>
              {/* <UserRol /> */}
            </div>
          )}
        </div>
      </div>
    </div>
    
  )
}

export default DashboardAdmin