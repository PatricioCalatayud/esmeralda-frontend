"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { IoHome, IoSearchSharp } from "react-icons/io5";
import { MdBorderColor } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import { FcOk } from "react-icons/fc";
import Image from "next/image";
import { IUserProps } from "@/interfaces/IUser";
import {  getOrders } from "@/helpers/Order.helper";
import { IOrders } from "@/interfaces/IOrders";
import { useAuthContext } from "@/context/auth.context";
import { Pagination } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Spinner } from "@material-tailwind/react";

const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<IOrders[] | undefined>([]);
  const {session, token, userId, authLoading} = useAuthContext();
  

  useEffect(() => {
    if (!authLoading) {;
      if (!session) {
        console.log("Session no exists:");
        redirect("/login");
      }
    }
  }, [authLoading, session]);
  
  useEffect(() => {
    const listOrders = async (userId: string) => {
      try {
        const data = await getOrders(userId, token);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    if (userId && token) {
      listOrders(userId);
    }
  }, [userId, token]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner
      color="teal"
      className="h-12 w-12"
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
      </div>
    );
  }
//! Función para manejar el cambio en el campo de búsqueda
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log("handleSearchChange", e.target.value);
};
  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
    <div className="mx-auto max-w-screen-2xl px-1 lg:px-2 ">
      <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
          <div className="flex-1 flex items-center space-x-2">
                <h5 className="text-teal-400">Historial de Ordenes
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
                    <IoSearchSharp/>
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
                <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 border-y-2 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        Fecha
                      </th>
                      <th scope="col" className="p-4">
                        Cantidad
                      </th>
                      <th scope="col" className="p-4">
                        Productos
                      </th>
                      <th scope="col" className="p-4">
                        Estado
                      </th>
                      <th scope="col" className="p-4">
                        Total pagado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders?.length > 0 ? (
                      orders?.map((order, index) => (
                        <tr
                          key={index}
                          className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {format(new Date(order.date), "dd'-'MM'-'yyyy", {
                locale: es,
              })}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {order.productsOrder.map((productOrder, productIndex) => (
                              <div key={productIndex} className="my-8 text-center">
                                {productOrder.cantidad}
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {order.productsOrder.map((productOrder, productIndex) => (
                              <div key={productIndex} className="mb-2 text-start">
                                <Image
                                  width={500}
                                  height={500}
                                  priority={true}
                                  src={productOrder.product.imgUrl}
                                  alt={productOrder.product.description}
                                  className="w-10 h-10 inline-block mr-2 rounded-full"
                                />
                                <span>{productOrder.product.description}</span>
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {order.orderDetail.transactions.map((transaction, transactionIndex) => (
                              <div key={transactionIndex} className="flex items-center">
                                <FcOk className="mr-2" />
                                <p>{transaction.status}</p>
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            ${order.orderDetail.totalPrice}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          No hay órdenes disponibles.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex overflow-x-auto sm:justify-center py-5 ">
              <Pagination count={10} shape="rounded" />
              </div>
          </div>
        </div>
    </section>
  );
};

export default Dashboard;