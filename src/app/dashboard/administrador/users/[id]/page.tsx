"use client";
import DashboardAddModifyComponent from "@/components/DashboardComponent/DashboardAdd&ModifyComponent"
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";
import { useAuthContext } from "@/context/auth.context";
import { getUser, putUser } from "@/helpers/Autenticacion.helper";
import { getOrders, putOrder } from "@/helpers/Order.helper";
import { IOrders } from "@/interfaces/IOrders";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "flowbite-react";
const UsersId = ( { params }: { params: { id: string }}) => {
    const [dataProduct, setDataProduct] = useState({
        limit: "",
      });
const { token } = useAuthContext();
      const [user, setUser] = useState<any>({});
    
      //! Estado para almacenar los errores
      const [errors, setErrors] = useState({
        limit: "",
      });
      const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const ORDERS_PER_PAGE = 5;
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("");
  const [totalPaidOrders, setTotalPaidOrders] = useState(0);

  useEffect(() => {
    async function fetchOrders() {
      const limit = ORDERS_PER_PAGE;
      const page = currentPage;
      if (token) {
        const response = await getOrders(params.id,token );
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
  }, []);


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
  const handleChangeOrder = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {

    const newStatus = {status: e.target.value}
    console.log(newStatus);

      const response = await putOrder(id, newStatus, token as string);
      if(response && (response?.status === 200 || response?.status === 201)){
        setOrders(orders.map((order) => order.id === id ? { ...order, status: newStatus.status } : order));
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

  useEffect(() => {
    const fetchUser = async () => {
      const products = await getUser(params.id, token);
      if (products) {
        setUser(products);
      }
    };
  
    if (token) {
      fetchUser();
    }
  }, [params.id, token]);
    const handleChange = (e: any) => {
        e.preventDefault();
        setDataProduct({
          ...dataProduct,
          [e.target.name]: e.target.value,
        });
      };

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        
    const user = {
      accountLimit: Number(dataProduct.limit)
    }
      
    
        //! Mostrar alerta de carga mientras se procesa la solicitud
        Swal.fire({
          title: "Cambiando el limite",
          text: "Por favor espera.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
    
          const response = await putUser(id,user, token);
    
          if (response && ( response.status === 201 || response.status === 200)) {
            Swal.fire({
              icon: "success",
              title: "¡Agregado!",
              text: "El limite ha sido cambiado con exito.",
            })
          
          
          
        } else {
          // Mostrar alerta de error
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Ha ocurrido un error al agregar el limite.",
          });
        }
      };
      useEffect(() => {
        if (!dataProduct.limit) {
          errors.limit = "El limite es obligatorio";
        } else {
          errors.limit = "";
        }
    
        // Actualizar los errores del producto en el estado
        setErrors(errors);
      }, []);
      useEffect(() => {
        console.log(orders);
        const filterUnPaidOrders = orders.filter(
          (order) => order.orderDetail.transactions.status === "Pendiente de pago"
        );
      
        const totalPaidOrders = filterUnPaidOrders
          .map((order) => Number(order.orderDetail.totalPrice) )
          .reduce((a, b) => a + b, 0);
      
        console.log(totalPaidOrders);
        setTotalPaidOrders(totalPaidOrders);
      }, [orders]);
      const handleTransferOk = async (id : string) => {
        console.log(id);
          Swal.fire({
            title: "¿Estás seguro que el comprobante es correcto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, transferir",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const response = await putOrder(id,{transferStatus:"Comprobante verificado"}, token);
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

      
    return (
        <div className="flex flex-col gap-10">
            <section className=" antialiased  dark:bg-gray-700">
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">Perfil de {user?.name}</h5>
            </div>
          </div>
          <div className="overflow-x-auto flex flex-col p-4 gap-2">
            <h2>Name: {user?.name}</h2>
            <h2>Email: {user?.email}</h2>
            <h2>Telefono: {user?.phone}</h2>
          </div>
        </div>
      </div>
    </section>
            <DashboardAddModifyComponent
            screen = "h-min"
        disabled={errors.limit === ""}
        titleDashboard="Limite de cuenta corriente"
        backLink="/dashboard/cliente/order"
        buttonSubmitText="Actualizar limite"
        handleSubmit={(e) => handleSubmit(e, user.id)}
      >
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div className="mb-4 col-span-full">
          <div className="col-span-full">
            
              <input
                type="text"
                name="limit"
                id="limit"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nombre del producto"
                value={dataProduct.limit}
                onChange={handleChange}
              />
              {errors.limit && (
                <span className="text-red-500">{errors.limit}</span>
              )}
            </div>
          </div>
        </div>
      </DashboardAddModifyComponent>
      <DashboardComponent 
      screen = "h-min"
      setCurrentPage={onPageChange}
      titleDashboard="Listado de Ordenes"
      searchBar="Buscar cliente"
      handleSearchChange={handleSearchChange}
      totalPages={totalPages}
      tdTable={[

        "Fecha de pedido",
        "Precio total",
        "Fecha de entrega",
        "Productos",
        "Estado de pago",
        "Acciones",
      ]}
      noContent="No hay Ordenes disponibles"
      >
          {getCurrentPageOrders().map((order: IOrders) => (
        <tr
          key={order.id}
          className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
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
      {order.receipt.status === "Pendiente de revisión de comprobante" && <Tooltip content="Correcto" >
        <button
          type="button"
          onClick={() => handleTransferOk(order.id)}
          className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </Tooltip>}
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
                onChange={(e) => handleChangeOrder(e, order.id)}
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
      <div className="flex flex-col gap-10 mb-28 w-full">
            <section className=" antialiased  dark:bg-gray-700">
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-end space-y-3 md:space-y-0 md:space-x-1 p-4 bg-white border border-gray-200 rounded-t-lg">
            <h1>Total de adeudado: <b className="text-red-500">$ {totalPaidOrders}</b></h1>
            </div>
        </div>
      </div>
    </section>
    </div>
        </div>
    )
}

export default UsersId