import axios from "axios";
import { pages } from "next/dist/build/templates/app-page";
import { start } from "repl";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

  export async function getDebts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/metrics/clients`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
      const products = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
  }



  export async function getProductsSold( token: string | undefined, startDate: string, endDate: string, limit: number, page: number, filter: string) {
    const body = {
      page: page,
      startDate: startDate,
      endDate: endDate,
      limit: limit,
      filter: filter
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/products`, body,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        console.log(response.data);
      const products = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
  }

  
  export async function getProductsByMonthBonus(token:string | undefined,userId:string,date:string) { 
    const body = {
      userId: userId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-por-mes-usuario-bonificados`, body,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        console.log(response.data);
      const products = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
    
  }
  export async function getProductsByMonthBonusAmount(token:string | undefined,userId:string,date:string) { 
    const body = {
      userId: userId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-por-mes-usuario-bonificados-importe`, body,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        console.log(response.data);
      const products = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
    
  }
  export async function getProductsCargoySinCargo(token:string | undefined,deliveryId:string,date:string) { 
    const body = {
      deliveryId: deliveryId, // revisar este dato
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-cargo-y-sin-cargo-por-mes-detallado`, body,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
        console.log(response.data);
      const products = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
    
  }