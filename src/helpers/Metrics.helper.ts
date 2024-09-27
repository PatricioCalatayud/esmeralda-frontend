import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductMostSold( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/producto-mas-vendido`,{
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

  export async function getProductLeastSold( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/producto-menos-vendido`,{
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

  export async function getBestProducts( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/mejores-productos`,{
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

  export async function getWorstProducts( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/peores-productos`,{
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

  export async function getDebts( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/deudores`,{
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

  export async function getOrdersByUserMonth( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/pedidos-usuario-mes`,{
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

  export async function getProductsByMonth( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/productos-por-mes`,{
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

  export async function getProductsSold( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/metrics/productos-vendidos`,{
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

  export async function getCvs( token: string | undefined ) {
    try {
      const response = await axios.get(`${apiURL}/cvs/download`,{
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

  export async function uploadCvs( token: string | undefined ) {
    try {
      const response = await axios.post(`${apiURL}/cvs/upload`,{
        headers: {
          contentType: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        });
      const products = response.data.data;
      return products;
    } catch (error: any) {
      console.log(error);
    }
  }