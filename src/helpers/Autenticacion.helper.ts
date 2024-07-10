import { IUser } from "@/interfaces/IUser";
import { ILoginProps } from "@/types/login";
import axios from "axios";
import { headers } from "next/headers";

//! Funcion para iniciar sesion
export async function LoginUser(user: ILoginProps): Promise<IUser> {
    try {
        const res = await axios.post("http://localhost:3001/auth/sigin", user, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status !== 200) {
            throw new Error(`Error iniciando sesion: ${res.status} - ${res.data.message}`);
        }

        const User = res.data;
        console.log(User);

        return User;
    } catch (error: any) {
        throw new Error(`Error iniciando sesion: ${error.message}`);
    }
}


  