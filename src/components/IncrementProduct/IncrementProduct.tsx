"use client";

import { useEffect, useState } from "react";

const IncrementProduct: React.FC<{
  productId: string;
  initialQuantity: number;
  onQuantityChange: (quantity: number) => void;
}> = ({ productId, initialQuantity, onQuantityChange }) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  useEffect(() => {
    onQuantityChange(quantity);
  }, [quantity, onQuantityChange]);

  return (
    <div className="flex gap-4 my-6">
      <button
        className="text-white bg-gray-900 w-6 h-6 font-bold justify-center items-center rounded-md mx-2"
        onClick={handleDecrease}
      >
        -
      </button>
      {quantity}
      <button
        className="text-white bg-gray-900 w-6 h-6 font-bold justify-center items-center rounded-md mx-2"
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
};

export default IncrementProduct;
