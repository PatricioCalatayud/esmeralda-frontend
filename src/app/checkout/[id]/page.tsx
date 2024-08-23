"use client";

import { useEffect, useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import MercadoPagoButton from "@/components/MercadoPago/MercadoPagoButton";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { postMarketPay } from "@/helpers/MarketPay.helper";
import { useAuthContext } from "@/context/auth.context";
import MercadoPagoIcon from "@/components/footer/MercadoPagoIcon";

initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!, {
  locale: "es-AR",
});

const Checkout = ({ params }: { params: { id: string } }) => {
  const {token} = useAuthContext();
  const [cart, setCart] = useState<IProductList[]>([]);
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
    ) as IProductList[];
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

  const calcularTotalConDescuento = (cart: IProductList[]) => {
    return cart.reduce((acc, item) => {
      const validPrice = Number(item.price) || 0;
      const validDiscount = Number(item.discount) || 0;
      const validQuantity = Number(item.quantity) || 1;

      const discountedPrice = validPrice - validPrice * validDiscount;
      const itemTotal = discountedPrice * validQuantity;
      return acc + itemTotal;
    }, 0);
  };

  const totalConDescuento = calcularTotalConDescuento(cart);
  const shippingCost = 0; // Costo de envío

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    // Calcular el total con descuento y el costo de envío
    const totalConDescuento = calcularTotalConDescuento(cart);
    const totalAmount = (totalConDescuento + shippingCost).toFixed(2);
  
    // Crear la preferencia solo después de calcular el precio total

      createPreference(Number(totalAmount));
    
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  const createPreference = async (totalAmount: number) => {
    try {
      const linkPayment = {
        price: totalAmount,
        orderId: params.id,
      };
      console.log(linkPayment);
  
      const response = await postMarketPay(linkPayment);
      if (response?.status === 200 || response?.status === 201) {
      setPreferenceId(response.data);}
    } catch (error) {
      console.error("Error creating payment preference:", error);
    }
  };
  console.log(preferenceId);
  return (
    <div className="font-sans bg-white h-full mb-20">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 max-lg:order-1 p-6 max-w-4xl mx-auto w-full">
            {preferenceId ? <a href={preferenceId}	target="_blank" className="flex justify-center items-center bg-blue-500 hover:bg-blue-800 text-white gap-2 font-semibold rounded-xl py-2">Pagar con Mercado Pago <MercadoPagoIcon color="#ffffff" height={"32px"} width={"32px"} /></a> : <div className="flex justify-center items-center w-full h-full"><h1 className="text-3xl">No existe link de mercado pago</h1></div>}
          </div>

          {/* Mis pedidos */}
          <div className="lg:col-span-1 md:col-span-2 lg:h-auto lg:sticky lg:top-0 lg:overflow-y-auto flex flex-col  px-10 lg:px-0">
            <div className="flex-1 p-8 bg-teal-600 rounded-t-xl sticky top-0 shadow-2xl">
              <h2 className="text-2xl font-bold text-white w-full text-center">
                Mis Pedidos
              </h2>
              <hr  className="my-6"/>
              <div className="space-y-6 mt-10">
                {cart.map((item) => (
                  <div
                    key={item.article_id}
                    className="grid sm:grid-cols-2 items-start gap-6"
                  >
                    <div className="max-w-[190px] shrink-0 rounded-md">
                      <Image
                        width={500}
                        height={500}
                        src={item.imgUrl}
                        className="w-40 h-40 object-cover rounded-xl "
                        alt={item.description}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <h3 className="text-base text-white font-bold ">
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
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </li>

                        {calculateDiscountAmount(
                          Number(item.price),
                          Number(item.discount) || 0
                        ) > 0 && (
                          <li className="flex flex-wrap gap-4">
                            Descuento
                            <span className="ml-auto">
                              -$
                              {calculateDiscountAmount(
                                Number(item.price),
                                Number(item.discount) || 0
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
            <div className="bg-teal-800 py-4 px-8 rounded-b-xl gap-6 flex flex-col">
              <div className="flex justify-between">
              <h4 className="text-base text-white font-semibold">
                Envío:
              </h4>
              <h4 className="text-base text-white font-semibold">
                ${shippingCost.toFixed(2)}
              </h4>
              </div>
              <hr />
              <div className="flex justify-between">
              <h4 className="text-lg text-white font-bold">
                Total: 
              </h4>
              <h4 className="text-lg text-white font-bold">
                ${(totalConDescuento + shippingCost).toFixed(2)}
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
