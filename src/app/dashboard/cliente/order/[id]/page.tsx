"use client";
import TrackingComponent1 from "@/components/TrackingComponent/TrackingComponent";
import { useAuthContext } from "@/context/auth.context";
import { getOrder } from "@/helpers/Order.helper";
import { IOrders } from "@/interfaces/IOrders";
import { Spinner } from "@material-tailwind/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

const Tracking = ({ params }: { params: { id: string } }) => {
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<IOrders | null>(null); // Tipado correcto

  useEffect(() => {
    async function fetchOrder() {
      try {
        const fetchedOrder = await getOrder(params.id, token);
        setOrder(fetchedOrder as IOrders); // Establecer el estado con el pedido
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id, token]);

  const statusDefault = ["Recibido", "Empaquetado", "Transito", "Entregado"];
  console.log(order);
  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <Spinner
        color="teal"
        className="h-12 w-12"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      />
    </div>
  ) : order && order.orderDetail && order.orderDetail.transactions[0].status ? (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="mx-auto max-w-screen-2xl px-1 lg:px-2 ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">
                Detalle de envio
              </h5>
            </div>
          </div>
          <div className="overflow-x-auto flex flex-col p-4 gap-2">
            <div className="w-full flex items-center flex-col">
              <div className="w-full flex flex-col gap-4 items-center">
                <h2 className="text-xl font-medium ">Tu pedido:</h2>
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
              </div>
              <h4>
                Tu orden fue realizada el{" "}
                {format(new Date(order.date), "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </h4>
              <p></p>
            </div>
            <div className="w-full flex justify-start items-center py-20">
              <div className="flex gap-4">
                <TrackingComponent1
                  statusBack={order.orderDetail.transactions[0].status}
                  height={400}
                  width={100}
                />
                <div className="flex flex-col justify-between h-[400px] py-2">
                  {statusDefault.map((status, index) => (
                    <div key={index} className="flex gap-4">
                      <h1
                        className={`text-xl w-40 ${
                          order.orderDetail.transactions[0].status === status
                            ? "text-teal-800 font-bold"
                            : "text-gray-500 font-medium"
                        }`}
                      >
                        {status}
                      </h1>
                      <div className="w-1/2 text-center ">
                      {status === order.orderDetail.transactions[0].status &&
                      status === "Recibido" ? (
                       
                          <p>
                            El local confirmo tu pedido, la fecha de entrega es:{" "}
                            <b className="font-bold">
                              {format(
                                new Date(order.orderDetail.deliveryDate),
                                "d 'de' MMMM 'de' yyyy",
                                {
                                  locale: es,
                                }
                              )}
                            </b>
                          </p>
                        
                      ) : null}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start w-full items-center border-t-gray-300 border h-20 px-10 bg-gray-100">
            <Link
              href={"/dashboard/cliente/order"}
              className="w-full justify-center sm:w-auto text-red-500 inline-flex items-center hover:bg-gray-100 bg-white focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              <FaArrowLeft />
              &nbsp; Volver
            </Link>
          </div>
        </div>
      </div>
    </section>
  ) : null;
};

export default Tracking;
