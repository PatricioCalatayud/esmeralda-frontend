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

export async function NewUser(user: any) {
  try {
    const res = await axios.post(`${apiURL}/auth/signup`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      console.log(`Error registrando usuario: ${res.status} - ${res.data.message}`);
    }

    return res;
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

export async function getUsers(token: string | undefined) {
  try {
    const response = await axios.get(`${apiURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users: ISession[] = response.data;
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
