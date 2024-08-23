import React, { useEffect } from "react";
import { Wallet } from "@mercadopago/sdk-react";

interface MercadoPagoButtonProps {
  preferenceId: string;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  preferenceId,

}) => {
  useEffect(() => {}, [preferenceId]);

  return (
    <div>
      <Wallet initialization={{ preferenceId, redirectMode: "blank" }} />
    </div>
  );
};

export default MercadoPagoButton;
