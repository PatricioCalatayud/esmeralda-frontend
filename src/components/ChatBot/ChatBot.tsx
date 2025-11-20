"use client"

import { useAuthContext } from "@/context/auth.context"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useProductContext } from "@/context/product.context"
import type { IProductList } from "@/interfaces/IProductList"
import { postOrder } from "@/helpers/Order.helper"
import Swal from "sweetalert2"
import { formatPrice } from "@/utils/formatPrice"

interface IAddress {
  street: string
  number: string
  zipcode: string
  locality: string
  province: string
}

const ChatBot = dynamic(() => import("react-chatbotify"), { ssr: false })
const urlLocal = process.env.NEXT_PUBLIC_URL_LOCAL
const ChatBotEsmeralda = () => {
  const { session, handleSignOut, token } = useAuthContext()
  const router = useRouter()
  const [flow, setFlow] = useState({})
  const pathname = usePathname()
  const { allProducts } = useProductContext()
  const [tooltipText, setTooltipText] = useState("Tienes alguna pregunta?")
  const [filteredProducts, setFilteredProducts] = useState<IProductList[] | undefined>(allProducts)
  const [form, setForm] = useState<string[]>()
  const [optionForm, setOptionForm] = useState<string>()
  const [address, setAddress] = useState<IAddress>({
    street: "",
    number: "",
    zipcode: "",
    locality: "",
    province: "",
  })
  const [receiptId, setReceiptId] = useState<string>("")
  const [invoiceType, setInvoiceType] = useState<string>("")

  const selectedProduct = filteredProducts?.find((product) =>
    product.subproducts.some(
      (subproduct) => `${product.description} - ${subproduct.amount} ${subproduct.unit}` === optionForm,
    ),
  )

  const selectedSubproduct = selectedProduct?.subproducts.find(
    (subproduct) => `${selectedProduct.description} - ${subproduct.amount} ${subproduct.unit}` === optionForm,
  )

  const stockAvailable = selectedSubproduct?.stock

  const stockMessage =
    stockAvailable !== undefined
      ? `Dime cuántas quieres. Stock disponible: ${stockAvailable}`
      : `Stock no disponible para "${optionForm}"`

  const helpLoginOptions = ["Registrarme", "Olvide mi contraseña", "Volver al inicio", "Mas opciones"]
  const helpRegisterOptions = ["Iniciar sesion", "Volver al inicio", "Mas opciones"]
  const helpClientOptions = [
    "Hacer el pedido por aca",
    "Quiero comprar",
    "Ver ofertas",
    "Ver mis ordenes",
    "Ver carrito",
    "Quiero hablar con una persona",
    "Calificar local",
    "Saber mas de la esmeralda",
    "Cerrar sesion",
  ]
  const helpAdminOptions = [
    "Ver Ordenes",
    "Ver Productos",
    "Agregar Productos",
    "Ver lista de usuarios",
    "Cerrar sesion",
  ]
  const helpUserOptions = [
    "Quiero comprar",
    "Ver ofertas",
    "Quiero hablar con una persona",
    "Saber mas de la esmeralda",
    "Ver Primeras Opciones",
  ]
  const helpShopOptions = ["Mas opciones"]
  const helpClientShopOptions =
    session && session.role === "Cliente" ? ["Hacer el pedido por aca", "Mas opciones"] : ["Mas opciones"]
  const userOptions = ["Iniciar sesion", "Registrarme", "Mas opciones"]
  const clientShopOptions = ["Continuar", "Modificar pedido", "Volver al inicio"]

  useEffect(() => {
    if (allProducts) {
      setFilteredProducts(
        allProducts.reduce((acc: IProductList[], product: IProductList) => {
          const filteredSubproducts = product.subproducts?.filter((subproduct) => subproduct.isAvailable)
          if (filteredSubproducts && filteredSubproducts.length > 0) {
            acc.push({
              ...product,
              subproducts: filteredSubproducts,
            })
          }
          return acc
        }, []),
      )
    }
  }, [allProducts])
  const price: any = form?.map((productString) => {
    // Divide el string en partes
    const parts = productString.split(" - ")

    // Obtiene el nombre del producto
    const productName = parts[0]

    // Encuentra todos los números en el string y los convierte a enteros
    const numbers = (productString.match(/\d+/g) || []).map((num) => Number.parseInt(num, 10))

    // Determina el amount a usar
    const amount = numbers.length > 1 ? numbers[0] : numbers[0] || 1

    // Determina la cantidad a usar
    const quantity = numbers.length > 1 ? numbers[numbers.length - 1] : 1

    // Busca el producto en allProducts
    const foundProduct = filteredProducts?.find((p) => p.description.toLowerCase() === productName.toLowerCase())

    if (!foundProduct) {
      throw new Error(`Product not found: ${productName}`)
    }

    // Busca el subproducto basado en la cantidad
    const foundSubproduct = foundProduct.subproducts.find((sp) => Number(sp.amount) === amount)

    if (!foundSubproduct) {
      throw new Error(`Subproduct not found for amount: ${quantity}`)
    }

    return Number(foundSubproduct.price) * quantity * 1.21
  })

  const totalPrice = (price || []).reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0)

  const handleCheckout = async () => {
    const products: any = form?.map((productString) => {
      // Divide el string en partes
      const parts = productString.split(" - ")

      // Obtiene el nombre del producto
      const productName = parts[0]

      // Encuentra todos los números en el string y los convierte a enteros
      const numbers = (productString.match(/\d+/g) || []).map((num) => Number.parseInt(num, 10))

      // Determina el amount a usar
      const amount = numbers.length > 1 ? numbers[0] : numbers[0] || 1

      // Determina la cantidad a usar
      const quantity = numbers.length > 1 ? numbers[numbers.length - 1] : 1

      // Busca el producto en allProducts
      const foundProduct = filteredProducts?.find((p) => p.description.toLowerCase() === productName.toLowerCase())

      if (!foundProduct) {
        throw new Error(`Product not found: ${productName}`)
      }

      // Busca el subproducto basado en la cantidad
      const foundSubproduct = foundProduct.subproducts.find((sp) => Number(sp.amount) === amount)

      if (!foundSubproduct) {
        throw new Error(`Subproduct not found for amount: ${quantity}`)
      }

      return {
        productId: foundProduct.id,
        subproductId: foundSubproduct.id,
        quantity: quantity,
      }
    })

    const orderCheckout = {
      userId: session?.id,
      products,
      address: {
        street: address.street,
        number: address.number,
        zipcode: address.zipcode,
        locality: address.locality,
        province: address.province,
      },
      invoiceType: invoiceType === "Factura A" ? "A" : "B",
    }

    if (session) {
      Swal.fire({
        title: "Creando orden...",
        text: "Por favor espera.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const order = await postOrder(orderCheckout, token)

      if (order?.status === 200 || order?.status === 201) {
        Swal.close()
        Swal.fire({
          icon: "success",
          title: "¡Orden creada!",
          text: "Tu orden ha sido creada exitosamente.",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          router.push(`/checkout/${order.data.id}`)
        })
      } else {
        Swal.close()
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Ha ocurrido un error al crear la orden.",
          confirmButtonColor: "#3085d6",
        })
      }
    }
  }
  useEffect(() => {
    if (typeof window === "undefined") return
    const handleRouteChange = (url: string) => {
      if (url === "/categories") {
        setTooltipText("Elige lo que quieras")
      } else {
        setTooltipText("Tienes alguna pregunta?")
      }
    }
    handleRouteChange(pathname)
  }, [pathname])

  useEffect(() => {
    if (typeof window === "undefined") return // Evita que el código se ejecute en el servidor

    if (session) {
      setFlow({
        start: {
          message: `Hola ${session.name}!`,
          transition: { duration: 1000 },
          path: "step2",
        },
        step2: {
          message: "¿Que quieres hacer?",
          options: session.role === "Administrador" ? helpAdminOptions : helpClientOptions,
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
          message: "Puedes filtrar por categorias o promociones a la izquierda.",
          transition: { duration: 1000 },
          path: "step5",
        },
        step5: {
          message: "Arriba puedes filtrar por precio o alfabeticamente.",
          transition: { duration: 1000 },
          path: "step6",
        },
        step6: {
          message: "Clickea una de las opciones y veras los detalles.",
          options: helpClientShopOptions,
          path: "process_options",
        },
        step7: {
          message: "Clickea una de las opciones y veras los detalles.",
          checkboxes: filteredProducts?.flatMap((product) =>
            product.subproducts.map((subproduct) => `${product.description} - ${subproduct.amount} ${subproduct.unit}`),
          ),
          function: (params: any) => setForm(params.userInput.split(", ")),
          path: "step8",
        },
        step8: {
          message: "Perfecto!",
          options: clientShopOptions,
          path: "process_options",
        },
        preStep9: {
          transition: { duration: 1000 },
          path: "step9",
        },
        step9: {
          message: "Clickea una de las opciones y me diras si quieres mas de 1.",
          options: Array.isArray(form) && [...form, "Continuar"],
          function: async (params: any) => setOptionForm(params.userInput),
          path: "process_options",
        },

        step10: {
          message: stockMessage,
          function: async (params: any) => {
            if (params.userInput === "Continuar") {
              handleCheckout()
              return
            }
            const newInput = params.userInput
            if (Number(newInput) > Number(stockAvailable)) {
              Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "No hay suficiente stock.",
              })
              return
            } else if (Number(newInput) <= 0) {
              Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "La cantidad debe ser mayor a 0.",
              })
              return
            } else {
              const index = form?.findIndex((option) => option === optionForm)

              if (index !== -1) {
                // Copiamos el array form
                const updatedForm = [...(form as any)]

                // Verificamos si la opción ya tiene 3 partes separadas por "-"

                const parts = optionForm?.split(" - ")
                if (parts?.length === 3) {
                  // Si ya tiene 3 partes, reemplazamos la última parte por `newInput`
                  parts[2] = newInput
                  updatedForm[index as any] = parts.join(" - ")
                } else {
                  // Si no tiene 3 partes, simplemente agregamos el nuevo número al final
                  updatedForm[index as any] = `${optionForm} - ${newInput}`
                }

                // Actualizamos el estado con el nuevo array
                setForm(updatedForm)
              } else {
                console.error("Opción no encontrada en form")
              }
            }
          },
          path: "preStep9",
        },
        preStep11: {
          transition: { duration: 1000 },
          path: "step11",
        },
        step11: {
          message: session?.address
            ? `¿Deseas usar tu dirección actual?\n${session.address.street} ${session.address.number}, ${session.address.locality}, ${session.address.province}`
            : "¿Dónde deseas recibir tu pedido?",
          options: session?.address
            ? ["Usar esta dirección", "Añadir una nueva dirección"]
            : ["Añadir una nueva dirección"],
          function: (params: any) => {
            if (params.userInput === "Usar esta dirección") {
              setAddress({
                street: session?.address?.street || "",
                number: String(session?.address?.number || ""),
                zipcode: session?.address?.zipcode || "",
                locality: session?.address?.locality || "",
                province: session?.address?.province || "",
              })
              return "step11i"
            } else {
              return "step11b"
            }
          },
          path: "process_options",
        },
        step11b: {
          message: "¿Deseas retirar el pedido del local?",
          options: ["Sí, retirar del local", "No, enviar a otra dirección"],
          path: "process_options",
        },
        step11c: {
          message: "Perfecto, tu pedido estará listo para retirar en nuestro local.",
          function: (params: any) => {
            setAddress({
              street: "Retiro en local",
              number: "",
              zipcode: "",
              locality: "",
              province: "",
            })
            return "step11i"
          },
          path: "step11i",
        },
        step11d: {
          message: "Por favor, ingresa la calle:",
          function: (params: any) => {
            setAddress((prev) => ({
              ...prev,
              street: params.userInput,
            }))
          },
          path: "step11e",
        },
        step11e: {
          message: "Ingresa el número:",
          function: (params: any) => {
            setAddress((prev) => ({
              ...prev,
              number: params.userInput,
            }))
          },
          path: "step11f",
        },
        step11f: {
          message: "Ingresa el código postal:",
          function: (params: any) => {
            setAddress((prev) => ({
              ...prev,
              zipcode: params.userInput,
            }))
          },
          path: "step11g",
        },
        step11g: {
          message: "Ingresa la localidad:",
          function: (params: any) => {
            setAddress((prev) => ({
              ...prev,
              locality: params.userInput,
            }))
          },
          path: "step11h",
        },
        step11h: {
          message: "Ingresa la provincia:",
          function: (params: any) => {
            setAddress((prev) => ({
              ...prev,
              province: params.userInput,
            }))
            return "step11i"
          },
          path: "step11i",
        },
        step11i: {
          message: "¿Qué tipo de factura deseas?",
          options: ["Factura A", "Factura B"],
          function: (params: any) => {
            setInvoiceType(params.userInput)
          },
          path: "preStep12",
        },
        preStep12: {
          transition: { duration: 1000 },
          path: "step12",
        },
        step12: {
          component: (
            <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 m-4 w-full">
              {form?.map((option, index) => (
                <p key={index}>{option}</p>
              ))}
              <p>
                Direccion: {address.street} {address.number}, {address.locality}, {address.province}
              </p>
              <p>Tipo de factura: {invoiceType}</p>
              <p>Precio total con iva: {formatPrice(totalPrice)}</p>
            </div>
          ),
          options: ["Crear Orden", "Volver al inicio", "Quiero cambiar mi compra"],
          path: "process_options",
        },
        stepWtp: {
          message:
            "Los horarios de atención son de Lunes a Viernes de 9:00 a 13:30." +
            " " +
            "El tiempo de expera es de 30 minutos a 1 hora.",
          options: ["Ir a WhatsApp", "Volver al inicio"],
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = ""
            const userInputNormalized = params.userInput.toLowerCase().replace(/\s+/g, "")

            // Normaliza y verifica cada opción en el array `form`
            const formMatches = form?.some((item) => item.toLowerCase().replace(/\s+/g, "") === userInputNormalized)

            if (formMatches) {
              return "step10"
            }

            switch (userInputNormalized) {
              case "quierocomprar":
                router.push("/categories")
                await params.injectMessage("Ya estás acá, elige lo que quieras.")
                return "step4"
              case "verofertas":
                router.push("/promociones")
                await params.injectMessage("Ya estás acá, elige lo que quieras.")
                return "step4"
              case "vermisordenes":
                router.push("/dashboard/cliente/order")
                await params.injectMessage("Aquí puedes revisar las ordenes.")
                return "step3c"
              case "cerrarsesion":
                handleSignOut()
                return "step3c"
              case "hacerelpedidoporaca":
                await params.injectMessage("Elige el producto que quieres.")
                return "step7"
              case "vercarrito":
                router.push("/cart")
                await params.injectMessage("Ya estás en el carrito")
                return "step3c"
              case "registrarme":
                await params.injectMessage("Ya estás acá, puedes registrarte.")
                router.push("/register")
                return "step3b"
              case "iniciarsesion":
                router.push("/login")
                await params.injectMessage("Ya estás acá, puedes iniciar sessión.")
                return "step3a"
              case "olvidemicontraseña":
                router.push("/forgotPassword")
                return "step3b"
              case "volveralinicio":
                router.push("/")
                return "step2"
              case "masopciones":
                return "step3c"
              case "calificarlocal":
                router.push("/contact")
                return "step3c"
              case "irawhatsapp":
                link = "https://api.whatsapp.com/send?phone=541150107956"
                window.open(link, "_blank")
                await params.injectMessage("Aquí puedes hablar con una persona.")
                return "step2"
              case "quierohablarconunapersona":
                await params.injectMessage("Puedes comunicarte por WhatsApp.")
                return "stepWtp"
              case "sabermasdelaesmeralda":
                await params.injectMessage("Aquí puedes ver mas sobre la esmeralda.")
                router.push("/sobrenosotros")
                return "step3c"
              case "esloquenecesito":
                await params.injectMessage("Genial, continuemos con tu pedido.")
                return "step9"
              case "quierocambiarmicompra":
                return "step7"
              case "verprimerasopciones":
                return "step2"
              case "continuar":
                return "preStep11"
              case "verordenes":
                router.push("/dashboard/administrador/order")
                await params.injectMessage(
                  "Aquí puedes verificar comprobantes de transferencia, o cambiar estado de envios.",
                )
                return "step2"
              case "verproductos":
                router.push("/dashboard/administrador/product")
                await params.injectMessage(
                  "Aquí puedes editar los productos, editar subproductos, añadir subproductos, desabilitarlos o eliminarlos.",
                )
                return "step2"
              case "agregarproductos":
                await params.injectMessage("Aquí puedes agregar los productos con sus subproductos.")
                router.push("/dashboard/administrador/productAdd")
                return "step2"
              case "verlistadeusuarios":
                await params.injectMessage(
                  "Aquí puedes ver la lista de usuarios, convertirlos en clientes y viceversa. Ademas ver la situacion de los clientes.",
                )
                router.push("/dashboard/administrador/users")
                return "step2"
              case "cambiardirección":
                return "step11"
              case "usarestadirección":
                setAddress({
                  street: session?.address?.street || "",
                  number: String(session?.address?.number || ""),
                  zipcode: session?.address?.zipcode || "",
                  locality: session?.address?.locality || "",
                  province: session?.address?.province || "",
                })
                return "step11i"
              case "añadirunanuevadirección":
                return "step11b"
              case "sí,retirardellocal":
                return "step11c"
              case "no,enviaraotradirección":
                return "step11d"
              case "crearorden":
                await params.injectMessage("Creando tu orden...")
                handleCheckout()
                return "step2"
              default:
                return "unknown_input"
            }
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step3",
        },
      })
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
          message: "Puedes filtrar por categorias o promociones a la izquierda.",
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
        stepWtp: {
          message:
            "Los horarios de atención son de Lunes a Viernes de 9:00 a 13:30." +
            " " +
            "El tiempo de expera es de 30 minutos a 1 hora.",
          options: ["Ir a WhatsApp", "Volver al inicio"],
          path: "process_options",
        },
        process_options: {
          transition: { duration: 0 },
          chatDisabled: true,
          path: async (params: any) => {
            let link = ""
            switch (params.userInput.toLowerCase().replace(/\s+/g, "")) {
              case "quierocomprar":
                router.push("/categories")
                await params.injectMessage("Ya estás acá, elige lo que quieras.")
                return "step4"
              case "verofertas":
                router.push("/promociones")
                await params.injectMessage("Ya estás acá, elige lo que quieras.")
                return "step4"
              case "registrarme":
                await params.injectMessage("Ya estás acá, puedes registrarte.")
                router.push("/register")
                return "step3b"
              case "iniciarsesion":
                router.push("/login")
                await params.injectMessage("Ya estás acá, puedes iniciar sessión.")
                return "step3a"
              case "olvidemicontraseña":
                router.push("/forgotPassword")
                return "step3b"
              case "volveralinicio":
                router.push("/")
                return "step2"
              case "masopciones":
                return "step3c"
              case "irawhatsapp":
                link = "https://api.whatsapp.com/send?phone=541150107956"
                window.open(link, "_blank")
                await params.injectMessage("Aquí puedes hablar con una persona.")
                break
              case "quierohablarconunapersona":
                await params.injectMessage("Puedes comunicarte por WhatsApp.")
                return "stepWtp"
              case "sabermasdelaesmeralda":
                await params.injectMessage("Aquí puedes ver mas sobre la esmeralda.")
                router.push("/sobrenosotros")
                return "step3c"
              case "verprimerasopciones":
                return "step2"
              default:
                return "unknown_input"
            }
            return "repeat"
          },
        },
        repeat: {
          transition: { duration: 3000 },
          path: "step3",
        },
      })
    }
  }, [session, filteredProducts, form, optionForm, address, totalPrice, receiptId, invoiceType])

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
  }

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

    tooltipStyle: { fontSize: "15px" },
  }

  return <ChatBot styles={styles} settings={settings} flow={flow} />
}

export default ChatBotEsmeralda
