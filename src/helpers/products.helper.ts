import { IProductList } from "@/interfaces/IProductList";
import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  try {
    const res = await axios.get(`${apiURL}/products`);
    const products: IProductList[] = res.data;
    console.log(products);
    return products;
  } catch (error: any) {
    throw new Error(error);
  }
}


export async function getProductById(id: string) {
  try {
    // Acceder al token desde el localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      const userSessionString = localStorage.getItem("userSession");

      if (userSessionString) {
        const userSession = JSON.parse(userSessionString);
        const accessToken = userSession.accessToken;

        if (accessToken) {
          // Realizar la solicitud con el token en los encabezados
          const res = await axios.get(`${apiURL}/products/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const product: IProductList = res.data;
          return product;
        } else {
          throw new Error("No se encontró el token de acceso.");
        }
      } else {
        throw new Error("No se encontró la sesión de usuario.");
      }
    } else {
      throw new Error("El acceso al localStorage no está disponible.");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
