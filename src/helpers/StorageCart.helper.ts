import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "";

interface Product {
  id: string;
  cantidad: number;
}

interface StorageOrderPayload {
  userId: string;
  products: Product[];
}

export const createStorageOrder = async (payload: StorageOrderPayload) => {
  console.log(payload);
  try {
    const response = await axios.post(`${apiURL}/storage-order`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating storage order:", error);
    console.log(error);
  }
};

export const getStorageOrder = async (userId: string) => {
  try {
    const response = await axios.get(`${apiURL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching storage order:", error);
    console.log(error);
  }
};

export const clearStorageOrder = async (userId: string) => {
  try {
    const response = await axios.delete(`${apiURL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error clearing storage order:", error);
    console.log(error);
  }
};
