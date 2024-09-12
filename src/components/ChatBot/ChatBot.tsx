"use client"; // Asegura que este componente solo se ejecute en el cliente

import { useAuthContext } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const ChatBot = dynamic(() => import("react-chatbotify"), { ssr: false });
const urlLocal = process.env.NEXT_PUBLIC_URL_LOCAL;

const ChatBotEsmeralda = () => {
  const { session } = useAuthContext();
  const router = useRouter();
  const [flow, setFlow] = useState({});

  const helpClientOptions = [
    "Quiero comprar", 
    "Ver ofertas", 
    "Ver mis ordenes", 
    "Quiero hablar con una persona"
  ];

  const helpUserOptions = [
    "Quiero comprar", 
    "Ver ofertas"
  ];

  const userOptions = [
    "Iniciar sesion", 
    "Registrarme", 
    "No, gracias"
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return; // Evita que el código se ejecute en el servidor

    if (session) {
      setFlow({
        start: {
          message: `Hola ${session.name}!`,
          transition: { duration: 1000 },
          path: "step2",
        },
        step2: {
          message: "¿Que quieres hacer?",
          options: helpClientOptions,
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            switch (params.userInput) {
              case "Quiero comprar":
                router.push(urlLocal + "/categories");
                setTimeout(async() => {
                  await params.injectMessage("Ya estás acá, elige lo que quieras.");
                }, 2000); 
                break;
              case "Ver ofertas":
                router.push(urlLocal + "/promociones");
                setTimeout(async() => {
                  await params.injectMessage("Ya estás acá, elige lo que quieras.");
                }, 2000); 
                break;
              case "Ver mis ordenes":
                router.push(urlLocal + "/dashboard/cliente/order");
                setTimeout(async() => {
                  await params.injectMessage("Aquí puedes revisar las ordenes.");
                }, 2000); 
                
                break;
              case "Quiero hablar con una persona":
                link = "https://api.whatsapp.com/send?phone=541158803709";
                window.open(link, "_blank");
                await params.injectMessage("Aquí puedes hablar con una persona.");
                break;
              default:
                return "unknown_input";
            }
            return "repeat";
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step2",
        },
      });
    } else {
      setFlow({
        start: {
          message: `Hola!`,
          transition: { duration: 1000 },
          path: "step2",
        },
        step2: {
          message: `Te recomendamos que ingreses a tu cuenta o crees una.`,
          options: userOptions,
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            switch (params.userInput) {
              case "Iniciar sesion":
                router.push(urlLocal + "/login");
                setTimeout(async() => {
                  await params.injectMessage("Ya estás acá, puedes iniciar sessión.");
                }, 2000); 
                break;
              case "Registrarme":
                router.push(urlLocal + "/register");
                setTimeout(async() => {
                  await params.injectMessage("Ya estás acá, registrate.");
                }, 2000); 
                break;
              case "No, gracias":
                return "continue";
              default:
                return "unknown_input";
            }
            return "repeat";
          },
        },
      });
    }
  }, [session]);

  const settings = {
    general: {
      embedded: false,
      primaryColor: '#00796b',
    },
    header: {
      title: "EsmeraldaBot",
      avatar: "/Recurso1.png",
    },
    chatButton: {
      icon: "/Recurso1.png",
    },
    botBubble:{
      avatar: "/Recurso1.png",
    },
    tooltip: {
      text: "Tienes alguna pregunta ?",

    },
    notification: {
      showCount: false,
    },
    chatHistory: {
      storageKey: "messages_bot"
    }
  };

  const styles = {
    headerStyle: {
      background: '#00796b',
      color: '#ffffff',
      padding: '10px',
      fontSize: '20px',
    },
    chatWindowStyle: {
      backgroundColor: '#f2f2f2',
    },
    botAvatarStyle: {
      backgroundColor: '#00796b',
    },
    chatButtonStyle: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '120px',
      zIndex: 50,
    },
    tooltipStyle: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '210px',
      zIndex: 50,
      fontSize: '15px',
      
    },
  };

  return (
    <ChatBot styles={styles} settings={settings} flow={flow} />
  );
};

export default ChatBotEsmeralda;
