import { IOrders } from "@/interfaces/IOrders";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
export async function getOrders(userId: string, token: string | undefined) {
    try {
      const response = await axios.get(`${apiURL}/order/user/${userId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },});
      const products: IOrders[] = response.data;
      return products;
    } catch (error: any) {
      /*throw new Error(error);*/
      console.log(error);
    }
  }