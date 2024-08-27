
import { IMercadoPago } from "@/interfaces/IMercadoPago";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
export async function postMarketPay(data: IMercadoPago | undefined) {
    
    try {
        const response = await axios.post(`${apiURL}/mercadopago/url-process`,data
          );
        return response;
    }
    catch (error) {
        console.error("Error creating payment preference:", error);
    } 
}
