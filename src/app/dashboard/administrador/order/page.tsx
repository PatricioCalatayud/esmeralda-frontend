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
import { faCheck, faDownload, faX } from "@fortawesome/free-solid-svg-icons";
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
  const [dataStatus, setDataStatus] = useState("");
  

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

    const newStatus = {status: e.target.value}
    console.log(newStatus);

      const response = await putOrder(id, newStatus, token as string);
      if(response && (response?.status === 200 || response?.status === 201)){
        console.log("response", response);
      Swal.fire("¡Éxito!", "El estado de la orden ha sido actualizado.", "success");
      }else {
      console.error("Error updating order:", response);
      Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
    }
  };

  //! Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleTransferOk = async (id : string) => {
    console.log(id);
      Swal.fire({
        title: "¿Estás seguro que el comprobante es correcto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Es correcto",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await putOrder(id,{transferStatus:"Comprobante verificado", orderStatus:true}, token);
          if (response && (response?.status === 200 || response?.status === 201)) {
            setOrders(orders.map((order) => 
              order.id === id 
                ? { 
                    ...order, 
                    receipt: { 
                      ...order.receipt, 
                      status: "Comprobante verificado" 
                    } 
                  } as IOrders // Asegura que el objeto cumple con el tipo IOrders
                : order
            ));
            Swal.fire("¡Correcto!", "El estado de la orden ha sido actualizado.", "success");
          } else {
            console.error("Error updating order:", response);
            Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
          }
        } else if (result.isDenied) {
          Swal.fire("No se realizaron cambios", "", "info");
        }
      })
      }
      const handleTransferReject = async (id : string) => {
        console.log(id);
          Swal.fire({
            title: "¿Estás seguro que el comprobante es incorrecto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Es incorrecto",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await putOrder(id,{transferStatus:"Rechazado"}, token);
              if (response && (response?.status === 200 || response?.status === 201)) {
                setOrders(orders.map((order) => 
                  order.id === id 
                    ? { 
                        ...order, 
                        receipt: { 
                          ...order.receipt, 
                          status: "Rechazado" 
                        } 
                      } as IOrders // Asegura que el objeto cumple con el tipo IOrders
                    : order
                ));
                Swal.fire("¡Correcto!", "El estado de la orden ha sido actualizado.", "success");
              } else {
                console.error("Error updating order:", response);
                Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
              }
            } else if (result.isDenied) {
              Swal.fire("No se realizaron cambios", "", "info");
            }
          })
          }

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
        "Fecha de pedido",
        "Precio total",
        "Fecha de entrega",
        "Productos",
        "Estado",
        "Acciones",
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
            <div className="flex justify-center items-center">
              {order.date && format(new Date(order.date), "dd'-'MM'-'yyyy", {
                locale: es,
              })}
            </div>
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
          $ {order.orderDetail?.totalPrice}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {order.orderDetail?.deliveryDate && format(new Date(order.orderDetail?.deliveryDate), "dd'-'MM'-'yyyy", {
              locale: es,
            })}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {order.productsOrder && order.productsOrder.map((product, productIndex) => (
              <div key={productIndex} className="mb-2 text-start flex items-center">
                 <Image
                      width={500}
                      height={500}
                      priority={true}
                      src={product.subproduct.product  ? product.subproduct?.product.imgUrl : ""}
                      alt={product.subproduct.product ? product.subproduct?.product.description : ""}
                      className="w-10 h-10 inline-block mr-2 rounded-full"
                    />
                    <div className="flex flex-row gap-1">
                    <span> {product.subproduct.product && product.subproduct?.product.description}</span>

                    <span>  x {product.subproduct?.amount}</span>
                    </div>
                  </div>
            ))}
          </td>
          <td>
  {order.receipt && (
    <div className="flex justify-center items-center gap-4">
        <div>
      {order.receipt.status ? <p className="w-40">{order.receipt.status}</p> : null}
      {order.receipt.image ? (
   
        <a href={order.receipt.image} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDownload} style={{color: "teal", width: "20px", height: "20px"}}/>
        </a>
        
 
      ) : null}
      </div>
       <Tooltip content="Aceptar" >
        <button
          type="button"
          onClick={() => handleTransferOk(order.id)}
          className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </Tooltip>
      <Tooltip content="Rechazar" >
                      <button
                        type="button"
                        onClick={() => handleTransferReject(order.id)}
                        className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-red-600 border-red-600 border rounded-lg hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </Tooltip>
    </div>
  )}
</td>
          <td
            className={`px-4 py-3 font-medium  whitespace-nowrap  text-center ${
              order.orderDetail?.transactions.status === "Recibido"
                ? "text-teal-500"
                : "text-red-500"
            } `}
          >

              <select
                id="status"
                name="status"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => handleChange(e, order.id)}
                defaultValue={order.orderDetail?.transactions.status }
              >
                <option value="">--Seleccione--</option>
                <option value={"Pendiente de pago"}>Pendiente de pago</option>
                <option value={"Recibido"}>Recibido</option>
                <option value={"Empaquetado"}>Empaquetado</option>
                <option value={"Transito"}>Transito</option>
                <option value={"Entregado"}>Entregado</option>
              </select>

          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default OrderList;
