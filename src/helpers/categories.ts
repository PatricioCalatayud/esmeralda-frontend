import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

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

//! Get all categories
export async function getCategories() {
  try {
    const res = await axios.get(`${apiURL}/categories`);
    return res.data;
    console.log(res.data);
  } catch (error: any) {
    /*throw new Error(`Error fetching categories: ${error.message}`);*/
    console.log(`Error fetching categories: ${error.message}`);
  }
}
