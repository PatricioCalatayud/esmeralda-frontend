import { IOrderCheckout, IOrders } from "@/interfaces/IOrders";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllOrders( token: string | undefined , page?: number, limit?: number) {
  try {
    const response = await axios.get(`${apiURL}/order`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,  // Pasar el número de página
        limit, // Pasar el límite de resultados por página
      },});
    const products: IOrders[] = response.data.data;
    return products;
  } catch (error: any) {
    console.log(error);
  }
}
export async function getOrders(userId: string, token: string | undefined , page?: number, limit?: number) {
    try {
      const response = await axios.get(`${apiURL}/order/user/${userId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,  // Pasar el número de página
          limit, // Pasar el límite de resultados por página
        },});
      const products: IOrders[] = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
  }
// verificar
export async function getOrder(orderId: string, token: string | undefined ) {
  try {
    const response = await axios.get(`${apiURL}/order/${orderId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
    const product: IOrders = response.data;
    return product;
  } catch (error: any) {
    console.log(error);
  }
}

export async function postOrder(order: IOrderCheckout, token: string | undefined) { 
  try {
    const response = await axios.post(`${apiURL}/order`, order,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    return response;
  } catch (error: any) {
    console.log(error);
  }
}

export async function deleteOrder(orderId: string, token: string | undefined) {
  try {
    const response = await axios.delete(`${apiURL}/order/${orderId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    const product: IOrders = response.data;
    return product;
  } catch (error: any) {
    console.log(error);
  }
}

export async function putOrder(orderId: string, order: IOrders | {}, token: string | undefined) {
  
  try {
    console.log(order);
    const response = await axios.put(`${apiURL}/order/${orderId}`, order,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    const product: IOrders = response.data;
    return product;
  } catch (error: any) {
    console.log(error);
  }
}