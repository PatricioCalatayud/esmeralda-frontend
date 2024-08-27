"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { IOrders } from "@/interfaces/IOrders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Spinner } from "@material-tailwind/react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";
import { getAllOrders, putOrder } from "@/helpers/Order.helper";

const OrderList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const ORDERS_PER_PAGE = 5;
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("");

  //! Obtener token de usuario
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userSessionString = localStorage.getItem("userSession");
      if (userSessionString) {
        const userSession = JSON.parse(userSessionString);
        const accessToken = userSession.accessToken;
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
      const limit = ORDERS_PER_PAGE;
      const page = currentPage;
      if (token) {
        const response = await getAllOrders(token );
        if (response) {
        const orders = response;

        setOrders(orders);
        setTotalPages(Math.ceil(orders.length / ORDERS_PER_PAGE));
        setLoading(false);}
      }
        
    }
    if (token) {
      fetchOrders();
    }
  }, [token]);
  const onPageChange = (page: number) => setCurrentPage(page);


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
      console.log(orders);
      return orders;
    } else {
      return orders.filter((order) =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  //! Función para manejar el cambio en el estado de la orden
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    const newStatus = e.target.value;
    setDataStatus(newStatus);
    try {
      const response = await putOrder(id, newStatus, token as string);
      console.log("response", response);
      Swal.fire("¡Éxito!", "El estado de la orden ha sido actualizado.", "success");
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
    }
  };

  //! Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <Spinner color="teal" className="h-12 w-12" onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}/>
    </div>
  ) : (
    <DashboardComponent
    setCurrentPage={onPageChange}
      titleDashboard="Listado de Ordenes"
      searchBar="Buscar cliente"
      handleSearchChange={handleSearchChange}
      totalPages={totalPages}
      tdTable={[
        "Cliente",
        "Fecha",
        "Precio",
        "Fecha de entrega",
        "Total",
        "Estado",
      ]}
      noContent="No hay Ordenes disponibles"
    >
      {getCurrentPageOrders().map((order: IOrders) => (
        <tr
          key={order.id}
          className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <th
            scope="row"
            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            <div className="flex items-center w-full justify-center">{order.user?.name}</div>
          </th>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            <div className="flex justify-center items-center">
              {order.date && format(new Date(order.date), "dd'-'MM'-'yyyy", {
                locale: es,
              })}
            </div>
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {order.orderDetail?.totalPrice}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {order.orderDetail?.deliveryDate && format(new Date(order.orderDetail?.deliveryDate), "dd'-'MM'-'yyyy", {
              locale: es,
            })}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            $ {order.orderDetail?.totalPrice}
          </td>
          <td
            className={`px-4 py-3 font-medium  whitespace-nowrap  text-center ${
              order.orderDetail?.transactions.status === "Recibido"
                ? "text-teal-500"
                : "text-red-500"
            } `}
          >
            {order.orderDetail?.transactions.status === "Recibido" ? (
              <select
                id="status"
                name="status"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => handleChange(e, order.id)}
              >
                <option value="">--Seleccione--</option>
                <option value={"Recibido"}>Recibido</option>
                <option value={"Empaquetado"}>Empaquetado</option>
                <option value={"Transito"}>Transito</option>
                <option value={"Entregado"}>Entregado</option>
              </select>
            ) : (
              order.orderDetail?.transactions?.status
            )}
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default OrderList;
