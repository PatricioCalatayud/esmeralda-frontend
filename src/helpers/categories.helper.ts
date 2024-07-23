import { ICategory, IProductList } from "@/interfaces/IProductList";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getCategories(): Promise<ICategory[]> {
  try {
    const res = await fetch(`${apiURL}/category`);
    const categories: ICategory[] = await res.json();
    return categories;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getProductsByCategory(
  categoryName: string
): Promise<IProductList[]> {
  try {
    const res = await fetch(`${apiURL}/products?category=${categoryName}`);
    const products: IProductList[] = await res.json();
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}
