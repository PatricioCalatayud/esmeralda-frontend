"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
const Cart = () => {
  const router = useRouter();
  const [cart, setCart] = useState<IProductList[]>([]);
  const { session } = useAuthContext();
  useEffect(() => {
    const fetchCart = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(cartItems);
    };

    fetchCart();
  }, []);

  const handleIncrease = (article_id: string) => {
    const newCart = cart.map((item) => {
      if (item.article_id === article_id) {
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleDecrease = (article_id: string) => {
    const newCart = cart.map((item) => {
      if (item.article_id === article_id) {
        return { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

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
        Swal.fire(
          "Eliminado",
          "El producto ha sido eliminado del carrito",
          "success"
        );
      }
    });
  };

  const calcularSubtotal = () => {
    return cart.reduce((acc, item) => {
      return acc + (item.quantity || 1) * Number(item.price);
    }, 0);
  };

  const calcularDescuento = () => {
    return cart.reduce((acc, item) => {
      return (
        acc +
        (item.quantity || 1) * (Number(item.price) * Number(item.discount || 0))
      );
    }, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento();
    return subtotal - descuento;
  };

  const subtotal = calcularSubtotal();
  const descuento = calcularDescuento();
  const total = calcularTotal();

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
                <button className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg">
                  Empezar a comprar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="font-sans max-w-4xl mx-auto py-20 h-screen">
      <h2 className="text-2xl font-bold text-gray-900">Carrito</h2>
      <div className="grid md:flex md:flex-row gap-4 mt-8">
      
        <div className="md:flex md:flex-row bg-white rounded-md">
          
          <hr className="border-white my-4" />

          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={item.article_id}
                className="grid sm:grid-cols-3 items-center gap-4 border border-gray-400 rounded-2xl px-4 py-2"
              >
                <div className="sm:col-span-2 flex items-center gap-4">
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
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base font-bold text-gray-800 text-nowrap">
                      {item.description} ({item.size})
                    </h3>
                    <div
                      onClick={() => removeFromCart(index)}
                      className="flex items-center text-sm font-semibold text-red-500 cursor-pointer gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Eliminar
                      
                    </div>
                    <div className="flex gap-3 font-bold">
                      <button
                        className="text-white border border-gray-900 w-6 h-6 font-bold flex justify-center items-center rounded-md "
                        onClick={() => handleDecrease(item.article_id)}
                      >
                        <FontAwesomeIcon icon={faMinus} style={{width: "10px", height: "10px", color : "black"}}/>
                      </button>
                      {item.quantity || 1}
                      <button
                        className="text-white border border-gray-900 w-6 h-6 font-bold flex justify-center items-center rounded-md "
                        onClick={() => handleIncrease(item.article_id)}
                      >
                        <FontAwesomeIcon icon={faPlus} style={{width: "10px", height: "10px", color : "black"}}/>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  {item.discount && Number(item.discount) > 0 ? (
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        $
                        {(
                          Number(item.price) *
                          (item.quantity || 1) *
                          (1 - Number(item.discount))
                        ).toFixed(2)}
                      </h4>
                      <h4 className="text-gray-500 line-through">
                        $
                        {(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                      </h4>
                    </div>
                  ) : (
                    <h4 className="text-lg font-bold text-gray-800">
                      ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </h4>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brown-800 rounded-xl p-4 md:sticky top-0 flex flex-col justify-between">
          <h2 className="text-xl font-bold text-white">Resumen de compra</h2>
            
          <ul className="text-white mt-8 space-y-4">
            <li className="flex flex-wrap gap-4 text-sm">
              Subtotal{" "}
              <span className="ml-auto font-bold">${subtotal.toFixed(2)}</span>
            </li>
            {descuento > 0 && (
              <li className="flex flex-wrap gap-4 text-lg font-medium">
                Descuento{" "}
                <span className="ml-auto font-bold">
                  -${descuento.toFixed(2)}
                </span>
              </li>
            )}
            <li className="flex flex-wrap gap-4 text-lg font-bold">
              Total <span className="ml-auto">${total.toFixed(2)}</span>
            </li>
          </ul>

          <div className="mt-8 space-y-2 flex flex-col gap-2 w-80">
            <Link href="/checkout">
              <button
                type="button"
                className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md ${
                  session && cart.length > 0
                    ? "bg-gray-200 hover:bg-gray-700 text-teal-600"
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
              >
                Ir a pagar
              </button>
            </Link>
            <Link href="/categories">
              <button
                type="button"
                onClick={() => router.push("/home")}
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-teal-600 text-white  hover:bg-green-800  rounded-md"
              >
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
