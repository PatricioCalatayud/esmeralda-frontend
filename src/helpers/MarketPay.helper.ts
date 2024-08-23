
import { IMercadoPago } from "@/interfaces/IMercadoPago";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
export async function postMarketPay(data: IMercadoPago | undefined,token: string | undefined) {
    
    try {
        console.log(data);
        console.log(token);
        const response = await axios.post(`${apiURL}/mercadopago/url-process`,{data}, {
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido es correcto
              },
          });
          console.log(response);
        return response.data;
    }
    catch (error) {
        console.error("Error creating payment preference:", error);
    } 
}
