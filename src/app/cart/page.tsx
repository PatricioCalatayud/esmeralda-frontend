"use client";

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

const Cart = () => {
  const router = useRouter();
  const [cart, setCart] = useState<ICart[]>([]);
  const { session, token } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);
  const [addresOrder, setAddresOrder] = useState("");
  const [isDelivery, setIsDelivery] = useState(false);
  const { setCartItemCount } = useCartContext();
  const [account, setAccount] = useState<IAccountProps>();
  const [loading, setLoading] = useState(false);

  // Variables agregadas
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [invoiceType, setInvoiceType] = useState<string>("");

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
      // Aplicar descuento como un porcentaje del precio
      const descuentoPorProducto =
        (item.quantity || 1) *
        (Number(item.price) * (Number(item.discount || 0) / 100));
      return acc + descuentoPorProducto;
    }, 0);
  };

  //! Función para calcular el IVA (21%)
  const calcularIVA = () => {
    const subtotal = calcularSubtotal();
    return subtotal * 0.21; // 21% de IVA
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

  //! Función para realizar la orden
  const handleCheckout = async (boton: string) => {
    const products = cart.map((product) => ({
      productId: product.idProduct,
      subproductId: product.idSubProduct,
      quantity: product.quantity,
    }));
    setLoading(true);
    const orderCheckout = {
      userId: session?.id,
      products,
      ...(addresOrder && isDelivery === false && { address: addresOrder }), // Condicionalmente agregar la dirección
      discount: 10,
      ...(session?.role === "Cliente" &&
        boton === "Cliente Transferencia" && { account: "Transferencia" }),
      ...(session?.role === "Cliente" &&
        boton === "Cliente Cuenta Corriente" && { account: "Cuenta corriente" }),
      ...(needsInvoice && { invoiceType }), // Agregar tipo de factura si está seleccionada
    };
    console.log( "Esto es orderCheckout", orderCheckout);
    const order = await postOrder(orderCheckout, token);
    console.log(order);

    if (order?.status === 200 || order?.status === 201) {
      if (session?.role === "Usuario") {
        setTimeout(() => {
          router.push(`/checkout/${order.data.id}`);
        }, 1500);
      } else if (session?.role === "Cliente" && boton === "Cliente Transferencia") {
        setTimeout(() => {
          router.push(`/transfer/${order.data.id}`);
        }, 1500);
      } else if (session?.role === "Cliente" && boton === "Cliente Cuenta Corriente") {
        setTimeout(() => {
          setCartItemCount(0);
          localStorage.removeItem("cart");
          router.push(`/dashboard/cliente/order`);
        }, 1500);
      }
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Hubo un error al realizar tu pedido",
        showConfirmButton: false,
        timer: 1500,
      });
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
    <div className="font-sans w-3/4 mx-auto  h-screen ">
      <div className="grid md:flex md:flex-row gap-4 mt-8 justify-between py-10">
        <div className="bg-white rounded-md w-full 0">
          <h2 className="text-2xl font-bold text-gray-900 h-10 flex  justify-center items-center">
            Tus Articulos
          </h2>
          <hr className=" w-full " />
          <div className="space-y-4 w-full mt-4">
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
                          disabled={item.quantity === Number(item.stock)}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ width: "10px", height: "10px" }}
                          />
                        </button>
                        <p className="text-gray-800 text-xs text-nowrap">
                          {item.stock} disponibles
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

        <div className="rounded-xl md:sticky top-0 flex flex-col justify-between items-center shadow-2xl bg-gray-50 border border-gray-400">
          <h2 className="text-xl font-bold  h-10 flex  justify-center items-center">
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
              className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md ${
                session && cart.length > 0
                  ? "  bg-teal-600 text-white  hover:bg-teal-800   "
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
              disabled={!session || cart.length === 0}
              title={
                !session
                  ? "Necesita estar logueado para continuar con el pago"
                  : cart.length === 0
                  ? "El carrito está vacío"
                  : ""
              }
              onClick={() => setOpenModal(true)}
            >
              Ir a pagar
            </button>
            <Modal
              show={openModal}
              onClose={() => setOpenModal(false)}
              className="px-80 py-40 custom-modal-container"
            >
              <Modal.Header>Detalle de envio</Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                {loading === false ? (
                  <>
                    <div className="w-full h-20 gap-4 flex flex-col">
                      <label
                        htmlFor="addresOrder"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Dirección de envio
                      </label>
                      <input
                        type="text"
                        name="addresOrder"
                        id="addresOrder"
                        className="bg-gray-50 border border-gray-300 text-gray-900 disabled:bg-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                        placeholder="Avenida San Martin 123"
                        value={addresOrder}
                        onChange={(e) => setAddresOrder(e.target.value)}
                        disabled={isDelivery === true}
                      />
                    </div>
                    <div className="flex gap-4 items-center h-20">
                      <h4 className="block text-sm font-medium text-gray-900 dark:text-white">
                        Retiro en local
                      </h4>
                      <input
                        type="checkbox"
                        name="isDelivery"
                        id="isDelivery"
                        onChange={(e) => setIsDelivery(e.target.checked)}
                      />
                    </div>

                    {/* Agregado: Botón para preguntar si necesita factura */}
                    <div className="flex gap-4 items-center h-20">
                      <h4 className="block text-sm font-medium text-gray-900 dark:text-white">
                        ¿Necesitas Factura?
                      </h4>
                      <input
                        type="checkbox"
                        name="needsInvoice"
                        id="needsInvoice"
                        onChange={(e) => setNeedsInvoice(e.target.checked)}
                      />
                    </div>

                    {/* Agregado: Si necesita factura, mostrar los tipos A, B, C */}
                    {needsInvoice && (
                      <div className="flex flex-col gap-4">
                        <h4 className="block text-sm font-medium text-gray-900 dark:text-white">
                          ¿Qué tipo de factura necesitas?
                        </h4>
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
                          <button
                            type="button"
                            className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide rounded-md ${
                              invoiceType === "C"
                                ? "bg-teal-600 text-white"
                                : "bg-gray-200"
                            }`}
                            onClick={() => setInvoiceType("C")}
                          >
                            C
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <Spinner
                      color="teal"
                      className="h-12 w-12"
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
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
                      className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-teal-600 text-white  hover:bg-teal-800`}
                      disabled={
                        !session ||
                        cart.length === 0 ||
                        (isDelivery === false && addresOrder === "") ||
                        account && account.balance + total > account.creditLimit
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
                          {" "}
                          <b
                            className={`${
                              account.balance + total > account.creditLimit
                                ? "text-red-500"
                                : "text-white"
                            }`}
                          >
                            $ {account.balance + total}{" "}
                          </b>/ $ {account?.creditLimit}
                        </p>
                      )}
                    </button>
                    <button
                      onClick={() => handleCheckout("Cliente Transferencia")}
                      type="button"
                      className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-blue-600 text-white  hover:bg-blue-800`}
                      disabled={
                        !session ||
                        cart.length === 0 ||
                        (isDelivery === false && addresOrder === "")
                      }
                      title={
                        !session
                          ? "Necesita estar logueado para continuar con el pago"
                          : cart.length === 0
                          ? "El carrito está vacío"
                          : ""
                      }
                    >
                      Pago con trasnferencia bancaria
                    </button>{" "}
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout("Usuario")}
                    type="button"
                    className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-teal-600 text-white  hover:bg-teal-800`}
                    disabled={
                      !session ||
                      cart.length === 0 ||
                      (isDelivery === false && addresOrder === "")
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