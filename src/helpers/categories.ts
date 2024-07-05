export const categories = [
  {
    id: 1,
    name: "Café Molido",
    slug: "cafe-molido",
  },
  {
    id: 2,
    name: "Café en Granos",
    slug: "cafe-en-granos",
  },
  {
    id: 3,
    name: "Café en Cápsulas",
    slug: "cafe-en-capsulas",
  },
  {
    id: 4,
    name: "Máquinas",
    slug: "maquinas",
  },
];

export const getCategoryById = (id: number) => {
  return categories.find((category) => category.id === id);
};
