"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@material-tailwind/react";
import Link from "next/link";
import IncrementProduct from "@/components/IncrementProduct/IncrementProduct";
import Swal from "sweetalert2";
import { getProductById } from "../../../helpers/ProductsServices.helper";
import { Category, IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCartContext } from "@/context/cart.context";

const ProductDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [product, setProduct] = useState<IProductList | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { setCartItemCount } = useCartContext();
  const { token } = useAuthContext();
  const router = useRouter();
  const productId = params.id;

  useEffect(() => {
    type CategoryName = "Coffee" | "Tea" | "Accesory" | "Sweetener" | "Mate";
    const categoryTranslations = (category: {
      id: string;
      name: CategoryName | string;
    }) => {
      const translations: { [key in CategoryName]: string } = {
        Coffee: "Café",
        Tea: "Té",
        Accesory: "Accesorio",
        Sweetener: "Endulzante",
        Mate: "Mate",
      };

      return {
        id: category.id,
        name: translations[category.name as CategoryName] || category.name,
      };
    };

    const loadProductData = async () => {
      const fetchedProduct = await getProductById(productId, token);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const translatedCategories = categoryTranslations({
          id: fetchedProduct.category?.id,
          name:
            (fetchedProduct.category?.name as CategoryName) ||
            fetchedProduct.category?.name,
        });
        setCategory(translatedCategories);
        if (
          fetchedProduct.subproducts &&
          fetchedProduct.subproducts.length > 0
        ) {
          const lowestPricedSubproduct = fetchedProduct.subproducts.reduce(
            (lowest, current) => {
              return current.price < lowest.price ? current : lowest;
            }
          );

          setSelectedSize(lowestPricedSubproduct.amount);

          if (Number(fetchedProduct.discount) !== 0) {
            // Calcula el precio con el descuento aplicado correctamente
            setSelectedPrice(
              (
                Number(lowestPricedSubproduct.price) *
                (1 - Number(fetchedProduct.discount) / 100)
              ).toFixed(2)
            );
          } else {
            setSelectedPrice(lowestPricedSubproduct.price);
          }
        } else if (Number(fetchedProduct.discount) !== 0) {
          // Calcula el precio con el descuento aplicado correctamente
          setSelectedPrice(
            (
              Number(fetchedProduct.price) *
              (1 - Number(fetchedProduct.discount) / 100)
            ).toFixed(2)
          );
        } else {
          setSelectedPrice(fetchedProduct.price);
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const cartItem = cart.find((item: any) => item.id === productId);
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
            <p className="hover:font-bold">Productos</p>
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
    const cartItemIndex = cart.findIndex((item: any) => item.id === productId);

    if (cartItemIndex !== -1) {
      Swal.fire({
        title: "Producto ya en el carrito",
        text: "El producto ya se encuentra en el carrito. ¿Desea actualizar la cantidad?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Aceptar",
      }).then((result: any) => {
        if (result.isConfirmed) {
          // Update the quantity in the cart
          cart[cartItemIndex].quantity = quantity;
          localStorage.setItem("cart", JSON.stringify(cart));
          Swal.fire({
            title: "Producto actualizado",
            text: "La cantidad del producto ha sido actualizada.",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Ir al carrito",
            cancelButtonText: "Aceptar",
          }).then(async (result: any) => {
            if (result.isConfirmed) {
              router.push("/cart");
            }
          });
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
          //const items = JSON.parse(cart);
          setCartItemCount(cart.length);
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
          });
        }
      });
    }
  };

  const handleSizeChange = (newSize: string, price: string) => {
    setSelectedSize(newSize);
    if (Number(product?.discount) !== 0) {
      setSelectedPrice(
        (Number(price) * (Number(product?.discount) / 100)).toFixed(2)
      );
    } else {
      setSelectedPrice(price);
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
    return (
      <p className="text-2xl font-bold w-full h-40 flex items-center justify-center">
        No se encontró el producto.
      </p>
    );
  }

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
          <hr className="animate-fade-in-up mt-2" />
          {category && (
            <h3 className="text-gray-500 mt-4 animate-fade-in-up">
              {category.name}
            </h3>
          )}
          <h1 className="text-3xl font-bold mb-2 animate-fade-in-up">
            {product.description}
          </h1>
          <hr className="animate-fade-in-up" />
          <div className="mt-4 animate-fade-in-up flex flex-col justify-between">
            <div className="mb-4 flex space-x-4 animate-fade-in-up">
              {product.subproducts &&
                product.subproducts?.length > 0 &&
                product.subproducts?.map((subproduct, index) => (
                  <button
                    key={index}
                    className={`w-32 py-2 px-4 rounded-xl transition-colors duration-300 text-sm ${
                      selectedSize === subproduct.amount
                        ? "bg-none text-black border-2 border-teal-600"
                        : "bg-gray-200 font-bold text-black shadow-sm hover:bg-gray-600 hover:text-white "
                    }`}
                    onClick={() =>
                      handleSizeChange(subproduct.amount, subproduct.price)
                    }
                  >
                    {`${subproduct.amount} ${subproduct.unit}`}
                  </button>
                ))}
            </div>
            {Number(product.discount) !== 0 ? (
              <div className="flex gap-4 flex-col">
                <div>
                  <p className="text-lg font-semibold text-gray-600 animate-fade-in-up line-through">
                    ${product.price}
                  </p>
                  <p className="text-teal-400 text-sm font-bold">
                    {product.discount} % de descuento
                  </p>
                </div>
                <p className="text-2xl font-semibold text-teal-600 mb-4 animate-fade-in-up">
                  ${selectedPrice}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-teal-600 mb-4 animate-fade-in-up">
                ${selectedPrice}
              </p>
            )}
          </div>
          <div className="animate-fade-in-up flex flex-row items-center gap-4 my-4">
            <IncrementProduct
              stock={product.stock}
              productId={product.id}
              initialQuantity={quantity}
              onQuantityChange={handleQuantityChange}
            />
            <p className="text-gray-800 text-xs text-nowrap">
              {product.stock} disponibles
            </p>
          </div>
          <button
            className="  py-2 px-4 rounded-lg bg-teal-600 text-white  hover:bg-teal-800 transition-colors duration-300 animate-fade-in-up"
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              size="lg"
              style={{ marginRight: "10px" }}
            />
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
