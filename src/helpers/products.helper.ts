import { IProductList } from "@/interfaces/IProductList";
import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  try {
    const res = await axios.get(`${apiURL}/products`);
    const products: IProductList[] = res.data;
    console.log(products);
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}


export async function getProductById(id: string) {
  try {
    const res = await axios.get(`${apiURL}/products/${id}`);
    const product: IProductList = res.data;
    return product;
  } catch (error: any) {
    throw new Error(error);
  }
}
