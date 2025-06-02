"use client";

import { useEffect, useState } from "react";
import { ICart } from "@/interfaces/IProductList";
import Image from "next/image";
import { postMarketPay } from "@/helpers/MarketPay.helper";
import MercadoPagoIcon from "@/components/footer/MercadoPagoIcon";
import { useAuthContext } from "@/context/auth.context";
import { Spinner } from "@material-tailwind/react";
import { IOrders } from "@/interfaces/IOrders";
import { getOrder } from "@/helpers/Order.helper";

const Checkout = ({ params }: { params: { id: string } }) => {
  const [order, setOrder] = useState<IOrders | null>(null);
  const [cart, setCart] = useState<ICart[]>([]);
  const [preferenceId, setPreferenceId] = useState<string>("");
  const { authLoading, token } = useAuthContext();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const cartData = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as ICart[];
    setCart(cartData);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(params.id, token);
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    if (params.id && token) {
      fetchOrder();
    }
  }, [params.id, token]);

  useEffect(() => {
    const createPreference = async (total: number) => {
      try {
        const linkPayment = {
          price: total,
          orderId: Number(params.id),
        };

        const response = await postMarketPay(linkPayment);
        if (response?.status === 200 || response?.status === 201) {
          setPreferenceId(response.data);
        }
      } catch (error) {
        console.error("Error creating payment preference:", error);
      }
    };

    if (order?.productsOrder?.length && order?.productsOrder?.length > 0) {
      const orderTotal = order.productsOrder.reduce((acc, item) => {
        return (
          acc +
          (Number(item.quantity) || 1) * Number(item.subproduct?.price || 0)
        );
      }, 0);
      const totalFinal = orderTotal * 1.21;
      createPreference(totalFinal);
    } else if (cart.length > 0) {
      const total = cart.reduce((acc, item) => {
        return acc + (Number(item.quantity) || 1) * Number(item.price || 0);
      }, 0);
      const totalFinal = total * 1.21;
      createPreference(totalFinal);
    }
  }, [cart, order, params.id]);

  const shippingCost = 0;

  const calcularSubtotal = () => {
    return (
      order?.productsOrder?.reduce((acc, item) => {
        return (
          acc +
          (Number(item.quantity) || 1) * Number(item.subproduct?.price || 0)
        );
      }, 0) || 0
    );
  };

  const calcularDescuento = () => {
    return (
      order?.productsOrder?.reduce((acc, item) => {
        const descuentoPorProducto =
          (Number(item.quantity) || 1) *
          (Number(item.subproduct?.price || 0) *
            (Number(item.subproduct?.discount || 0) / 100));
        return acc + descuentoPorProducto;
      }, 0) || 0
    );
  };

  const calcularIVA = () => {
    const subtotalConDescuento = calcularSubtotal() - calcularDescuento();
    return subtotalConDescuento * 0.21; // 21% de IVA
  };

  const calcularTotal = () => {
    const subtotalConDescuento = calcularSubtotal() - calcularDescuento();
    const iva = calcularIVA();
    return subtotalConDescuento + iva;
  };

  const subtotal = calcularSubtotal();
  const descuento = calcularDescuento();
  const iva = calcularIVA();
  const total = calcularTotal();

  return (
    <div className="font-sans bg-white h-full mb-20">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 py-6">
          {authLoading ? (
            <div className="flex px-6  mx-auto lg:col-span-2  w-full justify-center">
              <Spinner
                color="teal"
                className="h-12 w-12"
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={undefined}
              />
            </div>
          ) : (
            <div className="lg:col-span-2 max-lg:order-1 px-6 max-w-4xl mx-auto w-full">
              {preferenceId ? (
                <div className="flex justify-center items-center w-full h-full">
                  <a
                    href={preferenceId}
                    target="_blank"
                    className="flex justify-center items-center w-full bg-blue-500 hover:bg-blue-800 text-white gap-2 font-semibold rounded-xl py-2"
                  >
                    Pagar con Mercado Pago{" "}
                    <MercadoPagoIcon
                      color="#ffffff"
                      height={"32px"}
                      width={"32px"}
                    />
                  </a>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  {showMessage && (
                    <h1 className="text-3xl">No existe link de mercado pago</h1>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="lg:col-span-1 md:col-span-1 lg:h-auto lg:sticky lg:top-0 lg:overflow-y-auto flex flex-col  px-6 lg:px-0">
            <div className="flex-1 p-8 bg-teal-600 rounded-t-xl sticky top-0 shadow-2xl">
              <h2 className="text-2xl font-bold text-white w-full text-center">
                Mis Pedidos
              </h2>
              <hr className="my-6" />
              <div className="space-y-6 mt-10 max-h-[300px] overflow-y-auto px-2 w-full">
                {!order?.productsOrder || order.productsOrder.length === 0 ? (
                  <p className="text-white text-center">
                    No hay productos en la orden
                  </p>
                ) : (
                  order.productsOrder.map((item, index) => (
                    <div
                      key={index}
                      className="grid sm:grid-cols-2 items-start gap-6"
                    >
                      <div className="max-w-[190px] shrink-0 rounded-md">
                        <Image
                          width={200}
                          height={200}
                          src={`${process.env.NEXT_PUBLIC_API_URL}/product/${item.subproduct?.product?.imgUrl}`}
                          className="w-32 h-36 object-cover rounded-xl"
                          alt={item.subproduct?.product?.description || ""}
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <h3 className="text-base text-white font-bold">
                          {item.subproduct?.product?.description}
                        </h3>
                        <ul className="text-xs text-white space-y-2 mt-2">
                          <li className="flex flex-wrap gap-4">
                            Cantidad{" "}
                            <span className="ml-auto">{item.quantity}</span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Producto{" "}
                            <span className="ml-auto">
                              ${Number(item.subproduct?.price || 0)}
                            </span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Subtotal
                            <span className="ml-auto font-bold">
                              $
                              {(
                                Number(item.subproduct?.price || 0) *
                                Number(item.quantity)
                              ).toFixed(2)}
                            </span>
                          </li>
                          <li className="flex flex-wrap gap-4">
                            Descuento
                            {item.subproduct?.discount > 0 && (
                              <span className="ml-auto">
                                -$
                                {(
                                  Number(item.subproduct?.price || 0) *
                                  Number(item.quantity) *
                                  (item.subproduct?.discount / 100)
                                ).toFixed(2)}
                              </span>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-teal-800 py-4 px-8 rounded-b-xl gap-6 flex flex-col">
              <div className="flex justify-between">
                <h4 className="text-base text-white font-semibold">Envío:</h4>
                <h4 className="text-base text-white font-semibold">
                  ${shippingCost.toFixed(2)}
                </h4>
              </div>
              <hr />
              <div className="flex justify-between">
                <h4 className="text-md text-white font-semibold">Subtotal:</h4>
                <h4 className="text-md text-white font-semibold">
                  ${subtotal.toFixed(2)}
                </h4>
              </div>
              <div className="flex justify-between">
                <h4 className="text-md text-white font-semibold">Descuento:</h4>
                <h4 className="text-md text-white font-semibold">
                  -${descuento.toFixed(2)}
                </h4>
              </div>
              <hr />
              <div className="flex justify-between">
                <h4 className="text-md text-white font-semibold">IVA (21%):</h4>
                <h4 className="text-md text-white font-semibold">
                  ${iva.toFixed(2)}
                </h4>
              </div>
              <hr />
              <div className="flex justify-between">
                <h4 className="text-lg text-white font-bold">Total:</h4>
                <h4 className="text-lg text-white font-bold">
                  ${total.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
