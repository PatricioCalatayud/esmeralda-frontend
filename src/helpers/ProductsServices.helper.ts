import { IProductList, IProductUpdate } from "@/interfaces/IProductList";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


export async function getProducts(page?: number, limit?: number) {
  try {
    const res = await axios.get(`${apiURL}/products`,{
      params: {
        page,  // Pasar el número de página
        limit, // Pasar el límite de resultados por página
      },
    });
    console.log(res.data.data)
    const products: IProductList[] = res.data.data;
    return products;
  } catch (error: any) {
    console.log(error);
  }
}


export async function getProductById(id: string, token: string | undefined) {
  try {
          const res = await axios.get(`${apiURL}/products/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }, 
          });

          return res;
  } catch (error: any) {
    console.log(error);
  }
}

export async function postProducts(dataProduct: any, token: string | undefined) {
  console.log(token);
  try {
    const res = await axios.post(`${apiURL}/products`, dataProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error: any) {
    console.log(error);
  }
}

export async function putProducts(dataProduct: object,id: string, token: string | undefined) {
  console.log(dataProduct
  );
  console.log(id);
    try {
    const res = await axios.put(`${apiURL}/products/${id}`, dataProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (error: any) {
    /*throw new Error(error);*/
    console.log(error);
  }
}

export async function deleteProducts(id: string, token: string) {
  
  try {
    const response = await axios.delete(`${apiURL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //const products: IProductList[] = res.data;
    return response;
  } catch (error: any) {
    /*throw new Error(error);*/
    console.log(error);
  }
}



