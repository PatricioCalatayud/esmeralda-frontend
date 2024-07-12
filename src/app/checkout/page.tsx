"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/interfaces/IProduct";
import MercadoPagoButton from "@/components/MercadoPago/MercadoPagoButton";

const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState<IProduct[]>([]);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [address, setAddress] = useState<string | null>(null);
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>("");

  useEffect(() => {
    const cartData = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as IProduct[];
    setCart(cartData);
  }, []);

  useEffect(() => {
    const allFieldsFilled = Boolean(user.name && user.email && address);
    setAllFieldsCompleted(allFieldsFilled);
  }, [user, address]);

  const calculateDiscountAmount = (price: number, discount: number) => {
    const validPrice = price || 0;
    const validDiscount = discount || 0;
    return validPrice * validDiscount;
  };

  const calcularTotalConDescuento = () => {
    return cart.reduce((acc, item) => {
      const validPrice = item.price || 0;
      const validDiscount = item.discount || 0;
      const validQuantity = item.quantity || 1;

      const discountedPrice = validPrice - validPrice * validDiscount;
      const itemTotal = discountedPrice * validQuantity;
      return acc + itemTotal;
    }, 0);
  };

  const totalConDescuento = calcularTotalConDescuento();
  const shippingCost = 0; // Costo de envío

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    const totalAmount = (totalConDescuento + shippingCost).toFixed(2);
    localStorage.setItem("totalAmount", totalAmount);
  }, [totalConDescuento]);

  return (
    <div className="font-sans bg-white h-full mb-20">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 max-lg:order-1 p-6 max-w-4xl mx-auto w-full">
            <form>
              <div>
                <h2 className="text-2xl font-extrabold text-[#333]">
                  Datos de envío
                </h2>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                    onChange={handleChange}
                    value={user.name}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    className="px-2 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                    onChange={handleChange}
                    value={user.email}
                    required
                  />
                </div>
              </div>

              <div className="mt-12 pb-6">
                <h2 className="text-2xl font-extrabold text-gray-800 my-5">
                  Método de Pago
                </h2>

                <div>
                  <MercadoPagoButton preferenceId={preferenceId} />
                </div>
              </div>
            </form>
          </div>

          {/* Mis pedidos */}
          <div className="lg:col-span-1 md:col-span-2 lg:h-auto lg:sticky lg:top-0 lg:overflow-y-auto flex flex-col">
            <div className="flex-1 p-8 bg-green-500 rounded-t-xl sticky top-0 z-20">
              <h2 className="text-2xl font-extrabold text-white">
                Mis Pedidos
              </h2>
              <div className="space-y-6 mt-10">
                {cart.map((item) => (
                  <div
                    key={item.article_id}
                    className="grid sm:grid-cols-2 items-start gap-6"
                  >
                    <div className="max-w-[190px] shrink-0 rounded-md">
                      <img
                        src={item.url_img}
                        className="w-40 h-full rounded-xl"
                        alt={item.description}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <h3 className="text-base text-white font-bold">
                        {item.description}
                      </h3>
                      <ul className="text-xs text-white space-y-2 mt-2">
                        <li className="flex flex-wrap gap-4">
                          Tamaño <span className="ml-auto">{item.size}</span>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Cantidad{" "}
                          <span className="ml-auto">{item.quantity || 1}</span>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Producto{" "}
                          <span className="ml-auto">
                            ${item.price.toFixed(2)}
                          </span>
                        </li>

                        {calculateDiscountAmount(
                          item.price,
                          item.discount || 0
                        ) > 0 && (
                          <li className="flex flex-wrap gap-4">
                            Descuento{" "}
                            <span className="ml-auto">
                              -$
                              {calculateDiscountAmount(
                                item.price,
                                item.discount || 0
                              ).toFixed(2)}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-green-800 p-4">
              <h4 className="text-base text-black font-bold">
                Envío: ${shippingCost.toFixed(2)}
              </h4>
            </div>
            <div className="bg-green-800 p-4 rounded-b-xl">
              <h4 className="text-base text-black font-bold">
                Total: ${(totalConDescuento + shippingCost).toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
