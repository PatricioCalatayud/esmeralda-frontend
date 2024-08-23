
import { IMercadoPago } from "@/interfaces/IMercadoPago";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
export async function postMarketPay(data: IMercadoPago | undefined) {
    
    try {
        console.log(data);
        const response = await axios.post(`${apiURL}/mercadopago/url-process`,data
          );
          console.log(response);
        return response;
    }
    catch (error) {
        console.error("Error creating payment preference:", error);
    } 
}
