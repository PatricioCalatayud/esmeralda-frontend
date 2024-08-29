
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;



export async function CreateTestimony(data:any, token: string | undefined) {
  try {
    const response = await axios.post(`${apiURL}/testimony`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    return error;
  }

}
