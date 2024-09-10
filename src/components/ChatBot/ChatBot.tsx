"use client";

import { useAuthContext } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatBot from "react-chatbotify";
const urlLocal = process.env.NEXT_PUBLIC_URL_LOCAL;
const ChatBotEsmeralda = () => {
  const {session} = useAuthContext();
  const router = useRouter();
  const [flow, setFlow] = useState({});
  const helpClientOptions = ["Quiero comprar", "Quiero ver ofertas", "Quiero ver mis ordenes", "Quiero hablar con una persona"];
  const helpUserOptions = ["Quiero comprar", "Quiero ver ofertas",];
  const userOptions = ["Quiero iniciar sesion", "Quiero registrarme", "No, gracias"];
  useEffect(() => {
    if (session) {
      setFlow({
    
        start: {
          message: `Hola ${session.name}!`,
          transition: {duration: 1000},
          path: "step2"
          
        },
        step2: {
          message: "¿Que quieres hacer?",
          options: helpClientOptions,
          path: "process_options"
        },
    
        process_options: {
          transition: {duration: 0},
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            switch (params.userInput) {
            case "Quiero comprar":
              router.push (urlLocal + "/categories");
              await params.injectMessage("Ya estas aca, elige lo que quieras.");
              break;
            case "Quiero ver ofertas":
              router.push (urlLocal + "/promociones");
              await params.injectMessage("Ya estas aca, elige lo que quieras.");
              break;
            case "Quiero ver mis ordenes":
              router.push (urlLocal + "/dashboard/cliente/order");
              await params.injectMessage("Aca puedes revisar las ordenes.");
              break;
            case "Quiero hablar con una persona":
              link = "https://api.whatsapp.com/send?phone=541158803709";
              window.open(link, "_blank");
              await params.injectMessage("Aca puedes hablar con una persona.");
              break;
            default:
              return "unknown_input";
            }
            return "repeat"
          },
        },
        repeat: {
          transition: {duration: 3000},
          path: "step2"
        },
    
        end: {
          message: (params: any) => `Hola ${params.userInput}!`,
          chatDisabled: true
        } 
      });
    }else if (!session) {
      setFlow({
        start: {
          message: `Hola!`,
          transition: {duration: 1000},
          path: "step2"
        },
        step2: {
          message: `Te recomendamos que ingreses a tu cuenta o crees una.`,
        options: userOptions,
          path: "process_options"
        },
        process_options: {
          transition: {duration: 0},
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            switch (params.userInput) {
            case "Quiero iniciar sesion":
              router.push (urlLocal + "/login");
              await params.injectMessage("Ya estas aca, elige lo que quieras.");
              break;
            case "Quiero registrarme":
              router.push (urlLocal + "/register");
              await params.injectMessage("Ya estas aca, elige lo que quieras.");
              break;
            case "No, gracias":
              return "continue";
            case "Quiero hablar con una persona":
              link = "https://api.whatsapp.com/send?phone=541158803709";
              window.open(link, "_blank");
              await params.injectMessage("Aca puedes hablar con una persona.");
              break;
            default:
              return "unknown_input";
            }
            return "repeat"
          },
        },
        
        continue: {
          message: `Dale! que quieres hacer ?.`,
        options: helpUserOptions,
          path: "process_userOptions"
        },
        process_userOptions: {
          transition: {duration: 0},
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            switch (params.userInput) {
              case "Quiero comprar":
                router.push (urlLocal + "/categories");
                await params.injectMessage("Ya estas aca, elige lo que quieras.");
                break;
              case "Quiero ver ofertas":
                router.push (urlLocal + "/promociones");
                await params.injectMessage("Ya estas aca, elige lo que quieras.");
                break;
            
            default:
              return "unknown_input";
            }
            return "repeat"
          },
        },
        repeat: {
          transition: {duration: 3000},
          path: "step2"
        },
      });}
  }, [])
  
  const settings = {
    general: {
      embedded: false,
      primaryColor: '#00796b'
    },
    header:{
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

  }
  
  // styles here
  const styles = {
    headerStyle: {
      background: '#00796b',
      color: '#ffffff',
      padding: '10px',
      fontSize : '20px'
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