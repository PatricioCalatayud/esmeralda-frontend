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
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDownload, faEdit, faX } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "flowbite-react";

const apiURL = process.env.NEXT_PUBLIC_API_URL;
const ORDERS_PER_PAGE = 7;

const OrderList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(true);

  //! Obtener las Ordenes
  useEffect(() => {
    async function fetchOrders() {
      if (token) {
        const response: IOrders[] | undefined = await getAllOrders(token);
        if (response) {
          setOrders(response);
          setTotalPages(Math.ceil(response.length / ORDERS_PER_PAGE));
        } else {
          setOrders([]);
        }
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  const onPageChange = (page: number) => setCurrentPage(page);

  //! Función para calcular las órdenes a mostrar en la página actual
  const getCurrentPageOrders = () => {
    const filteredOrders = filterOrders();
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  };

  //! Función para filtrar las órdenes
  const filterOrders = () => {
    if (searchTerm === "") {
      return orders;
    } else {
      return orders.filter((order) =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  //! Función para manejar el cambio en el estado de la orden
  const handleChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const newStatus = { status: e.target.value };
    const response = await putOrder(id, newStatus, token as string);
    if (response && (response?.status === 200 || response?.status === 201)) {
      Swal.fire("¡Éxito!", "El estado de la orden ha sido actualizado.", "success");
    } else {
      console.error("Error updating order:", response);
      Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
    }
  };

  //! Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  //! Función para subir archivo
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    orderId: string,
    userEmail: string,
    billId: string | undefined
  ) => {
    if (billId === undefined) {
      billId = "default-id";  // Asignamos un valor por defecto en caso de que sea 'undefined'
    }
  
    const file = e.target.files?.[0];
    if (file && billId) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("to", userEmail);
      formData.append("id", billId);
  
      const response = await fetch(`${apiURL}/image/bill`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        Swal.fire("¡Archivo subido!", "El archivo ha sido subido correctamente.", "success");
  
        const updatedOrders = orders.map((order) => {
          if (order.id === orderId && order.bill) {
            return {
              ...order,
              bill: {
                ...order.bill,
                imgUrl: URL.createObjectURL(file),
                id: order.bill.id || billId,  // Garantizamos que 'id' sea string
              },
            } as IOrders;
          }
          return order;
        });
  
        setOrders(updatedOrders);
      } else {
        Swal.fire("¡Error!", `Error: ${response.status} - ${response.statusText}`, "error");
      }
    }
  };

  //! Función para eliminar archivo
  const handleDeleteFile = async (orderId: string, userEmail: string, billId: string | undefined) => {
    if (!billId) {
      Swal.fire("¡Error!", "No se encontró la ID de la factura.", "error");
      return;
    }
  
    const response = await fetch(`${apiURL}/image/bill`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userEmail,
        id: billId, // Sabemos que billId no es undefined
        imgUrl: null,
      }),
    });
  
    if (response.ok) {
      Swal.fire("¡Archivo eliminado!", "El archivo ha sido eliminado correctamente.", "success");
  
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId && order.bill) {
          return {
            ...order,
            bill: {
              ...order.bill,
              imgUrl: null,
              id: order.bill.id || billId, // Aseguramos que id sea siempre un string
            },
          } as IOrders; // Aserción de tipo para forzar que cumple con IOrders
        }
        return order;
      });
  
      setOrders(updatedOrders); // Actualizamos el estado
    } else {
      Swal.fire("¡Error!", `Error: ${response.status} - ${response.statusText}`, "error");
    }
  };

  //! Renderizar columna de "Acciones"
  const renderActionsColumn = (order: IOrders) => {
    return (
      <select
        id="status"
        name="status"
        className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
        onChange={(e) => handleChange(e, order.id)}
        value={order.orderDetail.transactions.status}
      >
        <option value="Pendiente de pago">Pendiente de pago</option>
        <option value="En preparación">En preparación</option>
        <option value="Empaquetado">Empaquetado</option>
        <option value="Transito">Transito</option>
        <option value="Entregado">Entregado</option>
      </select>
    );
  };

  //! Renderizar columna de "Archivo Factura"
  const renderFileActionsColumn = (order: IOrders) => {
    const { bill } = order;
    if (bill) {
      return (
        <div className="flex justify-center items-center gap-4">
          {bill.imgUrl ? (
            <>
              <a href={bill.imgUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ color: "teal", width: "20px", height: "20px" }}
                />
              </a>
              <Tooltip content="Eliminar archivo">
                <button
                  type="button"
                  onClick={() => handleDeleteFile(order.id, order.user.email ?? "", bill.id)}
                  className="py-2 px-3 flex items-center text-sm text-red-600 border-red-600 border rounded-lg hover:bg-red-600 hover:text-white"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </Tooltip>
            </>
          ) : (
            <>
              <input
                type="file"
                onChange={(e) => handleUploadFile(e, order.id, order.user.email ?? "", bill.id)}
              />
            </>
          )}
        </div>
      );
    } else {
      return "--";
    }
  };

  //! Renderizar columna de "Necesita Factura"
  const renderInvoiceColumn = (order: IOrders) => {
    return order.bill ? "Sí" : "No";
  };

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <Spinner color="teal" className="h-12 w-12" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
        "Precio total",
        "Fecha de pedido - entrega",
        "Lugar de envio",
        "Productos",
        "Estado", // El estado de la orden
        "Acciones", // Select para cambiar el estado
        "Necesita Factura?", // "Sí" o "No" dependiendo de la factura
        "Archivo Factura", // Subir/eliminar archivo de factura
      ]}
      noContent="No hay Ordenes disponibles"
    >
      {getCurrentPageOrders().map((order: IOrders) => (
        <tr
          key={order.id}
          className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {order.user.name}
          </th>
          <td className="px-4 py-3 text-center">
            $ {order.orderDetail.totalPrice}
          </td>
          <td className="px-4 py-3 text-center">
            {order.date && format(new Date(order.date), "dd'-'MM'-'yyyy", { locale: es })}
            <br />
            {order.orderDetail.deliveryDate &&
              format(new Date(order.orderDetail.deliveryDate), "dd'-'MM'-'yyyy", { locale: es })}
          </td>
          <td className="px-4 py-3 text-center">
            {order.orderDetail.addressDelivery}
          </td>
          <td className="px-4 py-3">
            {order.productsOrder.map((product, index) => (
              <div key={index} className="flex items-center">
                <Image
                  width={50}
                  height={50}
                  src={product.subproduct.product?.imgUrl || ""}
                  alt={product.subproduct.product?.description || ""}
                  className="w-10 h-10 inline-block mr-2 rounded-full"
                />
                {product.subproduct.product?.description} x {product.subproduct.amount}
              </div>
            ))}
          </td>
          {/* Columna de "Estado" */}
          <td className="px-4 py-3 text-center">
            {order.orderDetail.transactions.status}
          </td>
          {/* Columna de "Acciones" */}
          <td className="px-4 py-3 text-center">
            {renderActionsColumn(order)}
          </td>
          {/* Columna de "Necesita Factura" */}
          <td className="px-4 py-3 text-center">
            {renderInvoiceColumn(order)}
          </td>
          {/* Columna de "Archivo Factura" */}
          <td className="px-4 py-3 text-center">
            {renderFileActionsColumn(order)}
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default OrderList;