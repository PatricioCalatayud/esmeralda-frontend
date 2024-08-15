"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

import { jwtDecode } from "jwt-decode"; // Asegúrate de importar correctamente
import { useRouter } from "next/navigation";
import { getSessionGoogle, signOutWithGoogle } from "@/utils/singGoogle";
import { ISession } from "@/interfaces/ISession";
import Swal from "sweetalert2";
interface AuthContextType {
  session: ISession | undefined;
  handleSignOut: () => void;
  userGoogle: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {

  const [session, setSession] = useState<ISession | undefined>();
  const [userGoogle, setUserGoogle] = useState(false);
  const router = useRouter();
  //! Obtener token de usuario-Session
  useEffect(() => {
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        const parsedSession = JSON.parse(userSession);
        const token = parsedSession.accessToken;
        try {
        //decodifico el token
          const decodedToken: any = jwtDecode(token);
          console.log(decodedToken);
          // si hay token decodificado
          if (decodedToken) {
            // seteo la sesion con el token decodificado
            setSession({name: decodedToken.name,
                email: decodedToken.email,
                image: undefined,
                role: decodedToken.roles[0]});
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    
  }, []);
  useEffect(() => {
    const someFunction = async () => {
      const session = await getSessionGoogle();
      console.log(session); // Aquí tienes acceso a la data de la sesión

      if (session) {
        console.log("Usuario:", session.user);
        setSession({name: session.user?.name ?? "",
            email: session.user?.email ?? "",
            image: session.user?.image ?? "",
            role: "user"}),
        setUserGoogle(true);
      } else {
        console.log("No hay sesión activa");
      }
    };

    someFunction();
  }, []);

  //! Cerrar sesión
  const handleSignOut = () => {
    if (userGoogle === true) {
      signOutWithGoogle();
      //setUserGoogle(false);
      console.log("Cerrando sesión");
    }else{
        localStorage.removeItem("userSession");
        localStorage.removeItem("cart");
        //setUserSession(false);
        setSession(undefined);
    }
    Swal.fire("¡Hasta luego!", "Has cerrado sesión exitosamente", "success");
    router.push("/");
  };


  return <AuthContext.Provider value={{session, handleSignOut, userGoogle}}>{children}</AuthContext.Provider>;
};
