"use client"; // Asegura que este componente solo se ejecute en el cliente

import { useAuthContext } from "@/context/auth.context";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useProductContext } from "@/context/product.context";
import { IProductList } from "@/interfaces/IProductList";
import { step } from "@material-tailwind/react";

const ChatBot = dynamic(() => import("react-chatbotify"), { ssr: false });
const urlLocal = process.env.NEXT_PUBLIC_URL_LOCAL;

const ChatBotEsmeralda = () => {
  const { session, handleSignOut } = useAuthContext();
  const router = useRouter();
  const [flow, setFlow] = useState({});
  const pathname = usePathname();
  const {allProducts} = useProductContext();
  const [tooltipText, setTooltipText] = useState("Tienes alguna pregunta?");
  const [filteredProducts, setFilteredProducts] = useState<
    IProductList[] | undefined
  >(allProducts);
  const helpLoginOptions = [
    "Registrarme",
    "Olvide mi contraseña",
    "Volver al inicio",
    "Mas opciones",
  ];
  const helpRegisterOptions = [
    "Iniciar sesion",
    "Volver al inicio",
    "Mas opciones",
  ];

  const helpClientOptions = [
    "Quiero comprar",
    "Ver ofertas",
    "Ver mis ordenes",
    "Ver carrito",
    "Quiero hablar con una persona",
    "Calificar local",
    "Saber mas de la esmeralda",
    "Cerrar sesion",
  ];

  const helpUserOptions = [
    "Quiero comprar",
    "Ver ofertas",
    "Quiero hablar con una persona",
    "Saber mas de la esmeralda",
    "Ver Primeras Opciones",
  ];
  const helpShopOptions = ["Mas opciones"];
  const helpClientShopOptions = [
    "Hacer el pedido por aca",
    "Mas opciones"];
  const userOptions = ["Iniciar sesion", "Registrarme", "Mas opciones"];
  

  useEffect(() => {
    if (allProducts) {
      
    
    setFilteredProducts(
      allProducts.reduce((acc: IProductList[], product: IProductList) => {
        const filteredSubproducts = product.subproducts?.filter(
          (subproduct) => subproduct.isAvailable
        );

        if (filteredSubproducts && filteredSubproducts.length > 0) {
          acc.push({
            ...product,
            subproducts: filteredSubproducts,
          });
        }

        return acc;
      }, [])
    );}
  }, [allProducts]);


  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = (url: string) => {
      console.log(url);
      if (url === "/categories") {
        setTooltipText("Elige lo que quieras");
      } else {
        setTooltipText("Tienes alguna pregunta?");
      }
    };
    handleRouteChange(pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Evita que el código se ejecute en el servidor

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
        step3a: {
          message: "¿Que quieres hacer?",
          options: helpLoginOptions,
          path: "process_options",
        },
        step3b: {
          message: "¿Que quieres hacer?",
          options: helpRegisterOptions,
          path: "process_options",
        },
        step3c: {
          message: "¿Que quieres hacer?",
          options: helpUserOptions,
          path: "process_options",
        },
        step4: {
          message:
            "Puedes filtrar por categorias o promociones a la izquierda.",
          transition: { duration: 1500 },
          path: "step5",
        },
        step5: {
          message: "Arriba puedes filtrar por precio o alfabeticamente.",
          transition: { duration: 1500 },
          path: "step6",
        },
        step6: {
          message: "Clickea una de las opciones y veras los detalles.",
          options: helpClientShopOptions,
          path: "process_options",
        },
        step7: {
          message: "Clickea una de las opciones y veras los detalles.",
          checkboxes: allProducts?.flatMap(product =>
            product.subproducts.map(subproduct => 
              `${product.description} - ${subproduct.amount} ${subproduct.unit}`
            )
          ),
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            console.log(params.userInput.toLowerCase().replace(/\s+/g, ""));
            switch (params.userInput.toLowerCase().replace(/\s+/g, "")) {
              case "quierocomprar":
                router.push(urlLocal + "/categories");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
              case "verofertas":
                router.push(urlLocal + "/promociones");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
                case "vermisordenes":
                router.push(urlLocal + "/dashboard/cliente/order");
                  await params.injectMessage(
                    "Aquí puedes revisar las ordenes."
                  );
                  return "step3c";
                case "cerrarsesion" :
                  handleSignOut();
                  return "step3c";
                case "hacerelpedidoporaca":
                  await params.injectMessage(
                    "Elige el producto que quieres."
                  );
                  return "step7";
                case "vercarrito":
                router.push(urlLocal + "/cart");
                await params.injectMessage(
                  "Ya estás en el carrito"
                );
                return "step3c";
              case "registrarme":
                await params.injectMessage("Ya estás acá, puedes registrarte.");
                router.push(urlLocal + "/register");
                return "step3b";
              case "iniciarsesion":
                router.push(urlLocal + "/login");
                await params.injectMessage(
                  "Ya estás acá, puedes iniciar sessión."
                );
                return "step3a";
              case "olvidemicontraseña":
                router.push(urlLocal + "/forgotPassword");
                return "step3b";
              case "volveralinicio":
                router.push(urlLocal + "/");
                return "step2";
              case "masopciones":
                return "step3c";
                case "calificarlocal":
                router.push(urlLocal + "/contact");
                return "step3c";
              case "quierohablarconunapersona":
                link = "https://api.whatsapp.com/send?phone=541158803709";
                window.open(link, "_blank");
                await params.injectMessage("Aquí puedes hablar con una persona.");
                return "step2";
              case "sabermasdelaesmeralda":
                await params.injectMessage(
                  "Aquí puedes ver mas sobre la esmeralda."
                );
                router.push(urlLocal + "/sobrenosotros");
                return "step3c";
              case "verprimerasopciones":
                return "step2";
              default:
                return "unknown_input";
            }
            return "repeat";
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step3",
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
        unknown_input: {
          message: "Lo siento no te entiendo, clickea una de las opciones.",
          options: userOptions,
          path: "process_options",
        },
        step3a: {
          message: "¿Que quieres hacer?",
          options: helpLoginOptions,
          path: "process_options",
        },
        step3b: {
          message: "¿Que quieres hacer?",
          options: helpRegisterOptions,
          path: "process_options",
        },
        step3c: {
          message: "¿Que quieres hacer?",
          options: helpUserOptions,
          path: "process_options",
        },
        step4: {
          message:
            "Puedes filtrar por categorias o promociones a la izquierda.",
          transition: { duration: 1500 },
          path: "step5",
        },
        step5: {
          message: "Arriba puedes filtrar por precio o alfabeticamente.",
          transition: { duration: 1500 },
          path: "step6",
        },
        step6: {
          message: "Clickea una de las opciones y veras los detalles.",
          options: helpShopOptions,
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = "";
            console.log(params.userInput.toLowerCase().replace(/\s+/g, ""));
            switch (params.userInput.toLowerCase().replace(/\s+/g, "")) {
              case "quierocomprar":
                router.push(urlLocal + "/categories");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
              case "verofertas":
                router.push(urlLocal + "/promociones");
                await params.injectMessage(
                  "Ya estás acá, elige lo que quieras."
                );
                return "step4";
              case "registrarme":
                await params.injectMessage("Ya estás acá, puedes registrarte.");
                router.push(urlLocal + "/register");
                return "step3b";
              case "iniciarsesion":
                router.push(urlLocal + "/login");
                await params.injectMessage(
                  "Ya estás acá, puedes iniciar sessión."
                );
                return "step3a";
              

              case "olvidemicontraseña":
                router.push(urlLocal + "/forgotPassword");
                return "step3b";
              case "volveralinicio":
                router.push(urlLocal + "/");
                return "step2";
              case "masopciones":
                return "step3c";
              case "quierohablarconunapersona":
                link = "https://api.whatsapp.com/send?phone=541158803709";
                window.open(link, "_blank");
                await params.injectMessage("Aquí puedes talk con una persona.");
                break;
              case "sabermasdelaesmeralda":
                await params.injectMessage(
                  "Aquí puedes ver mas sobre la esmeralda."
                )
                router.push(urlLocal + "/sobrenosotros");
                return "step3c";
              case "verprimerasopciones":
                return "step2";
              default:
                return "unknown_input";
            }
            return "repeat";
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step3",
        },
      });
    }
  }, [session, allProducts]);

  const settings = {
    general: {
      embedded: false,
      primaryColor: "#00796b",
    },
    header: {
      title: "EsmeraldaBot",
      avatar: "/Recurso1.png",
    },
    chatButton: {
      icon: "/Recurso1.png",
    },
    botBubble: {
      avatar: "/Recurso1.png",
    },
    tooltip: {
      text: tooltipText,
    },
    notification: {
      showCount: false,
    },
    chatHistory: {
      storageKey: "messages_bot",
    },
  };

  const styles = {
    headerStyle: {
      background: "#00796b",
      color: "#ffffff",
      padding: "10px",
      fontSize: "20px",
    },
    chatWindowStyle: {
      backgroundColor: "#f2f2f2",
    },
    botAvatarStyle: {
      backgroundColor: "#00796b",
    },
    chatButtonStyle: {
      position: "fixed" as const,
      bottom: "20px",
      right: "120px",
      zIndex: 50,
    },
    tooltipStyle: {
      position: "fixed" as const,
      bottom: "20px",
      right: "210px",
      zIndex: 50,
      fontSize: "15px",
    },
  };

  return <ChatBot styles={styles} settings={settings} flow={flow} />;
};

export default ChatBotEsmeralda;
