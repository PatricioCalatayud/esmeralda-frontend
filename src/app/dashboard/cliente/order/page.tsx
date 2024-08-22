"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { FcOk } from "react-icons/fc";
import Image from "next/image";
import { IUserProps } from "@/interfaces/IUser";
import { getOrders } from "@/helpers/Order.helper";
import { IOrders } from "@/interfaces/IOrders";
import { useAuthContext } from "@/context/auth.context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Spinner } from "@material-tailwind/react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<IOrders[] | undefined>([]);
  const { session, token, userId, authLoading } = useAuthContext();
  const [totalPages, setTotalPages] = useState(1);
console.log(orders);
  useEffect(() => {
    if (!authLoading) {
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
  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <Spinner
        color="teal"
        className="h-12 w-12"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      />
    </div>
  ) : (
    <DashboardComponent
      titleDashboard="Listado de Productos"
      searchBar="Buscar productos"
      handleSearchChange={handleSearchChange}
      totalPages={totalPages}
      tdTable={[
        "Fecha",
        "Cantidad",
        "Productos",
        "Total pagado",
        "Estado",
        
      ]}
      noContent="No hay Productos disponibles"
    >
      {orders?.map((order, index) => (
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
                {productOrder.quantity}
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
                  src={productOrder.product?.imgUrl}
                  alt={productOrder.product?.description}
                  className="w-10 h-10 inline-block mr-2 rounded-full"
                />
                <span>{productOrder.product?.description}</span>
              </div>
            ))}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            $ {order.orderDetail.totalPrice}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {order.orderDetail.transactions.map(
              (transaction, transactionIndex) => (
                <div key={transactionIndex} className={`flex items-center ${transaction.status === "Recibido" ? "text-teal-500" : "text-red-500"}`}>
                  <p>{transaction.status}</p>
                </div>
              )
            )}
          </td>
          
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default Dashboard;
