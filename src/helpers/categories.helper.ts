import { Category, IProductList } from "@/interfaces/IProductList";
import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await axios.get(`${apiURL}/category`);
    const categories: Category[] = res.data;
    return categories;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getProductsByCategory(
  categoryName: string
): Promise<IProductList[]> {
  try {
    const res = await axios.get(`${apiURL}/products?category=${categoryName}`);
    const products: IProductList[] = res.data;
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}
