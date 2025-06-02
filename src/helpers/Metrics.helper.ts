import axios from "axios";

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
      console.error(error);
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
      const products = response.data;
      return products;
    } catch (error: any) {
      console.error(error);
    }
  }

  

  export async function getSales(token:string | undefined, startDate: string, endDate: string) {
    
  
    const body = {
      startDate: startDate,
      endDate: endDate,
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/sales`, body,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });
      const products = response.data;
      return products;
    } catch (error: any) {
      console.error(error);
    }
    
  }