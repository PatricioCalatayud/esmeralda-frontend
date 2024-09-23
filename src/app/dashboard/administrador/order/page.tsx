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
import { faCheck, faDownload, faX, faEdit, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "flowbite-react";

const OrderList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { token, session } = useAuthContext();
  const ORDERS_PER_PAGE = 5;
  const [loading, setLoading] = useState(true);

  //! Obtener token de usuario
  useEffect(() => {
    if (!session) {
      Swal.fire(
        "¡Error!",
        "Sesión de usuario no encontrada. Por favor, inicia sesión.",
        "error"
      ).then(() => {
        router.push("/login");
      });
    }
  }, [router]);

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
    if (token) {
      fetchOrders();
    }
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

  //! Función para subir un archivo de factura
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("to", session?.email || ""); // Provide a default value for session?.email
      formData.append("id", orderId);
  
      const response = await fetch(`/apiURL/mail/bill/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        Swal.fire("¡Archivo subido!", "El archivo ha sido subido correctamente.", "success");
      } else {
        Swal.fire("¡Error!", "No se pudo subir el archivo.", "error");
      }
    }
  };

  //! Función para modificar un archivo de factura
  const handleEditFile = async (orderId: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("to", session?.email || ""); // Provide a default value for session?.email
        formData.append("id", orderId);
  
        const response = await fetch(`/apiURL/mail/bill/${orderId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        if (response.ok) {
          Swal.fire("¡Archivo actualizado!", "El archivo ha sido actualizado correctamente.", "success");
        } else {
          Swal.fire("¡Error!", "No se pudo actualizar el archivo.", "error");
        }
      }
    };
    fileInput.click();
  };
  //! Función para verificar si hay una factura en la orden
  const renderInvoiceColumn = (order: IOrders) => {
    return order.bill ? "Sí" : "No";
  };

  //! Función para mostrar el manejo de archivos
  const renderFileActionsColumn = (order: IOrders) => {
    if (order.bill) {
      return (
        <div className="flex justify-center items-center gap-4">
          {order.bill.imgUrl ? (
            <>
              <a href={order.bill.imgUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ color: "teal", width: "20px", height: "20px" }}
                />
              </a>
              <Tooltip content="Modificar archivo">
                <button
                  type="button"
                  onClick={() => handleEditFile(order.id)}
                  className="py-2 px-3 flex items-center text-sm text-yellow-600 border-yellow-600 border rounded-lg hover:bg-yellow-600 hover:text-white"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip content="Subir archivo">
                <input type="file" onChange={(e) => handleUploadFile(e, order.id)} />
              </Tooltip>
            </>
          )}
        </div>
      );
    } else {
      return "--";
    }
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
        "Estado", 
        "Acciones", 
        "Necesita Factura?", 
        "Archivo Factura", 
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
            <div className="flex items-center w-full justify-center">
              {order.user?.name}
            </div>
          </th>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            $ {order.orderDetail?.totalPrice}
          </td>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            <div className="flex justify-center items-center">
              {order.date && format(new Date(order.date), "dd'-'MM'-'yyyy", { locale: es })}
            </div>
            {order.orderDetail?.deliveryDate &&
              format(new Date(order.orderDetail?.deliveryDate), "dd'-'MM'-'yyyy", { locale: es })}
          </td>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {order.orderDetail?.addressDelivery}
          </td>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white gap-4">
            {order.productsOrder &&
              order.productsOrder.map((product, productIndex) => (
                <div key={productIndex} className="text-start flex items-center">
                  <Image
                    width={500}
                    height={500}
                    priority={true}
                    src={product.subproduct.product ? product.subproduct?.product.imgUrl : ""}
                    alt={product.subproduct.product ? product.subproduct?.product.description : ""}
                    className="w-10 h-10 inline-block mr-2 rounded-full"
                  />
                  <div className="flex flex-row gap-1">
                    <span>{product.subproduct.product && product.subproduct?.product.description}</span>
                    <span> x {product.subproduct?.amount}</span>
                  </div>
                </div>
              ))}
          </td>

          {/* Columna Estado */}
          <td className="px-4 py-3 font-medium text-center">
            <select
              id="status"
              name="status"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              style={{ minWidth: "200px" }} // Ancho mínimo para el select.
              onChange={(e) => handleChange(e, order.id)}
              defaultValue={order.orderDetail?.transactions.status}
            >
              <option value="">--Seleccione--</option>
              <option value={"Pendiente de pago"}>Pendiente de pago</option>
              <option value={"Recibido"}>Recibido</option>
              <option value={"Empaquetado"}>Empaquetado</option>
              <option value={"Transito"}>Transito</option>
              <option value={"Entregado"}>Entregado</option>
            </select>
          </td>

          {/* Columna Acciones */}
          <td>
            {order.receipt && (
              <div className="flex justify-center items-center gap-4">
                <div>
                  {order.receipt.status ? <p className="w-40">{order.receipt.status}</p> : null}
                </div>
              </div>
            )}
          </td>

          {/* Columna Necesita Factura */}
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {renderInvoiceColumn(order)}
          </td>

          {/* Columna Archivo Factura */}
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {renderFileActionsColumn(order)}
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default OrderList;