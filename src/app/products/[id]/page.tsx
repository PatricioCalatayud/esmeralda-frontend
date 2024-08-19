"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@material-tailwind/react";
import Link from "next/link";
import IncrementProduct from "@/components/IncrementProduct/IncrementProduct";
import Swal from "sweetalert2";

import { getProductById } from "../../../helpers/ProductsServices.helper";
import { Category, IProductList } from "@/interfaces/IProductList";
import { createStorageOrder } from "@/helpers/StorageCart.helper";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const ProductDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [product, setProduct] = useState<IProductList | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [buttonSize, setButtonSize ] = useState()
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const {token} = useAuthContext()
  const router = useRouter();
  const productId = params.id;
    console.log(product);

    
  useEffect(() => {
    type CategoryName = "Coffee" | "Tea" | "Accesory" | "Sweetener" | "Mate";
    const categoryTranslations = (category: { id: string ; name: CategoryName | string }) => {
      const translations: { [key in CategoryName]: string } = {
        Coffee: "Café",
        Tea: "Té",
        Accesory: "Accesorio",
        Sweetener: "Endulzante",
        Mate: "Mate",
      };
    
      return {
        id: category.id,
        name: translations[category.name as CategoryName] || category.name
      };
    };
    
    
    
    const loadProductData = async () => {
      
      const fetchedProduct = await getProductById(productId, token);
      console.log(fetchedProduct);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const translatedCategories = categoryTranslations({
          id:fetchedProduct.category?.id,
          name:fetchedProduct.category?.name as CategoryName || fetchedProduct.category?.name
        });
        setCategory(translatedCategories);
        /*if(fetchedProduct.subproducts){
            const sizes = fetchedProduct.subproducts.map()
        }  */ 
        if (fetchedProduct.category?.name === "coffee") {
          setSelectedSize("250g");
        } else {
          setSelectedSize("10 cápsulas");
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const cartItem = cart.find(
          (item: IProductList) => item.article_id === productId
        );
        if (cartItem) {
          setQuantity(cartItem.quantity);
        }
      }
      setIsLoaded(true);
    };

    loadProductData();
  }, [productId]);

  const renderBreadcrumb = () => {
    if (!category) {
      return (
        <h1 className="text-lg font-bold animate-fade-in-up">
          <Link href="/categories">
            <p className="hover:font-bold">Productos  </p>
          </Link>
        </h1>
      );
    }

    return (
      <h1 className="text-lg text-gray-500 animate-fade-in-up">
        <Link href="/categories" className="hover:font-bold hover:text-black">
          Productos
        </Link>
        {" / "}
        <Link
          href={`/categories/${category.id}`}
          className="hover:font-bold hover:text-black"
        >
          {category.name}
        </Link>
        {" / "}
        <span className="font-bold">{product?.description}</span>
      </h1>
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItemIndex = cart.findIndex(
      (item: IProductList) => item.article_id === productId
    );

    if (cartItemIndex !== -1) {
      Swal.fire({
        title: "Producto ya en el carrito",
        text: "El producto ya se encuentra en el carrito.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Ir al carrito",
        cancelButtonText: "Aceptar",
      }).then((result: any) => {
        if (result.isConfirmed) {
          router.push("/cart");
        }
      });
    } else {
      Swal.fire({
        title: "Agregar producto",
        text: "¿Desea agregar el producto al carrito?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result: any) => {
        if (result.isConfirmed) {
          const newCartItem = {
            ...product,
            quantity: quantity,
            size: selectedSize,
          };
          cart.push(newCartItem);
          localStorage.setItem("cart", JSON.stringify(cart));
          Swal.fire({
            title: "Producto agregado",
            text: "Producto agregado al carrito.",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Ir al carrito",
            cancelButtonText: "Aceptar",
          }).then(async (result: any) => {
            if (result.isConfirmed) {
              router.push("/cart");
            }

            const userSession = localStorage.getItem("userSession");

            if (userSession) {
              const token = JSON.parse(userSession).accessToken; // Corrected access to the token
              const decodedToken: DecodedToken = jwtDecode(token);
              console.log("decodedToken", decodedToken);
              const userId = decodedToken.userId;

              try {
                await createStorageOrder({ userId, products: cart });
                console.log("Storage order created successfully");
              } catch (error) {
                console.error("Error creating storage order:", error);
              }
            }
          });
        }
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          color="teal"
          className="h-12 w-12"
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      </div>
    );
  }

  if (!product) {
    return <p className="text-2xl font-bold w-full h-40 flex items-center justify-center">No se encontró el producto.</p>;
  }

  const sizeOptions =
    category?.name === "Café en Cápsulas"
      ? ["10 cápsulas", "20 cápsulas", "50 cápsulas"]
      : category?.name === "Máquinas"
      ? []
      : ["250 Gramos", "500 Gramos", "1 kg"];

      console.log(product);
  

  return (
    <div className="container mx-auto p-4 mt-14 mb-32">
      <div
        className={`flex flex-col md:flex-row transition-opacity duration-1000 gap-8 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative md:w-1/2">
        <Image
    width={1000}
    height={1000}
    priority={true}
    src="/Logo.png"
    alt="Logo"
    className="absolute inset-0 w-full h-full object-contain"
  />
  <Image
    width={1000}
    height={1000}
    priority={true}
    src={product.imgUrl}
    alt={product.description}
    className="relative w-full h-96 object-cover rounded-xl shadow-2xl"
  />
        </div>

        <div className="md:w-1/2 mt-4 md:mt-0 animate-fade-in-up border border-gray-300 rounded-lg p-4 shadow-xl">
          {renderBreadcrumb()}
          <hr  className="animate-fade-in-up mt-2"/>
          {category && (
            <h3 className="text-gray-500 mt-4 animate-fade-in-up">
              {category.name}
            </h3>
          )}
          <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">
            {product.description}
          </h1>
          <hr  className="animate-fade-in-up"/>
          <div className="mt-4 animate-fade-in-up flex flex-col justify-between">
          {sizeOptions.length > 0 && (
            <div className="mb-4 flex space-x-4 animate-fade-in-up">
              {product.subproducts && product.subproducts?.length > 0  ? (product.subproducts?.map((subproduct, index) => (
                  <button
                  key={index}
                  className={`w-32 py-2 px-4 rounded-xl transition-colors duration-300 text-sm ${
                    selectedSize === subproduct.amount
                      ? "bg-none text-black border-2 border-teal-600"
                      : "bg-gray-200 font-bold text-black shadow-sm hover:bg-gray-600 hover:text-white "
                  }`}
                >
                  {`${subproduct.amount} ${subproduct.unit}`}
                  
                </button>
              ))) :
              (sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-32 py-2 px-4 rounded-xl transition-colors duration-300 text-sm ${
                    selectedSize === size
                      ? "bg-none text-black border-2 border-teal-600"
                      : "bg-gray-200 font-bold text-black shadow-sm hover:bg-gray-600 hover:text-white "
                  }`}
                >
                  {size}
                </button>
              )))}
            </div>
            
          )}
          <p className="text-2xl font-semibold text-teal-600 mb-4 animate-fade-in-up">
            $ {product.price}
          </p>
          
          </div>
          <div className="animate-fade-in-up flex flex-row items-center gap-4 my-4">
          <IncrementProduct
            stock={product.stock}
            productId={product.id}
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
          <p className="text-gray-800 text-xs text-nowrap">{product.stock} disponibles</p>
          </div>
          <button
            className="  py-2 px-4 rounded-lg bg-teal-600 text-white  hover:bg-teal-800 transition-colors duration-300 animate-fade-in-up"
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faCartShopping} size="lg" style={{ marginRight: "10px" }}/>
            Añadir al carrito
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-logo {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.3;
          }
        }

        @keyframes fade-in-product {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-logo {
          animation: fade-in-logo 1s forwards;
        }

        .animate-fade-in-product {
          animation: fade-in-product 1s forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
