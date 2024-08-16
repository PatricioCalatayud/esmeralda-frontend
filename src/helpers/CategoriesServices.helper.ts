import { Category, IProductList } from "@/interfaces/IProductList";
import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(): Promise<Category[] | undefined> {
  try {
    const res = await axios.get(`${apiURL}/categories`);
    const categories: Category[] = res.data;
    return categories;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(`Failed to fetch categories: ${error.response?.status} - ${error.message}`);
    } else {
      console.log(`An unexpected error occurred: ${error.message}`);
    }
  }
}

export async function getProductsByCategory(
  categoryName: string
): Promise<IProductList[] | undefined> {
  try {
    const res = await axios.get(`${apiURL}/products?categories=${categoryName}`);
    const products: IProductList[] = res.data;
    return products;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(`Failed to fetch products for category "${categoryName}": ${error.response?.status} - ${error.message}`);
    } else {
      console.log(`An unexpected error occurred: ${error.message}`);
    }
  }
}
