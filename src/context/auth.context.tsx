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
  token: string | undefined;
  userId: string | undefined;
  authLoading: boolean;
  setSession: (session: ISession | undefined) => void;
  setToken: (value: string) => void;
  setUserId: (value: string) => void;
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
  const [token, setToken] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [authLoading, setAuthLoading] = useState(true);

  const router = useRouter();
  //! Obtener token de usuario-Session
  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      const parsedSession = JSON.parse(userSession);
      const token = parsedSession.accessToken;
      setToken(token);
      try {
        //decodifico el token
        const decodedToken: any = jwtDecode(token);
        // si hay token decodificado
        if (decodedToken) {
          setUserId(decodedToken.sub);
          // seteo la sesion con el token decodificado
          setSession({
            id: decodedToken.sub,
            name: decodedToken.name,
            email: decodedToken.email,
            image: undefined,
            role: decodedToken.roles[0],
            phone: decodedToken.phone,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      setAuthLoading(false);
    }
    
  }, []);
  useEffect(() => {
    const someFunction = async () => {
      const sessionGoogle = await getSessionGoogle();
      console.log(sessionGoogle); // Aquí tienes acceso a la data de la sesión
  
      if (sessionGoogle) {
        console.log("Usuario:", sessionGoogle.user);
        setSession({
          id: sessionGoogle.user?.id ?? "",
          name: sessionGoogle.user?.name ?? "",
          email: sessionGoogle.user?.email ?? "",
          image: sessionGoogle.user?.image ?? "",
          role: "user",
          phone: undefined,
        }),
        setUserGoogle(true);
      } else {
        console.log("No hay sesión activa");
      }
      setAuthLoading(false);
    };
  
    someFunction();
  }, []);

  //! Cerrar sesión
  const handleSignOut = () => {
    if (userGoogle === true) {
      signOutWithGoogle();
      //setUserGoogle(false);
      console.log("Cerrando sesión");
    } else {
      localStorage.removeItem("userSession");
      localStorage.removeItem("cart");
      //setUserSession(false);
      setSession(undefined);
    }
    Swal.fire("¡Hasta luego!", "Has cerrado sesión exitosamente", "success");
    router.push("/");
  };
  console.log(session);

  return (
    <AuthContext.Provider
      value={{ session, handleSignOut, token, userId, authLoading, setSession, setToken,setUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
};
