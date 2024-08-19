"use client";

import { useEffect, useState } from "react";

const IncrementProduct: React.FC<{
  stock: string;
  productId: string;
  initialQuantity: number;
  onQuantityChange: (quantity: number) => void;
}> = ({ productId, initialQuantity, onQuantityChange, stock }) => {
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
    <div className="flex gap-3 font-bold items-center">
      <button
        className="text-black border border-gray-600 w-6 h-6 font-bold flex justify-center items-center rounded-md disabled:bg-gray-300 disabled:border-none disabled:text-white"
        onClick={handleDecrease}
        disabled={quantity === 1}
      >
        -
      </button>
      {quantity}
      <button
        className="text-black border border-gray-600 w-6 h-6 font-bold flex justify-center items-center rounded-md disabled:bg-gray-300 disabled:border-none disabled:text-white"
        onClick={handleIncrease}
        disabled={quantity === Number(stock)}
      >
        +
      </button>
    </div>
  );
};

export default IncrementProduct;
