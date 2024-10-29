import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductMostSold( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-mas-vendidos`,{
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

  export async function getProductLeastSold( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-menos-vendidos`,{
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

  export async function getBestProducts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/metrics/mejores-productos`,{
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

  export async function getWorstProducts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/metrics/peores-productos`,{
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

  export async function getDebts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/metrics/deudores`,{
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

  export async function getOrdersByUserMonth( token: string | undefined, date: Date ,userId: string ) {
    const body = {
      userId : userId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/pedidos-usuario-mes`, body, {
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

  export async function getProductsByMonth( token: string | undefined, date: Date ,productId: string) {
    const body = {
      productId: productId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-por-mes`,body,{
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

  export async function getProductsSold( token: string | undefined, productId: string, limit: number) {
    const body = {
      productId: productId,
      limit: limit
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-vendidos`, body,{
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

  export async function getCsv( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/csv/download`,{
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,'Content-Type': 'text/csv',
        },
        });
      const products = response.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
  }

  export async function uploadCsv( token: string | undefined, file: any) {
    try {
      const response = await axios.post(`${apiURL}/csv/upload`,file,{
        headers: {

          Authorization: `Bearer ${token}`,
        },
        });
      const products = response.data.data;
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
  export async function getProductsDistribution(token:string | undefined,deliveryId:string,date:string) { 
    const body = {
      deliveryId: deliveryId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/metrics/productos-por-reparto-por-mes`, body,{
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