import { IUser } from "@/interfaces/IUser";
import { ILoginProps } from "@/interfaces/ILogin";
import axios from "axios";


//! Funcion para iniciar sesion
export async function LoginUser(user: ILoginProps) {
  try {
    const res = await axios.post("http://localhost:3001/users/signin", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      /*throw new Error(
        `Error al iniciar sesión : ${res.status} - ${res.data.message}`
      );*/
      console.log(`Error al iniciar sesión : ${res.status} - ${res.data.message}`);
    }
    console.log(res.data);
    const login = res.data as ILoginProps;
    return login;
  } catch (error: any) {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango de 2xx
      /*throw new Error(
        `Error iniciando sesión: ${error.response.status} - ${
          error.response.data.message || error.response.statusText
        }`
      );*/
        
      console.log(`Error iniciando sesión: ${error.response.status} - ${
        error.response.data.message || error.response.statusText
      }`);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      /*throw new Error(
        "Error iniciando sesión: No se recibió respuesta del servidor."
      );*/

      console.log("Error iniciando sesión: No se recibía respuesta del servidor.");
    } else {
      // Algo sucedió al configurar la solicitud
      /*throw new Error(`Error iniciando sesión: ${error.message}`);*/

      console.log(`Error iniciando sesión: ${error.message}`);
    }
  }

}
//! Funcion para registrar usuario

export async function NewUser(user: IUser): Promise<IUser | undefined> {
  try {
    const res = await axios.post("http://localhost:3001/users/signup", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200 && res.status !== 201) {
      /*throw new Error(
        `Error registrando usuario: ${res.status} - ${res.data.message}`
      );*/

      console.log(`Error registrando usuario: ${res.status} - ${res.data.message}`);
    }
    console.log(res.data);
    const newUser = res.data as IUser;

    return newUser;
  } catch (error: any) {
    if (error.response) {
      /*
      throw new Error(
        `Error registrando usuario: ${error.response.status} - ${error.response.data.message}`
      );*/

      console.log(`Error registrando usuario: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      /*throw new Error(
        "Error registrando usuario: No se recibió respuesta del servidor."
      );*/

      console.log("Error registrando usuario: No se recibía respuesta del servidor.");
    } else {
      /*throw new Error(`Error registrando usuario: ${error.message}`);*/

      console.log(`Error registrando usuario: ${error.message}`);
    }
  }
}
