"use client";

import React, { useEffect, useRef } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

interface CheckoutProps {
  preferenceId: string;
}

const MercadoPagoButton: React.FC<CheckoutProps> = ({ preferenceId }) => {
  const mp = useRef<any>(null);

  useEffect(() => {
    if (mp.current) {
      mp.current.destroy();
    }

    mp.current = initMercadoPago(
      process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!,
      { locale: "es-AR" }
    );

    return () => {
      if (mp.current) {
        mp.current.destroy();
      }
    };
  }, [preferenceId]);

  return (
    <div>
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
};

export default MercadoPagoButton;
