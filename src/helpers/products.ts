import { IProduct } from "@/interfaces/IProduct";

export const products: IProduct[] = [
  {
    id: 1,
    name: "Café Molido Premium",
    categoryId: 1,
    price: 10.99,
    description: "Café molido de la mejor calidad.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/04/10/19/01/coffee-2210424_960_720.jpg",
  },
  {
    id: 2,
    name: "Café Molido Clásico",
    categoryId: 1,
    price: 9.99,
    description: "Café molido clásico para todos los gustos.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/05/07/15/08/coffee-756491_960_720.jpg",
  },
  {
    id: 3,
    name: "Café en Granos Selecto",
    categoryId: 2,
    price: 12.99,
    description: "Café en granos seleccionado a mano.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/20/10/55/coffee-1846611_960_720.jpg",
  },
  {
    id: 4,
    name: "Café en Granos Premium",
    categoryId: 2,
    price: 13.99,
    description: "Café en granos de la más alta calidad.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/08/10/02/12/coffee-2618560_960_720.jpg",
  },
  {
    id: 5,
    name: "Café en Cápsulas Intenso",
    categoryId: 3,
    price: 8.99,
    description: "Cápsulas de café con un sabor intenso.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/12/06/18/27/coffee-1885059_960_720.jpg",
  },
  {
    id: 6,
    name: "Café en Cápsulas Suave",
    categoryId: 3,
    price: 7.99,
    description: "Cápsulas de café con un sabor suave.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/18/15/05/capsules-1835629_960_720.jpg",
  },
  {
    id: 7,
    name: "Máquina de Café Expreso",
    categoryId: 4,
    price: 199.99,
    description: "Máquina de café expreso de alta calidad.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/29/10/07/coffee-1867322_960_720.jpg",
  },
  {
    id: 8,
    name: "Cafetera de Goteo",
    categoryId: 4,
    price: 59.99,
    description: "Cafetera de goteo fácil de usar.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/04/10/19/01/coffee-2210425_960_720.jpg",
  },
  {
    id: 9,
    name: "Café Orgánico",
    categoryId: 1,
    price: 14.99,
    description: "Café orgánico cultivado sin pesticidas.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/05/23/22/12/coffee-2339957_960_720.jpg",
  },
  {
    id: 10,
    name: "Café Descafeinado",
    categoryId: 2,
    price: 9.99,
    description: "Café descafeinado de sabor suave.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/04/21/22/52/coffee-1342060_960_720.jpg",
  },
  {
    id: 11,
    name: "Café de Comercio Justo",
    categoryId: 3,
    price: 11.99,
    description: "Café de comercio justo, apoyando a los agricultores.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/08/18/19/25/coffee-1603150_960_720.jpg",
  },
  {
    id: 12,
    name: "Máquina de Café Automática",
    categoryId: 4,
    price: 249.99,
    description: "Máquina de café automática con múltiples funciones.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/04/20/19/47/coffee-machine-1341318_960_720.jpg",
  },
];

export const getProductsByCategory = (categoryId: number) => {
  return products.filter((product) => product.categoryId === categoryId);
};
