"use client";

import { useEffect, useRef, useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY as string, {
  locale: "es-AR",
});

interface PaymentComponentProps {
  cartItems: {
    title: string;
    unit_price: number;
    quantity: number;
  }[];
  user: {
    name: string;
    email: string;
  };
}

const MercadoPagoButton: React.FC<PaymentComponentProps> = ({
  cartItems,
  user,
}) => {
  const brickContainerRef = useRef<HTMLDivElement | null>(null);
  const [preferenceId, setPreferenceId] = useState<string>("");

  useEffect(() => {
    const createPreference = async () => {
      const response = await fetch("/api/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          payer: {
            name: user.name,
            email: user.email,
          },
        }),
      });

      const preference = await response.json();
      setPreferenceId(preference.id);
    };

    if (cartItems.length > 0 && user.name && user.email) {
      createPreference();
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (brickContainerRef.current && preferenceId) {
      const bricksBuilder = new window.MercadoPagoBricks();
      const renderBrick = async () => {
        await bricksBuilder.create("payment", "paymentbrick_container", {
          initialization: {
            amount: cartItems.reduce(
              (acc, item) => acc + item.unit_price * item.quantity,
              0
            ), // Total amount
            preferenceId: preferenceId,
            payer: {
              firstName: user.name.split(" ")[0],
              lastName: user.name.split(" ")[1] || "",
              email: user.email,
            },
          },
          customization: {
            visual: {
              style: {
                theme: "default",
              },
            },
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              bankTransfer: "all",
              atm: "all",
              onboarding_credits: "all",
              wallet_purchase: "all",
              maxInstallments: 1,
            },
          },
          callbacks: {
            onReady: () => {
              // Callback que se ejecuta cuando el Brick está listo.
            },
            onSubmit: (cardFormData: any) => {
              // Callback que se ejecuta cuando se envía el formulario de pago.
              return new Promise((resolve, reject) => {
                fetch("/api/process_payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(cardFormData),
                })
                  .then((response) => response.json())
                  .then((result) => {
                    if (result.error) {
                      reject(result);
                    } else {
                      resolve(result);
                    }
                  });
              });
            },
            onError: (error: any) => {
              // Callback que se ejecuta en caso de un error.
              console.error(error);
            },
          },
        });
      };

      renderBrick();
    }
  }, [preferenceId]);

  return <div id="paymentbrick_container" ref={brickContainerRef}></div>;
};

export default MercadoPagoButton;
