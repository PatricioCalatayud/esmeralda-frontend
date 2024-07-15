import React, { useEffect } from "react";
import { Wallet } from "@mercadopago/sdk-react";

interface MercadoPagoButtonProps {
  preferenceId: string;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  preferenceId,
}) => {
  useEffect(() => {
    // Initialization is now handled in the Checkout component
  }, [preferenceId]);

  return (
    <div>
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
};

export default MercadoPagoButton;
