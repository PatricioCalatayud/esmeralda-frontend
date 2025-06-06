import { IAccountPayment, IOrderCheckout, IOrders } from "@/interfaces/IOrders";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllOrders( token: string | undefined , page?: number, limit?: number) {
  try {
    const response = await axios.get(`${apiURL}/order`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
      },});
    const products: IOrders[] = response.data.data;
    return {products, totalOrders: response.data.total};
  } catch (error: any) {
    console.error(error);
  }
}
export async function getOrders(userId: string, token: string | undefined , page?: number, limit?: number) {
    try {
      const response = await axios.get(`${apiURL}/order/user/${userId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },});
      const data = response.data.data;
      return {data, totalOrders: response.data.total};
    } catch (error: any) {
      console.error(error);
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
    console.error(error);
  }
}
export async function postOrder(order: IOrderCheckout, token: string | undefined) { 

  try {
    const response = await axios.post(`${apiURL}/order`, order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error("Error en el servidor:", error.response.data);
      console.error("Estado HTTP:", error.response.status);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      // Algo pasó al configurar la solicitud
      console.error("Error en la configuración de la solicitud:", error.message);
    }
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
    console.error(error);
  }
}

export async function putOrder(orderId: string, order: IOrders | {}, token: string | undefined) {
  
  try {
    const response = await axios.put(`${apiURL}/order/${orderId}`, order,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});

    return response;
  } catch (error: any) {
    console.error(error);
  }
}
export async function putOrderTransaction( file: IOrders | {}, token: string | undefined) {
  
  try {

    const response = await axios.put(`${apiURL}/image/transfer`, file,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});

    return response;
  } catch (error: any) {
    console.error(error);
  }
}

export async function putAccountPayment( data: IAccountPayment, token: string | undefined) {
  
  try {

    const response = await axios.put(`${apiURL}/account/payment`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});

    return response;
  } catch (error: any) {
    console.error(error);
  }
}