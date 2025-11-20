"use client"
import { useEffect, useState } from "react"
import type React from "react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import type { IOrders } from "@/interfaces/IOrders"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Spinner } from "@material-tailwind/react"
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent"
import { getAllOrders, putOrder } from "@/helpers/Order.helper"
import Image from "next/image"
import { useAuthContext } from "@/context/auth.context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faX, faEye, faTimes, faSave, faSearch } from "@fortawesome/free-solid-svg-icons"
import { Tooltip } from "flowbite-react"
import { formatPrice } from "@/utils/formatPrice"

const apiURL = process.env.NEXT_PUBLIC_API_URL
const ORDERS_PER_PAGE = 7

const OrderList = () => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState<IOrders[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSearchTerm, setActiveSearchTerm] = useState("") // The term actually being searched
  const { token } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({})
  const [savingTracking, setSavingTracking] = useState<Record<string, boolean>>({})


  const fetchOrders = async (page: number, searchId = "") => {
    if (token) {
      setLoading(true)
      try {
        let response: { products: IOrders[]; totalOrders: number } | undefined

        if (searchId.trim()) {
          const searchResponse = await fetch(`${apiURL}/order/${searchId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          if (searchResponse.ok) {
            const orderData = await searchResponse.json()
            response = {
              products: [orderData],
              totalOrders: 1,
            }
          } else if (searchResponse.status === 404) {
            response = {
              products: [],
              totalOrders: 0,
            }
          } else {
            throw new Error(`Error ${searchResponse.status}: ${searchResponse.statusText}`)
          }
        } else {
          response = await getAllOrders(token, page, ORDERS_PER_PAGE)
        }

        if (response) {
          setOrders(response.products)
          setTotalOrders(response.totalOrders)

          const calculatedTotalPages = searchId.trim() ? 1 : Math.ceil(response.totalOrders / ORDERS_PER_PAGE)
          setTotalPages(calculatedTotalPages)

          const initialTrackingInputs: Record<string, string> = {}
          response.products.forEach((order) => {
            initialTrackingInputs[order.id] = order.trackingNumber || ""
          })
          setTrackingInputs(initialTrackingInputs)
        } else {
          setOrders([])
          setTotalOrders(0)
          setTotalPages(0)
        }
      } catch (error) {
        console.error("Error al obtener órdenes:", error)
        Swal.fire("Error", "No se pudieron cargar las órdenes", "error")
        setOrders([])
        setTotalOrders(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchOrders(currentPage, activeSearchTerm)
  }, [token, currentPage, activeSearchTerm])

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  //! Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim() === "") {
      setActiveSearchTerm("")
      setCurrentPage(1)
    }
  }

  //! Función para ejecutar la búsqueda
  const executeSearch = () => {
    const trimmedSearch = searchTerm.trim()
    setActiveSearchTerm(trimmedSearch)
    setCurrentPage(1)
  }

  //! Función para manejar Enter en el input de búsqueda
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch()
    }
  }

  //! Función para manejar el cambio en el estado de la orden
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    const newStatus = { status: e.target.value }
    const response = await fetch(`${apiURL}/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newStatus),
    })

    if (response.ok) {
      Swal.fire("¡Éxito!", "El estado de la orden ha sido actualizado.", "success")

      setOrders(
        orders.map((order) =>
          order.id === id
            ? {
                ...order,
                status: newStatus.status === "Entregado" ? true : false,
                orderDetail: {
                  ...order.orderDetail,
                  transactions: {
                    ...order.orderDetail.transactions,
                    status: newStatus.status,
                  },
                },
              }
            : order,
        ),
      )
    } else {
      console.error("Error updating order:", response)
      Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error")
    }
  }

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
            Swal.showLoading()
          },
        })

        const response = await putOrder(id, { transferStatus: "Comprobante verificado", orderStatus: true }, token)
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
                : order,
            ),
          )
          Swal.fire("¡Correcto!", "El estado de la orden ha sido actualizado.")
        } else {
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error")
        }
      }
    })
  }

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
            Swal.showLoading()
          },
        })

        const response = await putOrder(id, { transferStatus: "Rechazado" }, token)
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
                : order,
            ),
          )

          Swal.fire("¡Correcto!", "El estado de la orden ha sido actualizado.", "success")
        } else {
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error")
        }
      }
    })
  }
  const [imageUrls, setImageUrls] = useState<Record<number, string | null>>({})
  const fetchImageBlob = async (productId: number, url: string) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        const blob = await response.blob() // Convertimos la respuesta a Blob
        return URL.createObjectURL(blob) // Creamos una URL temporal
      } else {
        throw new Error(`Error al cargar la imagen para el producto ${productId}`)
      }
    } catch (error) {
      console.error(`Error al obtener la imagen para el producto ${productId}:`, error)
      return null
    }
  }
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const urls = await Promise.all(
          orders.flatMap((order) =>
            order.productsOrder.map(async (product) => {
              const blobUrl = await fetchImageBlob(
                Number(product.id),
                `${apiURL}/product/${product?.subproduct?.product?.imgUrl}`,
              )
              return {
                id: product?.subproduct?.product?.id,
                url: blobUrl,
              }
            }),
          ),
        )

        const urlMap = urls.reduce((acc: any, item) => {
          if (item?.id && item?.url) {
            acc[item.id] = item.url
          }
          return acc
        }, {})

        setImageUrls(urlMap)
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }

    fetchAllImages()
  }, [orders, apiURL])

  //! Renderizar columna de "Estado" (Comprobante)
  const renderStatusColumn = (order: IOrders) => {
    return (
      <div className="flex justify-center items-center gap-4">
        <div className={`${order.status ? "text-teal-500" : "text-red-500"}`}>
          {order.status ? "Exito" : "Pendiente"}
        </div>
      </div>
    )
  }

  //! Renderizar columna de "Acciones" (Cambio de estado)
  const renderActionsColumn = (order: IOrders) => {
    const isRejected = order.receipt?.status === "Rechazado"

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
    )
  }

  //! Renderizar columna de "Archivo Factura"
  const renderFileActionsColumn = (order: IOrders) => {
    const { bill } = order
    if (bill) {
      return (
        <div className="flex justify-center items-center gap-2 w-24 mx-auto">
          {bill.imgUrl ? (
            <>
              <a href={bill.imgUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faDownload} style={{ color: "teal", width: "20px", height: "20px" }} />
              </a>
              <Tooltip content="Eliminar archivo">
                <button
                  type="button"
                  onClick={() => handleDeleteFile(order.id, order.user.email ?? "", bill.id)}
                  className="py-1 px-2 flex items-center text-sm text-red-600 border-red-600 border rounded-lg hover:bg-red-600 hover:text-white"
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </Tooltip>
            </>
          ) : (
            <>
              <input
                type="file"
                className="w-full text-xs"
                onChange={(e) => handleUploadFile(e, order.id, order.user.email ?? "", bill.id)}
              />
            </>
          )}
        </div>
      )
    } else {
      return "--"
    }
  }
  //! Renderizar columna de "CUIT/DNI"
  const renderIdentificationColumn = (order: IOrders) => {
    return order.bill && order.bill.identification ? order.bill.identification : "--"
  }

  //! Función para manejar el cambio en el input de tracking
  const handleTrackingInputChange = (orderId: string, value: string) => {
    setTrackingInputs((prev) => ({
      ...prev,
      [orderId]: value,
    }))
  }

  //! Función para guardar el número de tracking
  const handleSaveTracking = async (orderId: string) => {
    const trackingNumber = trackingInputs[orderId]

    // Marcar como guardando
    setSavingTracking((prev) => ({
      ...prev,
      [orderId]: true,
    }))

    try {
      // Usar el nuevo endpoint específico para tracking
      const response = await fetch(`${apiURL}/order/tracking/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackingNumber }),
      })

      if (response.ok) {
        // Actualizar el estado local
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderDetail: {
                    ...order.orderDetail,
                    trackingNumber,
                  },
                }
              : order,
          ),
        )

        Swal.fire({
          title: "¡Éxito!",
          text: "Número de tracking actualizado correctamente",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        })
      } else {
        Swal.fire("¡Error!", "No se pudo actualizar el número de tracking", "error")
      }
    } catch (error) {
      console.error("Error al guardar el tracking:", error)
      Swal.fire("¡Error!", "Ocurrió un error al guardar el número de tracking", "error")
    } finally {
      // Desmarcar como guardando
      setSavingTracking((prev) => ({
        ...prev,
        [orderId]: false,
      }))
    }
  }

  //! Renderizar columna de "Tracking ID"
  const renderTrackingIdColumn = (order: IOrders) => {
    const isSaving = savingTracking[order.id] || false
    const isStorePickup = order.orderDetail.deliveryAddress?.store

    if (isStorePickup) {
      return <div className="text-center">Retiro de local</div>
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          value={trackingInputs[order.id] || ""}
          onChange={(e) => handleTrackingInputChange(order.id, e.target.value)}
          placeholder="Tracking #"
          className="w-28 p-1 text-sm border rounded"
        />
        <button
          onClick={() => handleSaveTracking(order.id)}
          disabled={isSaving}
          className="p-1 rounded bg-teal-100 hover:bg-teal-200 transition-colors disabled:opacity-50"
          title="Guardar tracking"
        >
          <FontAwesomeIcon icon={faSave} style={{ color: "#0d9488", width: "16px", height: "16px" }} />
        </button>
      </div>
    )
  }

  //! Funciones para subir/eliminar archivos de factura
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    orderId: string,
    userEmail: string,
    billId: string | undefined,
  ) => {
    const file = e.target.files?.[0]
    if (file && billId) {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("to", userEmail)
      formData.append("id", billId)

      const response = await fetch(`${apiURL}/image/bill`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        Swal.fire("¡Archivo subido!", "El archivo ha sido subido correctamente.", "success")

        const updatedOrders = orders.map((order) => {
          if (order.id === orderId && order.bill) {
            return {
              ...order,
              bill: {
                ...order.bill,
                imgUrl: URL.createObjectURL(file),
                id: order.bill.id || billId,
              },
            } as IOrders
          }
          return order
        })

        setOrders(updatedOrders)
      } else {
        Swal.fire("¡Error!", `Error: ${response.status} - ${response.statusText}`, "error")
      }
    }
  }

  const handleDeleteFile = async (orderId: string, userEmail: string, billId: string | undefined) => {
    if (!billId) {
      Swal.fire("¡Error!", "No se encontró la ID de la factura.", "error")
      return
    }

    const response = await fetch(`${apiURL}/bill/${billId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imgUrl: null,
      }),
    })

    if (response.ok) {
      Swal.fire("¡Archivo eliminado!", "El archivo ha sido eliminado correctamente.", "success")

      const updatedOrders = orders.map((order) => {
        if (order.id === orderId && order.bill) {
          return {
            ...order,
            bill: {
              ...order.bill,
              imgUrl: null,
              id: order.bill.id || billId,
            },
          } as IOrders
        }
        return order
      })

      setOrders(updatedOrders)
    } else {
      Swal.fire("¡Error!", `Error: ${response.status} - ${response.statusText}`, "error")
    }
  }

  const handleOpenProductsModal = (products: any[]) => {
    setSelectedProducts(products)
    setIsModalOpen(true)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Evitar scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  const ordersToDisplay = orders

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner
            color="teal"
            className="h-12 w-12"
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          />
        </div>
      ) : (
        <div>
          {/* Custom search bar */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Buscar por ID de orden (presiona Enter o haz clic en la lupa)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={executeSearch}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSearch} />
                Buscar
              </button>
              {activeSearchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setActiveSearchTerm("")
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
            {activeSearchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Buscando orden con ID: <span className="font-semibold">{activeSearchTerm}</span>
              </div>
            )}
          </div>

          <DashboardComponent
            setCurrentPage={onPageChange}
            titleDashboard="Listado de Ordenes"
            searchBar="" // Empty since we have custom search
            handleSearchChange={() => {}} // Empty function
            totalPages={activeSearchTerm.trim() ? 0 : totalPages} // Hide pagination when searching
            currentPage={currentPage}
            tdTable={[
              "Orden ID",
              "Precio total",
              "Fecha de pedido - entrega",
              "Lugar de envio",
              "Productos",
              "Estado",
              "Acciones",
              "Archivo Factura",
              "CUIT/DNI",
              "Tracking ID",
            ]}
            noContent={
              activeSearchTerm.trim()
                ? `No se encontró la orden con ID: ${activeSearchTerm}`
                : "No hay Ordenes disponibles"
            }
          >
            {ordersToDisplay.length > 0 ? (
              ordersToDisplay.map((order: IOrders) => (
                <tr key={order.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {order.id}
                  </th>
                  <td className="px-4 py-3 text-center">{formatPrice(order.orderDetail.totalPrice)}</td>
                  <td className="px-4 py-3 text-center">
                    {order.create && format(new Date(order.create), "dd'-'MM'-'yyyy", { locale: es })}
                    <br />
                    {order.orderDetail.deliveryDate &&
                      format(new Date(order.orderDetail.deliveryDate), "dd'-'MM'-'yyyy", { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.orderDetail.deliveryAddress ? (
                      <div className="text-sm">
                        {order.orderDetail.deliveryAddress.store
                          ? "Retiro de local"
                          : order.orderDetail.deliveryAddress.street + " " + order.orderDetail.deliveryAddress.number + ", " + order.orderDetail.deliveryAddress.locality + ", " + order.orderDetail.deliveryAddress.province}
                      </div>
                    ) : (
                      "--"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.productsOrder.length > 0 && (
                      <div className="flex items-center">
                        {imageUrls && (
                          <Image
                            width={50}
                            height={50}
                            src={
                              String(imageUrls[Number(order.productsOrder[0]?.subproduct?.product?.id)]) !==
                                "undefined" &&
                              String(imageUrls[Number(order.productsOrder[0]?.subproduct?.product?.id)]) !== "null"
                                ? String(imageUrls[Number(order.productsOrder[0]?.subproduct?.product?.id)])
                                : `https://img.freepik.com/vector-gratis/diseno-plano-letrero-foto_23-2149259323.jpg?t=st=1734307534~exp=1734311134~hmac=8c21d768817e50b94bcd0f6cf08244791407788d4ef69069b3de7f911f4a1053&w=740`
                            }
                            alt={order.productsOrder[0].subproduct.product?.description || ""}
                            className="w-10 h-10 inline-block mr-2 rounded-full"
                          />
                        )}
                        <div>
                          {order.productsOrder[0].subproduct.product?.description} x {order.productsOrder[0].quantity}{" "}
                          un de {order.productsOrder[0].subproduct.amount} {order.productsOrder[0].subproduct.unit}
                        </div>

                        {order.productsOrder.length > 1 && (
                          <button
                            onClick={() => handleOpenProductsModal(order.productsOrder)}
                            className="ml-2 p-1 rounded-full bg-teal-100 hover:bg-teal-200 transition-colors"
                            title="Ver más productos"
                          >
                            <FontAwesomeIcon icon={faEye} style={{ color: "#0d9488", width: "16px", height: "16px" }} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  {/* Columna de "Estado" */}
                  <td className="px-4 py-3 text-center">{renderStatusColumn(order)}</td>
                  {/* Columna de "Acciones" */}
                  <td className="px-4 py-3 text-center">{renderActionsColumn(order)}</td>

                  {/* Columna de "Archivo Factura" */}
                  <td className="px-4 py-3 text-center">{renderFileActionsColumn(order)}</td>
                  <td className="px-4 py-3 text-center">{renderIdentificationColumn(order)}</td>
                  {/* Nueva columna de "Tracking ID" */}
                  <td className="px-4 py-3">{renderTrackingIdColumn(order)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  {activeSearchTerm.trim()
                    ? `No se encontró la orden con ID: ${activeSearchTerm}`
                    : "No hay Ordenes disponibles"}
                </td>
              </tr>
            )}
          </DashboardComponent>
        </div>
      )}

      {/* Información de paginación */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-t">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{orders.length}</span> de{" "}
          <span className="font-medium">{totalOrders}</span> órdenes
        </div>
      </div>

      {/* Modal personalizado para productos */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Productos en esta orden</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {selectedProducts.map((product, index) => (
                <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                  {imageUrls && (
                    <Image
                      width={50}
                      height={50}
                      src={
                        String(imageUrls[Number(product?.subproduct?.product?.id)]) !== "undefined" &&
                        String(imageUrls[Number(product?.subproduct?.product?.id)]) !== "null"
                          ? String(imageUrls[Number(product?.subproduct?.product?.id)])
                          : `https://img.freepik.com/vector-gratis/diseno-plano-letrero-foto_23-2149259323.jpg?t=st=1734307534~exp=1734311134~hmac=8c21d768817e50b94bcd0f6cf08244791407788d4ef69069b3de7f911f4a1053&w=740`
                      }
                      alt={product.subproduct.product?.description || ""}
                      className="w-10 h-10 inline-block mr-2 rounded-full"
                    />
                  )}
                  <div>
                    {product.subproduct.product?.description} x {product.quantity} un de {product.subproduct.amount}{" "}
                    {product.subproduct.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderList
