import { IUserProps, IUserUpdateProps } from "@/interfaces/IUser";
import { ILoginProps } from "@/interfaces/ILogin";
import axios from "axios";
import { ISession } from "@/interfaces/ISession";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


//! Funcion para iniciar sesion
export async function LoginUser(user: ILoginProps) {
  try {
    const res = await axios.post(`${apiURL}/auth/signin`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error: any) {
    if (error.response) {
      console.log(`Error iniciando sesión: ${error.response.status} - ${
        error.response.data.message || error.response.statusText
      }`);
    } else if (error.request) {
      console.log("Error iniciando sesión: No se recibía respuesta del servidor.");
    } else {
      console.log(`Error iniciando sesión: ${error.message}`);
    }
  }

}
//! Funcion para registrar usuario

export async function NewUser(user: IUserProps): Promise<any> {
  try {
    const response = await axios.post(`${apiURL}/auth/signup`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Validate successful responses (status codes 200 or 201)
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Error registrando usuario: ${response.status} - ${response.data.message}`);
    }

    // Return the normalized response for further processing
    return {
      success: true,
      message: response.data.message, // Adjust based on your backend response structure
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors (network, request/response issues)
      if (error.response) {
        console.error(`Error registrando usuario (Axios): ${error.response.status} - ${error.response.data.message}`);
        return {
          success: false,
          message: error.response.data.message, // Adjust based on your backend response structure
        };
      } else if (error.request) {
        console.error("Error registrando usuario (Axios): No se recibía respuesta del servidor.");
        return {
          success: false,
          message: "Error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.", // Generic message for network issues
        };
      } else {
        console.error(`Error registrando usuario (Axios): ${error.message}`);
        return {
          success: false,
          message: "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.", // Generic message for other Axios errors
        };
      }
    } else {
      // Handle non-Axios errors (e.g., validation errors, unexpected issues)
      console.error(`Error registrando usuario (non-Axios): ${error.message}`);
      return {
        success: false,
        message: "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.", // Generic message for other errors
      };
    }
  }
}

export async function getUsers(token: string | undefined, page?: number, limit?: number) {
  try {
    const response = await axios.get(`${apiURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,  // Pasar el número de página
        limit, // Pasar el límite de resultados por página
      },
    });
    console.log(response);
    const users: ISession[] = response.data.data;
    return users;
  } catch (error: any) {
    console.log(error);
  }
}

export async function getUser(userId: string, token: string | undefined) { 
  try {
    const response = await axios.get(`${apiURL}/users/${userId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    const user: IUserProps = response.data;
    return user;
  } catch (error: any) {
    console.log(error);
  }
}

export async function putUser(userId: string, user: IUserUpdateProps, token: string | undefined) {
  try {
    const response = await axios.put(`${apiURL}/users/${userId}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: any) {
    console.log(error);
  }
}

export async function deleteUser(userId: string, token: string | undefined) {
  try {
    const response = await axios.delete(`${apiURL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const deletedUser: IUserProps = response.data; // Renombrar a 'deletedUser'
    return deletedUser;
  } catch (error: any) {
    console.log(error);
  }
}
