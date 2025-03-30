"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getOrders } from "@/helpers/Order.helper";
import { IOrders } from "@/interfaces/IOrders";
import { useAuthContext } from "@/context/auth.context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Spinner } from "@material-tailwind/react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheck,
  faTruck,
  faMagnifyingGlassPlus,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<IOrders[] | undefined>([]);
  const { session, token, userId, authLoading } = useAuthContext();
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<IOrders | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(orders);

  useEffect(() => {
    const listOrders = async (userId: string) => {
      try {
        const data = await getOrders(userId, token);
        if (data) {
          setOrders(data.data);
        }
        console.log(data)
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userId && token) {
      listOrders(userId);
    }
  }, [userId, token]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (order: IOrders) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

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

  console.log("orders", orders);
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
      titleDashboard="Listado de Ordenes"
      searchBar="Buscar ordenes"
      handleSearchChange={handleSearchChange}
      totalPages={totalPages}
      tdTable={[
        "Fecha",
        "Cantidad",
        "Productos",
        "Total",
        "Estado",
        "Acciones",
      ]}
      noContent="No hay ordenes disponibles"
    >
      {orders?.map((order, index) => (
        <tr
          key={index}
          className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {format(new Date(order.create), "dd'-'MM'-'yyyy", {
              locale: es,
            })}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {order.productsOrder && order.productsOrder.length > 0 && (
              <div className="text-center">
                {order.productsOrder[0].quantity || 0}
              </div>
            )}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {order.productsOrder && order.productsOrder.length > 0 && (
              <div className="mb-2 text-start flex items-center">
                <Image
                  width={500}
                  height={500}
                  priority={true}
                  src={
                    order.productsOrder[0].subproduct.product
                      ? `${apiURL}/product/${order.productsOrder[0].subproduct?.product.imgUrl}`
                      : ""
                  }
                  alt={
                    order.productsOrder[0].subproduct.product
                      ? order.productsOrder[0].subproduct?.product.description
                      : ""
                  }
                  className="w-10 h-10 inline-block mr-2 rounded-full"
                />
                <div className="flex flex-row gap-1 justify-between w-4/5 items-center">
                  <div>
                    <span>
                      {order.productsOrder[0].subproduct.product &&
                        order.productsOrder[0].subproduct?.product.description}
                    </span>
                    <span> x {order.productsOrder[0].subproduct?.amount}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    {order.productsOrder.length > 1 && (
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="ml-2 p-2 text-white"
                      >
                        <FontAwesomeIcon
                          icon={faMagnifyingGlassPlus}
                          color="teal"
                          size="lg"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {isModalOpen && selectedOrder && (
              <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    Productos de la orden
                  </h3>
                  {selectedOrder.productsOrder.map((product, idx) => (
                    <div key={idx} className="mb-4 flex items-center">
                      <Image
                        width={500}
                        height={500}
                        priority={true}
                        src={`${apiURL}/product/${product?.subproduct?.product?.imgUrl}`}
                        alt={product?.subproduct?.product?.description ?? ""}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div className="flex flex-col text-start">
                        <p className="font-medium">
                          {product?.subproduct?.product?.description}
                        </p>
                        <p>Cantidad: x {product?.subproduct?.amount}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            $ {order.orderDetail.totalPrice}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {session?.role === "Usuario" &&
              order.orderDetail.transactions.status === "Pendiente de pago" && (
                <div
                  className={`flex items-center justify-center ${
                    order.orderDetail.transactions.status !==
                    "Pendiente de pago"
                      ? "text-teal-500"
                      : "text-red-500"
                  }`}
                >
                  <p>{order.orderDetail.transactions.status}</p>
                </div>
              )}
            {session?.role === "Cliente" &&
              order.orderDetail.transactions.status === "Pendiente de pago" &&
              order?.receipt?.status !==
                "Pendiente de revisión de comprobante" &&
              order?.receipt?.status !== "Rechazado" && (
                <div
                  className={`flex items-center justify-center ${
                    order.orderDetail.transactions.status !==
                    "Pendiente de pago"
                      ? "text-teal-500"
                      : "text-red-500"
                  }`}
                >
                  <p>{order.orderDetail.transactions.status}</p>
                </div>
              )}
            {session?.role === "Cliente" &&
              order.orderDetail.transactions.status === "Pendiente de pago" &&
              order?.receipt?.status ===
                "Pendiente de revisión de comprobante" && (
                <div
                  className={`flex items-center justify-center text-teal-500`}
                >
                  <p>{order?.receipt?.status}</p>
                </div>
              )}
            {session?.role === "Cliente" &&
              order.orderDetail.transactions.status === "Pendiente de pago" &&
              order?.receipt?.status === "Rechazado" && (
                <div
                  className={`flex items-center justify-center text-red-500`}
                >
                  <p>{order?.receipt?.status}</p>
                </div>
              )}
            {session?.role === "Cliente" &&
              order.orderDetail.transactions.status !== "Pendiente de pago" &&
              order?.receipt?.status === "Comprobante verificado" && (
                <div
                  className={`flex items-center justify-center text-teal-500`}
                >
                  <p>{order.orderDetail.transactions.status}</p>
                </div>
              )}
          </td>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {order.orderDetail.transactions.status !== "Pendiente de pago" && (
              <Link
                type="button"
                data-drawer-target="drawer-update-product"
                data-drawer-show="drawer-update-product"
                aria-controls="drawer-update-product"
                className="py-2 px-3 w-min flex gap-2 items-center text-sm hover:text-white font-medium text-center text-white bg-teal-600 border rounded-lg hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                href={`/dashboard/cliente/order/${order.id}`}
              >
                <FontAwesomeIcon icon={faTruck} />
                Ver detalle
              </Link>
            )}
            {session?.role === "Cliente" &&
              order.orderDetail.transactions.status === "Pendiente de pago" &&
              (order?.receipt?.status === "Pendiente de subir comprobante" ||
                order?.receipt?.status === "Rechazado") && (
                <Link
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 w-min flex gap-2 items-center text-sm hover:text-white font-medium text-center text-white bg-teal-600 border rounded-lg hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  href={`/transfer/${order.id}`}
                >
                  <FontAwesomeIcon icon={faMoneyCheck} />
                  Ir a pagar
                </Link>
              )}
            {session?.role === "Usuario" &&
              order.orderDetail.transactions.status === "Pendiente de pago" && (
                <Link
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 w-min flex gap-2 items-center text-sm hover:text-white font-medium text-center text-white bg-teal-600 border rounded-lg hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  href={`/checkout/${order.id}`}
                >
                  <FontAwesomeIcon icon={faMoneyCheck} />
                  Ir a pagar
                </Link>
              )}
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default Dashboard;
