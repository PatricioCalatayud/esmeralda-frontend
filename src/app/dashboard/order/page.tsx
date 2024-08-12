"use client";
import { MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { RiDeleteBin6Fill, RiAddLargeFill } from "react-icons/ri";
import { Pagination, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IProductList } from "@/interfaces/IProductList";
import { IOrders } from "@/interfaces/IOrders";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const OrderList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const ORDERS_PER_PAGE = 10; // Cantidad de productos por página
  const [loading, setLoading] = useState(true);

  //! Obtener token de usuario
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userSessionString = localStorage.getItem("userSession");
      if (userSessionString) {
        const userSession = JSON.parse(userSessionString);
        const accessToken = userSession.accessToken; // Access the accessToken correctly
        console.log("userToken", accessToken);
        setToken(accessToken);
      } else {
        Swal.fire(
          "¡Error!",
          "Sesión de usuario no encontrada. Por favor, inicia sesión.",
          "error"
        ).then(() => {
          router.push("/login");
        });
      }
    }
  }, [router]);

  //! Obtener las Ordenes
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(`${apiURL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const orders = response.data;
        console.log("orders", orders);
        setOrders(orders);
        setTotalPages(Math.ceil(orders.length / ORDERS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire("¡Error!", "No se pudieron obtener las órdenes", "error");
      }
    }
    if (token) {
      fetchOrders();
    }
  }, [token]);

  //! Función para calcular las ordenes a mostrar en la página actual
  const getCurrentPageOrders = () => {
    const filteredOrders = filterOrders();
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  };

  //! Función para filtrar las ordenes
  const filterOrders = () => {
    if (searchTerm === "") {
      return orders; // Si el campo de búsqueda está vacío, mostrar todas las órdenes
    } else {
      return orders.filter((order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  //! Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Actualizar el estado del término de búsqueda
    setCurrentPage(1); // Reiniciar la página actual al cambiar el término de búsqueda
  };
  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="mx-auto max-w-screen-2xl px-1 lg:px-2 ">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-900">
            <div className="flex-1 flex items-center space-x-2">
              <h5>
                <span className="text-green-400">Listado de Ordenes</span>
              </h5>
            </div>
            <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3"></div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IoSearchSharp />
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    placeholder="Search for orders"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    Id
                  </th>
                  <th scope="col" className="p-4">
                    Fecha
                  </th>
                  <th scope="col" className="p-4">
                    Precio
                  </th>
                  <th scope="col" className="p-4">
                    F.Delivery
                  </th>
                  <th scope="col" className="p-4">
                    Total
                  </th>
                  <th scope="col" className="p-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageOrders().map((order: IOrders) => (
                  <tr
                    key={order.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="flex items-center">
                        {order.id}
                      </div>
                    </th>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex justify-center items-center">
                        {order.date}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {order.orderDetail.totalPrice}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {order.orderDetail.deliveryDate}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {order.orderDetail.totalPrice}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {order.orderDetail.transactions[0].status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex overflow-x-auto sm:justify-center py-5 bg-gray-900">
            <Pagination
              layout="pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              previousLabel="Anterior"
              nextLabel="Siguiente"
              showIcons
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderList;