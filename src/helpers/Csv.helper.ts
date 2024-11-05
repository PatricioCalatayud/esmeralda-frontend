import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


export async function getCsv( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/csv/download-products`,{
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
      const response = await axios.post(`${apiURL}/csv/updateproductsfromcsv`,file,{
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
  export async function csvProductMostSold( token: string | undefined ) {
    try {
      const response = await axios.post(
        `${apiURL}/csv/productos-mas-vendidos`,{
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

  export async function csvProductLeastSold( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/csv/productos-menos-vendidos`,{
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

  export async function csvBestProducts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/csv/mejores-productos`,{
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

  export async function csvWorstProducts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/csv/peores-productos`,{
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

  export async function csvDebts( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/csv/deudores`,{
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

  export async function csvOrdersByUserMonth( token: string | undefined, date: Date ,userId: string ) {
    const body = {
      userId : userId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/csv/pedidos-usuario-mes`, body, {
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

  export async function csvProductsByMonth( token: string | undefined, date: Date ,productId: string) {
    const body = {
      productId: productId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/csv/productos-por-mes`,body,{
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

  export async function csvProductsSold( token: string | undefined, productId: string, limit: number) {
    const body = {
      productId: productId,
      limit: limit
    }
    try {
      const response = await axios.post(`${apiURL}/csv/productos-vendidos`, body,{
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

  
  export async function csvProductsByMonthBonus(token:string | undefined,userId:string,date:string) { 
    const body = {
      userId: userId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/csv/productos-por-mes-usuario-bonificados`, body,{
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
  export async function csvProductsByMonthBonusAmount(token:string | undefined,userId:string,date:string) { 
    const body = {
      userId: userId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/csv/productos-por-mes-usuario-bonificados-importe`, body,{
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
  export async function csvProductsDistribution(token:string | undefined,deliveryId:string,date:string) { 
    const body = {
      deliveryId: deliveryId,
      date: date
    }
    try {
      const response = await axios.post(`${apiURL}/csv/productos-por-reparto-por-mes`, body,{
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