"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ICart } from "@/interfaces/IProductList";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { postOrder } from "@/helpers/Order.helper";
import { Modal } from "flowbite-react";
import { useCartContext } from "@/context/cart.context";
import { getUser } from "@/helpers/Autenticacion.helper";
import { IAccountProps } from "@/interfaces/IUser";
import { Spinner } from "@material-tailwind/react";
import { putUser } from "@/helpers/Autenticacion.helper";

const Cart = () => {
  const router = useRouter();
  const [cart, setCart] = useState<ICart[]>([]);
  const { session, token, setSession } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);
  const [street, setStreet] = useState("");
  const [isDelivery, setIsDelivery] = useState(false);
  const { setCartItemCount } = useCartContext();
  const [account, setAccount] = useState<IAccountProps>();
  const [loading, setLoading] = useState(false);
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(session?.address?.street || "");
  const [number, setNumber] = useState(session?.address?.number || 0);
  const [locality, setLocality] = useState(session?.address?.locality || "");
  const [province, setProvince] = useState(session?.address?.province || "");
  const [zipcode, setZipcode] = useState(session?.address?.zipcode || "");
  const [tempAddress, setTempAddress] = useState({
    street: "",
    number: "",
    locality: "",
    province: "",
    zipcode: "",
  });

  const provinceMapping: Record<number, string> = {
    1: "Buenos Aires",
    2: "Córdoba",
    3: "Catamarca",
    4: "Chaco",
    5: "Chubut",
    6: "Corrientes",
    7: "Entre Ríos",
    8: "Formosa",
    9: "Jujuy",
    10: "La Pampa",
    11: "La Rioja",
    12: "Mendoza",
    13: "Misiones",
    14: "Neuquén",
    15: "Río Negro",
    16: "Salta",
    17: "San Juan",
    18: "San Luis",
    19: "Santa Cruz",
    20: "Santa Fe",
    21: "Santiago del Estero",
    22: "Tierra del Fuego",
    23: "Tucumán",
    24: "Ciudad Autónoma de Buenos Aires",
  };
  const [provinces] = useState(
    Object.keys(provinceMapping).map((key) => ({
      value: Number(key),
      label: provinceMapping[Number(key)],
    }))
  );


  //! Obtiene los datos del carro
  useEffect(() => {
    const fetchCart = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(cartItems);
    };

    const fetchUser = async () => {
      if (token && session) {
        const response = await getUser(session.id, token);
        console.log(response);

        if (response) {
          const accountData = response.account;

          // Verificamos que el accountData sea del tipo esperado (un objeto de tipo IAccountProps)
          if (typeof accountData === "object" && accountData !== null) {
            setAccount(accountData as IAccountProps); // Asignamos solo si es del tipo IAccountProps
          } else {
            setAccount(undefined); // Si no es un objeto válido, seteamos undefined
          }
        }
      }
    };

    fetchUser();
    fetchCart();
  }, [token]);
  //! Función para aumentar la cantidad
  const handleIncrease = (article_id: string) => {
    const newCart = cart.map((item) => {
      if (item.idSubProduct === article_id) {
        // Crea una nueva instancia del objeto para garantizar la inmutabilidad
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    });

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  //! Función para disminuir la cantidad
  const handleDecrease = (article_id: string) => {
    const newCart = cart.map((item) => {
      if (item.idSubProduct === article_id) {
        // Crea una nueva instancia del objeto para garantizar la inmutabilidad
        return { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) };
      }
      return item;
    });

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  //! Función para eliminar el articulo
  const removeFromCart = (index: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto del carrito de compras",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartItemCount(updatedCart.length);
        Swal.fire(
          "Eliminado",
          "El producto ha sido eliminado del carrito",
          "success"
        );
      }
    });
  };

  //! Función para calcular el subtotal
  const calcularSubtotal = () => {
    return cart.reduce((acc, item) => {
      return acc + (item.quantity || 1) * Number(item.price);
    }, 0);
  };

  //! Función para calcular el descuento
  const calcularDescuento = () => {
    return cart.reduce((acc, item) => {
      const descuentoPorProducto =
        (item.quantity || 1) *
        (Number(item.price) * (Number(item.discount || 0) / 100));
      return acc + descuentoPorProducto;
    }, 0);
  };

  //! Función para calcular el IVA basado en subtotal menos descuento
  const calcularIVA = () => {
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento();
    const baseParaIVA = subtotal - descuento;
    return baseParaIVA * 0.21; // 21% de IVA sobre la base ajustada
  };

  //! Función para calcular el total
  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento();
    const iva = calcularIVA();
    return subtotal - descuento + iva;
  };

  const subtotal = calcularSubtotal();
  const descuento = calcularDescuento();
  const iva = calcularIVA();
  const total = calcularTotal();

  const handleEditAddress = () => {
    setTempAddress({
      street: address,
      number: number.toString(),
      locality: locality,
      province: province,
      zipcode: zipcode,
    });
  };

  const handleCheckout = async (boton: string) => {
    const products = cart.map((product) => ({
      productId: Number(product.idProduct),
      subproductId: Number(product.idSubProduct),
      quantity: product.quantity,
    }));

    setLoading(true);

    const orderCheckout: any = {
      userId: session?.id,
      products,
      address: isDelivery
        ? { store: true }
        : isEditing
        ? {
            street: address,
            number: number,
            locality: locality,
            province: province,
            zipcode: zipcode,
          }
        : {
            street: session?.address?.street,
            number: session?.address?.number,
            locality: session?.address?.locality,
            province: session?.address?.province,
            zipcode: session?.address?.zipcode || "",
          },
      discount: 10,
      ...(session?.role === "Cliente" &&
        boton === "Cliente Transferencia" && { account: "Transferencia" }),
      ...(session?.role === "Cliente" &&
        boton === "Cliente Cuenta Corriente" && {
          account: "Cuenta corriente",
        }),
      ...(needsInvoice && { invoiceType }),
    };
    orderCheckout.identification = String(session?.cuit);

    try {
      if (!invoiceType) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes seleccionar un tipo de factura",
        });
        return;
      }
      console.log("orderCheckout",orderCheckout);
      const order = await postOrder(orderCheckout, token);
      console.log("order",order);

      if (order?.status === 200 || order?.status === 201) {
        setTimeout(() => {
          if (session?.role === "Usuario") {
            router.push(`/checkout/${order.data.id}`);
          } else if (
            session?.role === "Cliente" &&
            boton === "Cliente Transferencia"
          ) {
            router.push(`/transfer/${order.data.id}`);
          } else if (
            session?.role === "Cliente" &&
            boton === "Cliente Cuenta Corriente"
          ) {
            setCartItemCount(0);
            localStorage.removeItem("cart");
            router.push(`/dashboard/cliente/order`);
          }
        }, 500);
      } else {
        throw new Error("Pedido no completado.");
      }
    } catch (error: any) {
      console.error("Error en el servidor:", error);
      const errorMessage =
        error.message || "Hubo un error al realizar tu pedido";
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error en el pedido",
        text: errorMessage,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };
  //! Renderizado si no hay elementos en el carrito
  if (cart.length === 0) {
    return (
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 mt-14 items-center justify-center flex-col">
          <Image
            width={300}
            height={300}
            className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
            alt="hero"
            src="/cart-empty.png"
          />
          <div className="text-center lg:w-2/3 w-full">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Tu carrito está vacío
            </h1>
            <p className="mb-8 leading-relaxed">
              Parece que aún no has agregado nada a tu carrito. ¡Empieza a
              comprar ahora!
            </p>
            <div className="flex justify-center">
              <Link href="/categories">
                <button className="inline-flex text-white bg-teal-600 border-0 py-2 px-6 focus:outline-none hover:bg-teal-800 rounded text-lg">
                  Empezar a comprar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  //! Renderizado si hay elementos en el carrito

  return (
    <div className="font-sans w-3/4 mx-auto h-screen ">
      <div className="grid md:flex md:flex-row gap-4 mt-8 justify-between py-10">
        <div className="bg-white rounded-md w-full 0">
          <h2 className="text-2xl font-bold text-gray-900 h-10 flex justify-center items-center">
            Tus artículos
          </h2>
          <hr className=" w-full " />
          <div className="space-y-4 w-full mt-4 overflow-y-auto max-h-[450px]">
            {cart.map((item, index) => (
              <div
                key={index}
                className="grid sm:flex items-center gap-4 border border-gray-400 rounded-2xl px-4 py-2 w-full shadow-xl"
              >
                <div className="sm:col-span-2 flex items-center gap-4 w-full">
                  <div className="w-24 h-24 shrink-0 bg-white p-1 rounded-md">
                    <Image
                      width={500}
                      height={500}
                      priority={true}
                      src={item.imgUrl}
                      className="w-full h-full object-cover rounded-2xl"
                      alt={item.description}
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full ">
                    <div className="flex gap-4">
                      <h3 className="text-base font-bold text-gray-800 text-nowrap ">
                        {item.description}
                      </h3>
                      <p className="text-base font-bold text-gray-800 text-nowrap ">
                        ({item.size} {item.unit})
                      </p>
                    </div>
                    <div
                      onClick={() => removeFromCart(index)}
                      className="flex items-center text-sm font-semibold text-red-500 cursor-pointer gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Eliminar
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-3 font-bold items-center">
                        <button
                          className="text-black border border-gray-900 w-6 h-6 font-bold flex justify-center items-center rounded-md disabled:bg-gray-300 disabled:border-gray-400 disabled:text-white"
                          onClick={() => handleDecrease(item.idSubProduct)}
                          disabled={item.quantity === 1}
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            style={{ width: "10px", height: "10px" }}
                          />
                        </button>
                        {item.quantity || 1}
                        <button
                          className="text-black border border-gray-900 w-6 h-6 font-bold flex justify-center items-center rounded-md disabled:bg-gray-300 disabled:border-gray-400 disabled:text-white"
                          onClick={() => handleIncrease(item.idSubProduct)}
                          disabled={
                            item.quantity === Math.max(0, Number(item.stock))
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ width: "10px", height: "10px" }}
                          />
                        </button>
                        <p className="text-gray-800 text-xs text-nowrap">
                          {item.stock > 0
                            ? `${item.stock} disponibles`
                            : "0 disponibles"}
                        </p>
                      </div>
                      <div className="ml-auto">
                        {item.discount && Number(item.discount) > 0 ? (
                          <div>
                            <h4 className="text-sm text-gray-500 line-through">
                              $
                              {(
                                Number(item.price) * (item.quantity || 1)
                              ).toFixed(2)}
                            </h4>
                            <h4 className="text-sm text-teal-600 font-bold">
                              % {Number(item.discount)} de descuento
                            </h4>
                            <h4 className="text-lg font-bold text-gray-800">
                              $
                              {(
                                Number(item.price) *
                                (item.quantity || 1) *
                                (1 - Number(item.discount) / 100)
                              ).toFixed(2)}
                            </h4>
                          </div>
                        ) : (
                          <h4 className="text-lg font-bold text-gray-800">
                            $
                            {(
                              Number(item.price) * (item.quantity || 1)
                            ).toFixed(2)}
                          </h4>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl md:relative top-0 flex flex-col justify-between items-center shadow-2xl bg-gray-50 border border-gray-400 h-[450px]">
          <h2 className="text-xl font-bold h-10 flex justify-center items-center">
            Resumen de compra
          </h2>
          <hr className=" w-full " />
          <div className="flex flex-col gap-2 p-4 w-full">
            <ul className=" mt-8 space-y-4 w-full">
              <li className="flex flex-wrap gap-4 text-base w-full">
                Subtotal{" "}
                <span className="ml-auto font-medium text-lg">
                  ${subtotal.toFixed(2)}
                </span>
              </li>
              {descuento > 0 && (
                <li className="flex flex-wrap gap-4 text-lg font-medium">
                  Descuento{" "}
                  <span className="ml-auto font-bold">
                    -${descuento.toFixed(2)}
                  </span>
                </li>
              )}
              <li className="flex flex-wrap gap-4 text-base w-full">
                IVA (21%){" "}
                <span className="ml-auto font-medium text-lg">
                  ${iva.toFixed(2)}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-lg font-bold">
                Total <span className="ml-auto">${total.toFixed(2)}</span>
              </li>
            </ul>
          </div>
          <div className="mt-8 space-y-2 flex flex-col gap-2 lg:w-80 p-4 w-full">
            <button
              type="button"
              className="text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md bg-teal-600 text-white hover:bg-teal-800"
              onClick={() => {
                if (!session) {
                  Swal.fire({
                    icon: "warning",
                    title: "Ups!",
                    text: "Debes iniciar sesión para continuar con el pago.",
                    confirmButtonText: "Iniciar sesión",
                    confirmButtonColor: "#00897b",
                    allowOutsideClick: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      router.push("/login");
                    }
                  });
                } else {
                  setOpenModal(true);
                }
              }}
            >
              Ir a pagar
            </button>

            <Modal
              show={openModal}
              onClose={() => setOpenModal(false)}
              className="px-80 py-1/2 custom-modal-container"
            >
              <Modal.Header>Detalle de envío</Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                {loading === false ? (
                  <>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={!isDelivery && !isEditing}
                          onChange={() => {
                            setIsDelivery(false);
                            setIsEditing(false);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Enviar a domicilio</p>
                              <p className="text-gray-600">
                                {`${session?.address?.street} ${session?.address?.number} - ${session?.address?.locality}, ${session?.address?.province}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={isEditing}
                          onChange={() => {
                            setIsDelivery(false);
                            setIsEditing(true);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Otra dirección</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isEditing && (
                        <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                          <div className="flex gap-2 w-full">
                            <div className="w-1/2">
                              <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Dirección
                              </label>
                              <input
                                type="text"
                                name="address"
                                id="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="Ingrese su dirección"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                            <div className="w-1/2">
                              <label
                                htmlFor="number"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Número
                              </label>
                              <input
                                type="number"
                                name="number"
                                id="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="Número"
                                value={number}
                                onChange={(e) =>
                                  setNumber(Number(e.target.value))
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="province"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Provincia
                            </label>
                            <select
                              name="province"
                              id="province"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                              value={province}
                              onChange={(e) => setProvince(e.target.value)}
                            >
                              <option value="">Seleccione una provincia</option>
                              {Object.entries(provinceMapping).map(
                                ([key, value]) => (
                                  <option key={key} value={value}>
                                    {value}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className="flex gap-2 w-full">
                            <div className="w-1/2">
                              <label
                                htmlFor="zipcode"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Código Postal
                              </label>
                              <input
                                type="text"
                                name="zipcode"
                                id="zipcode"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="Código Postal"
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                              />
                            </div>
                            <div className="w-1/2">
                              <label
                                htmlFor="locality"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Localidad
                              </label>
                              <input
                                type="text"
                                name="locality"
                                id="locality"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="Localidad"
                                value={locality}
                                onChange={(e) => setLocality(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={isDelivery}
                          onChange={() => {
                            setIsDelivery(true);
                            setIsEditing(false);
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Retiro en local</p>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-900">Gratis</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-4">
                      <h4 className="block text-sm font-medium text-gray-900 dark:text-white">
                        ¿Qué tipo de factura necesitás?
                      </h4>
                      {/* // onChange={(e) => setIsDelivery(e.target.checked)} */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide rounded-md ${
                            invoiceType === "A"
                              ? "bg-teal-600 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => setInvoiceType("A")}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide rounded-md ${
                            invoiceType === "B"
                              ? "bg-teal-600 text-white"
                              : "bg-gray-200"
                          }`}
                          onClick={() => setInvoiceType("B")}
                        >
                          B
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <Spinner
                      color="teal"
                      className="h-12 w-12"
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                {session && session.role === "Cliente" ? (
                  <div className="w-full">
                    <button
                      onClick={() => handleCheckout("Cliente Cuenta Corriente")}
                      type="button"
                      className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-teal-600 text-white hover:bg-teal-800`}
                      disabled={
                        !session ||
                        cart.length === 0 ||
                        (isDelivery === false && street === "") ||
                        (needsInvoice && !invoiceType) ||
                        (account &&
                          account.balance + total > account.creditLimit)
                      }
                      title={
                        !session
                          ? "Necesita estar logueado para continuar con el pago"
                          : cart.length === 0
                          ? "El carrito está vacío"
                          : ""
                      }
                    >
                      <p>Agregar a cuenta corriente: $ {total}</p>
                      {account && (
                        <p>
                          <b
                            className={`${
                              account.balance + total > account.creditLimit
                                ? "text-red-500"
                                : "text-white"
                            }`}
                          >
                            $ {account.balance + total}
                          </b>{" "}
                          / $ {account?.creditLimit}
                        </p>
                      )}
                    </button>
                    <button
                      onClick={() => handleCheckout("Cliente Transferencia")}
                      type="button"
                      className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-blue-600 text-white hover:bg-blue-800`}
                      disabled={
                        !session ||
                        cart.length === 0 ||
                        (isDelivery === false && street === "") ||
                        (needsInvoice && !invoiceType)
                      }
                      title={
                        !session
                          ? "Necesita estar logueado para continuar con el pago"
                          : cart.length === 0
                          ? "El carrito está vacío"
                          : ""
                      }
                    >
                      Pago con transferencia bancaria
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout("Usuario")}
                    type="button"
                    className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-teal-600 text-white hover:bg-teal-800`}
                    disabled={
                      !session ||
                      cart.length === 0 ||
                      (needsInvoice && !invoiceType)
                    }
                    title={
                      !session
                        ? "Necesita estar logueado para continuar con el pago"
                        : cart.length === 0
                        ? "El carrito está vacío"
                        : ""
                    }
                  >
                    Ir a pagar
                  </button>
                )}
              </Modal.Footer>
            </Modal>
            <Link href="/categories">
              <button
                type="button"
                onClick={() => router.push("/home")}
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-gray-200 hover:bg-gray-500 text-teal-600 hover:shadow-xl hover:text-white rounded-md"
              >
                <FontAwesomeIcon
                  icon={faBagShopping}
                  style={{ width: "15px", height: "15px", marginRight: "5px" }}
                />
                Continuar comprando
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
