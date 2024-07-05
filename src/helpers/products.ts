import { IProduct } from "@/app/interfaces/IProduct";

export const products: IProduct[] = [
  {
    id: 1,
    name: "Café Molido Premium",
    categoryId: 1,
    price: 10.99,
    description: "Café molido de la mejor calidad.",
    imageUrl: "/images/cafe-molido-premium.jpg",
  },
  {
    id: 2,
    name: "Café en Granos Selecto",
    categoryId: 2,
    price: 12.99,
    description: "Café en granos seleccionado a mano.",
    imageUrl: "/images/cafe-en-granos-selecto.jpg",
  },
  {
    id: 3,
    name: "Café en Cápsulas Intenso",
    categoryId: 3,
    price: 8.99,
    description: "Cápsulas de café con un sabor intenso.",
    imageUrl: "/images/cafe-en-capsulas-intenso.jpg",
  },
  {
    id: 4,
    name: "Máquina de Café Expreso",
    categoryId: 4,
    price: 199.99,
    description: "Máquina de café expreso de alta calidad.",
    imageUrl: "/images/maquina-de-cafe-expreso.jpg",
  },
];

export const getProductsByCategory = (categoryId: number) => {
  return products.filter((product) => product.categoryId === categoryId);
};
