import { IUserProps } from "@/interfaces/IUser";
import { ILoginProps } from "@/interfaces/ILogin";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;


//! Funcion para iniciar sesion
export async function LoginUser(user: ILoginProps) {
  try {
    const res = await axios.post(`${apiURL}/users/signin`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      console.log(`Error al iniciar sesión : ${res.status} - ${res.data.message}`);
    }
    console.log(res.data);
    const login = res.data as ILoginProps;
    return login;
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

export async function NewUser(user: IUserProps): Promise<IUserProps | undefined> {
  try {
    const res = await axios.post(`${apiURL}/users/signup`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      console.log(`Error registrando usuario: ${res.status} - ${res.data.message}`);
    }
    console.log(res.data);
    const newUser = res.data as IUserProps;

    return newUser;
  } catch (error: any) {
    if (error.response) {
      console.log(`Error registrando usuario: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      console.log("Error registrando usuario: No se recibía respuesta del servidor.");
    } else {
      console.log(`Error registrando usuario: ${error.message}`);
    }
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

export async function putUser(userId: string, user: IUserProps, token: string | undefined) {
  try {
    const response = await axios.put(`${apiURL}/users/${userId}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedUser: IUserProps = response.data; // Renombrar a 'updatedUser'
    return updatedUser;
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
