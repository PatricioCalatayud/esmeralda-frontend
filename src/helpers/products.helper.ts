import { IProductList } from "@/interfaces/IProductList";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  try {
    const res = await fetch(`${apiURL}/products`);
    const products: IProductList[] = await res.json();
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getProductById(id: string) {
  try {
    const res = await fetch(`${apiURL}/products/${id}`);
    const product: IProductList = await res.json();
    return product;
  } catch (error: any) {
    throw new Error(error);
  }
}
