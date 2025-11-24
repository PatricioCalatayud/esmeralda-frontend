"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { getSessionGoogle, signOutWithGoogle } from "@/utils/singGoogle";
import { ISession } from "@/interfaces/ISession";
import Swal from "sweetalert2";
import { LoginUser, NewUser } from "@/helpers/Autenticacion.helper";
import { useCartContext } from "./cart.context";
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
  const { setCartItemCount } = useCartContext();
  const router = useRouter();

  // Helper: Validar si un token JWT está expirado
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp) return false; // Si no tiene exp, asumimos que es válido
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true; // Si no se puede decodificar, considerarlo expirado
    }
  };

  // Helper: Validar estructura de localStorage
  const validateLocalStorage = (data: any): boolean => {
    return (
      data &&
      typeof data === "object" &&
      typeof data.accessToken === "string" &&
      data.accessToken.length > 0
    );
  };

  // Helper: Limpiar sesión corrupta
  const clearCorruptedSession = () => {
    localStorage.removeItem("userSession");
    localStorage.removeItem("idUser");
    setSession(undefined);
    setToken(undefined);
    setUserId(undefined);
    setUserGoogle(false);
  };

  //! Inicialización de autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Paso 1: Intentar cargar sesión desde localStorage
        const userSessionStr = localStorage.getItem("userSession");

        if (userSessionStr) {
          try {
            const parsedSession = JSON.parse(userSessionStr);

            // Validar estructura
            if (!validateLocalStorage(parsedSession)) {
              console.warn("localStorage corrupto, limpiando...");
              clearCorruptedSession();
              setAuthLoading(false);
              return;
            }

            const storedToken = parsedSession.accessToken;

            // Validar expiración del token
            if (isTokenExpired(storedToken)) {
              console.warn("Token expirado, limpiando sesión...");
              clearCorruptedSession();
              setAuthLoading(false);
              return;
            }

            // Token válido, restaurar sesión
            const decodedToken: any = jwtDecode(storedToken);

            setToken(storedToken);
            setUserId(decodedToken.sub);
            localStorage.setItem("idUser", decodedToken.sub);

            // Restaurar flag de usuario Google si existe
            const isGoogleUser = parsedSession.isGoogleUser === true;
            setUserGoogle(isGoogleUser);

            setSession({
              id: decodedToken.sub,
              name: decodedToken.name,
              email: decodedToken.email,
              image: parsedSession.user?.image,
              role: decodedToken.roles[0],
              phone: decodedToken.phone,
              address: decodedToken.address,
            });

            setAuthLoading(false);
            return; // Sesión restaurada exitosamente
          } catch (error) {
            console.error("Error procesando localStorage:", error);
            clearCorruptedSession();
          }
        }

        // Paso 2: Si no hay localStorage válido, intentar login con Google
        const sessionGoogle = await getSessionGoogle();

        if (sessionGoogle && sessionGoogle.user) {
          const user = { email: sessionGoogle.user.email as string };

          try {
            const responseLogin = await LoginUser(user);

            if (responseLogin && (responseLogin.status === 200 || responseLogin.status === 201)) {
              const token = responseLogin.data.accessToken;
              const decodedToken: any = jwtDecode(token);

              setToken(token);
              setUserId(decodedToken.sub);
              setUserGoogle(true);

              const sessionData = {
                id: decodedToken.sub,
                name: decodedToken.name,
                email: decodedToken.email,
                image: sessionGoogle.user?.image ?? "",
                role: decodedToken.roles[0],
                phone: decodedToken.phone,
                address: decodedToken.address,
              };

              setSession(sessionData);

              // Guardar en localStorage con flag de Google
              localStorage.setItem("userSession", JSON.stringify({
                accessToken: token,
                isGoogleUser: true,
                user: sessionData
              }));

              localStorage.setItem("idUser", decodedToken.sub);
            } else {
              // Solo mostrar error si realmente intentó login y falló (no por errores de red)
              Swal.fire({
                icon: "warning",
                title: "Ups!",
                text: "Correo no encontrado, por favor registrate para continuar con Google.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#00897b",
              });
            }
          } catch (error) {
            console.error("Error en login de Google:", error);
            // No mostrar error al usuario si es un fallo de red
          }
        }
      } catch (error) {
        console.error("Error en inicialización de auth:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);


  //! Cerrar sesión
  const handleSignOut = () => {
    // Cerrar sesión de Google si es usuario de Google
    if (userGoogle === true) {
      signOutWithGoogle();
    }

    // Limpiar todo el estado y localStorage
    localStorage.removeItem("userSession");
    localStorage.removeItem("idUser");
    localStorage.removeItem("cart");
    setCartItemCount(0);
    setSession(undefined);
    setUserId(undefined);
    setToken(undefined);
    setUserGoogle(false);

    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ session, handleSignOut, token, userId, authLoading, setSession, setToken,setUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
};