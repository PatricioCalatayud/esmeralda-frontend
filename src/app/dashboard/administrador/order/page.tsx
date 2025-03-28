"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { IOrders } from "@/interfaces/IOrders";
import { format, set } from "date-fns";
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
  const response = await fetch(`http://localhost:3001/order/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newStatus),
  });

  if (response.ok) {
    Swal.fire("¡Éxito!", "El estado de la orden ha sido actualizado.", "success");

    // Actualizar el estado local
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              orderDetail: {
                ...order.orderDetail,
                transactions: {
                  ...order.orderDetail.transactions,
                  status: newStatus.status,
                },
              },
            }
          : order
      )
    );
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

  //! Funciones para el manejo del comprobante de pago
  const handleTransferOk = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro que el comprobante es correcto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, es correcto",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Actualizando...",
          text: "Por favor espera.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await putOrder(
          id,
          { transferStatus: "Comprobante verificado", orderStatus: true },
          token
        );
        if (response && (response?.status === 200 || response?.status === 201)) {
          setOrders(
            orders.map((order) =>
              order.id === id
                ? {
                    ...order,
                    orderDetail: {
                      ...order.orderDetail,
                      transactions: {
                        ...order.orderDetail.transactions,
                        status: "En preparación",
                        
                      },
                    },
                    receipt: {
                      ...order.receipt,
                      status: "Comprobante verificado",
                      id: order.receipt?.id || undefined,
            image: order.receipt?.image || "",
                    },
                  } 
                : order
            )
          );
          Swal.fire("¡Correcto!", "El estado de la orden ha sido actualizado.");
        } else {
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
        }
      }
    });
  };

  const handleTransferReject = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro que el comprobante es incorrecto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, es incorrecto",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Actualizando...",
          text: "Por favor espera.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await putOrder(id, { transferStatus: "Rechazado" }, token);
        if (response && (response?.status === 200 || response?.status === 201)) {
          setOrders(
            orders.map((order) =>
              order.id === id
                ? {
                    ...order,
                    receipt: {
                      id: order.receipt?.id ?? undefined, // Si `id` no existe, será undefined
                      image: order.receipt?.image ?? "", // Usamos valores por defecto si no están definidos
                      status: "Rechazado", // Actualizamos el estado
                    },
                  }
                : order
            ))
          
          Swal.fire("¡Correcto!", "El estado de la orden ha sido actualizado.", "success");
        } else {
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
        }
      }
    });
  };
  const [imageUrls, setImageUrls] = useState<Record<number, string | null>>({});
  const fetchImageBlob = async (productId: number, url: string) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob(); // Convertimos la respuesta a Blob
        return URL.createObjectURL(blob); // Creamos una URL temporal
      } else {
        throw new Error(`Error al cargar la imagen para el producto ${productId}`);
      }
    } catch (error) {
      console.error(`Error al obtener la imagen para el producto ${productId}:`, error);
      return null;
    }
  };
   // useEffect para cargar las imágenes
   useEffect(() => {
    const fetchAllImages = async () => {
      try {
        // Creamos un array de promesas para todas las imágenes
        const urls = await Promise.all(
          orders.flatMap((order) =>
            order.productsOrder.map(async (product) => {
              const blobUrl = await fetchImageBlob(
                Number(product.id),
                `${apiURL}/product/${product?.subproduct?.product?.imgUrl}`
              );
              return {
                id: product?.subproduct?.product?.id,
                url: blobUrl,
              };
            })
          )
        );
  
        // Convertimos el array en un objeto de mapeo { id: url }
        const urlMap = urls.reduce((acc : any, item) => {
          if (item?.id && item?.url) {
            acc[item.id]  = item.url;
          }
          return acc;
        }, {});
  
        setImageUrls(urlMap); // Verificamos el resultado
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
  
    fetchAllImages();
  }, [orders, apiURL]);
    console.log(imageUrls);

  //! Renderizar columna de "Estado" (Comprobante)
  const renderStatusColumn = (order: IOrders) => {
    return order.receipt ? (
      <div className="flex justify-center items-center gap-4">
        <div>
          {order.receipt.status ? <p className="w-40">{order.receipt.status}</p> : null}
          {order.receipt.image ? (
            <a href={order.receipt.image} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDownload} style={{ color: "teal", width: "20px", height: "20px" }} />
            </a>
          ) : null}
        </div>
        {order.receipt.status !== "Pendiente de subir comprobante" && (
          <>
            <Tooltip content="Aceptar">
              <button
                type="button"
                onClick={() => handleTransferOk(order.id)}
                className="py-2 px-3 flex items-center text-sm text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 hover:text-white"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </Tooltip>
            <Tooltip content="Rechazar">
              <button
                type="button"
                onClick={() => handleTransferReject(order.id)}
                className="py-2 px-3 flex items-center text-sm text-red-600 border-red-600 border rounded-lg hover:bg-red-600 hover:text-white"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </Tooltip>
          </>
        )}
      </div>
    ) : (
      "--"
    );
  };

  //! Renderizar columna de "Acciones" (Cambio de estado)
  const renderActionsColumn = (order: IOrders) => {
    const isRejected = order.receipt?.status === "Rechazado";
  
    return (
      <select
        id="status"
        name="status"
        className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5"
        onChange={(e) => handleChange(e, order.id)}
        value={isRejected ? "Pendiente de pago" : order.orderDetail.transactions.status}
        disabled={isRejected} // Deshabilitamos el select si el estado es "Rechazado"
      >
        <option value="Pendiente de pago">Pendiente de pago</option>
        <option value="En preparación">En preparación</option>
        <option value="Empaquetado">Empaquetado</option>
        <option value="Transito">Transito</option>
        <option value="Entregado">Entregado</option>
      </select>
    );
  };

  //! Renderizar columna de "Necesita Factura"
  const renderInvoiceColumn = (order: IOrders) => {
    return order.bill ? "Sí" : "No";
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
  //! Renderizar columna de "CUIT/DNI"
const renderIdentificationColumn = (order: IOrders) => {
  return order.bill && order.bill.identification ? order.bill.identification : "--";
};

  //! Funciones para subir/eliminar archivos de factura
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    orderId: string,
    userEmail: string,
    billId: string | undefined
  ) => {
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
                id: order.bill.id || billId,
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

  const handleDeleteFile = async (orderId: string, userEmail: string, billId: string | undefined) => {
    if (!billId) {
      Swal.fire("¡Error!", "No se encontró la ID de la factura.", "error");
      return;
    }
  
    const response = await fetch(`${apiURL}/image/bill`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Asegura que se envíe como JSON
      },
      body: JSON.stringify({
        to: userEmail,
        id: billId,
        imgUrl: null, // Enviar el valor nulo en JSON
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
              id: order.bill.id || billId,
            },
          } as IOrders;
        }
        return order;
      });
  
      setOrders(updatedOrders);
    } else {
      Swal.fire("¡Error!", `Error: ${response.status} - ${response.statusText}`, "error");
    }
  };
  console.log(orders);
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
       "CUIT/DNI",
        
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
            {order.create && format(new Date(order.create), "dd'-'MM'-'yyyy", { locale: es })}
            <br />
            {order.orderDetail.deliveryDate &&
              format(new Date(order.orderDetail.deliveryDate), "dd'-'MM'-'yyyy", { locale: es })}
          </td>
          <td className="px-4 py-3 text-center">
            {order.orderDetail.addressDelivery}
          </td>
          <td className="px-4 py-3">
            {order.productsOrder.map((product, index) => (
              console.log(product),
              console.log(String(imageUrls[Number(product?.subproduct?.product?.id)])),
              <div key={index} className="flex items-center">
                {imageUrls  &&<Image
                  width={50}
                  height={50}
                  src={String(imageUrls[Number(product?.subproduct?.product?.id)])  !== "undefined" && String(imageUrls[Number(product?.subproduct?.product?.id)]) !== "null" ? String(imageUrls[Number(product?.subproduct?.product?.id)]) : `https://img.freepik.com/vector-gratis/diseno-plano-letrero-foto_23-2149259323.jpg?t=st=1734307534~exp=1734311134~hmac=8c21d768817e50b94bcd0f6cf08244791407788d4ef69069b3de7f911f4a1053&w=740`}
                  alt={product.subproduct.product?.description || ""}
                  className="w-10 h-10 inline-block mr-2 rounded-full"
                />}
                {product.subproduct.product?.description} x {product.quantity} un de {product.subproduct.amount} {product.subproduct.unit}
              </div>
            ))}
          </td>
          {/* Columna de "Estado" */}
          <td className="px-4 py-3 text-center">
            {renderStatusColumn(order)}
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
          <td className="px-4 py-3 text-center">
  {renderIdentificationColumn(order)}
</td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default OrderList;