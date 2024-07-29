"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { IoHome } from "react-icons/io5";
import { MdBorderColor } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { FcOk } from "react-icons/fc";
import Spinner from "@/app/Spinner";
import {jwtDecode} from "jwt-decode"; // Importar jwt-decode

// Interfaces
interface User {
    id: string;
    name: string;
    email: string;
    isAvailable: boolean;
    isDeleted: boolean;
    password: string;
    phone: string;
    role: string;
}

interface UserData {
    success: string;
    accessToken: string;
    user: User;
}

interface Product {
    id: string;
    description: string;
    imgUrl: string;
    price: string;
    discount: string;
}

interface ProductsOrder {
    cantidad: number;
    product: Product;
}

interface Transaction {
    status: string;
    timestamp: string;
}

interface OrderDetail {
    deliveryDate: string;
    totalPrice: number;
    transactions: Transaction[];
}

interface Order {
    id: string;
    date: string;
    user: {
        id: string;
    };
    productsOrder: ProductsOrder[];
    orderDetail: OrderDetail;
}

interface userSession {
    userData: UserData;
}

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const Dashboard = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        const parsedSession = JSON.parse(userSession);
        const token = parsedSession.accessToken;
        const decodedToken: any = jwtDecode(token);
        setToken(token);
        setUserName(decodedToken.name);
        setUserEmail(decodedToken.email);
        setUserPhone(decodedToken.phone);
        setUserId(decodedToken.sub);
      } else {
        redirect("/login");
      }
    }
  }, []);

  const listOrders = async (userId: string): Promise<Order[]> => {
    try {
      const { data } = await axios.get(`${apiURL}/order/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: any) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    if (userId) {
      listOrders(userId).then(setOrders);
    }
  }, [userId]);

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
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen dark:bg-gray-700">
      <div className="bg-gray-900 text-teal-400 w-36 md:w-52">
        <div className="p-1 md:p-4">
          <h2 className="text-xl text-white font-semibold mb-4">Dashboard</h2>
          <ul>
            <li className="mb-2">
              <a
                href="/dashboard"
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-gray-700"
              >
                <MdBorderColor /> &nbsp; Órdenes
              </a>
            </li>
            <li className="mb-2">
              <Link
                href="/categories"
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-teal-700"
              >
                <IoHome /> &nbsp; Ir a la tienda
              </Link>
            </li>
            <li className="mb-2">
              <a
                href="/cart"
                className="flex flex-row items-center py-2 md:px-4 rounded hover:bg-teal-700"
              >
                <FaCartPlus />
                &nbsp; Carrito
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 antialiased h-screen">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 bg-gray-900">
              <div className="flex-1 flex items-center space-x-2">
                <h5>
                  <span className="text-teal-400">Datos de Usuario</span>
                </h5>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 dark:bg-gray-300 p-4 rounded shadow mb-4">
                <p>
                  <b>Nombre:</b> {userName}
                </p>
                <p>
                  <b>Email:</b> {userEmail}
                </p>
                <p>
                  <b>Teléfono:</b> {userPhone}
                </p>
                {/* Agrega más campos si es necesario */}
              </div>
              <h2 className="text-lg font-semibold mb-2 dark:text-white">
                Historial de Ordenes
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
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
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr
                          key={index}
                          className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {formatDate(order.date)}
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
                                <img
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;