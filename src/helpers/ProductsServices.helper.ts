import { IProductList, IProductUpdate } from "@/interfaces/IProductList";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


export async function getProducts() {
  try {
    const res = await axios.get(`${apiURL}/products`);
    const products: IProductList[] = res.data;
    return products;
  } catch (error: any) {
    console.log(error);
  }
}


export async function getProductById(id: string, token: string | undefined) {
  try {
          const res = await axios.get(`${apiURL}/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }, 
          });
          console.log(res)
          const product: IProductList = res.data;
          return product;
  } catch (error: any) {
    console.log(error);
  }
}

export async function postProducts(dataProduct: any, token: string | undefined) {
  
  try {
    const res = await axios.post(`${apiURL}/products`, dataProduct, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    //const products: IProductList[] = res.data;
    //return products;
  } catch (error: any) {
    console.log(error);
  }
}

export async function putProducts(dataProduct: object,id: string, token: string | undefined) {
  
  try {
    const res = await axios.put(`${apiURL}/products/${id}`, dataProduct, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //const products: IProductList[] = res.data;
    //return products;
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



