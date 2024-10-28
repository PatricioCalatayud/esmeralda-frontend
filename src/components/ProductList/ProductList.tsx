"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Category, IProductList } from "@/interfaces/IProductList";
import { useProductContext } from "@/context/product.context";
import Link from "next/link";
import { Dropdown } from "flowbite-react";
import Image from "next/image";
import { useCategoryContext } from "@/context/categories.context";
import categorySpanish from "@/utils/categorySpanish";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";

interface ProductsClientPageProps {
  selectedCategory: string | null;
  category: Category | null;
  productsList: IProductList[] | undefined;
}

const ProductList: React.FC<ProductsClientPageProps> = ({
  selectedCategory,
  category,
  productsList,
}) => {
  const router = useRouter();
  const { searchResults } = useProductContext();
  const [filterOption, setFilterOption] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<
    IProductList[] | undefined
  >(productsList);
  const { categories } = useCategoryContext();

  useEffect(() => {
    let sortedProducts = productsList || [];
    if (searchResults !== undefined && productsList !== undefined) {
      sortedProducts = [
        ...(searchResults.length > 0 ? searchResults : productsList),
      ];
    }
    if (selectedCategory && selectedCategory !== "promociones") {
      sortedProducts = sortedProducts.filter(
        (product) => product.category.id === selectedCategory
      );
    }

    switch (filterOption) {
      case "price-asc":
        sortedProducts.sort((a, b) => {
          const priceA = Math.min(
            ...a.subproducts.map((subproduct) =>
              parseFloat(subproduct.price || "0")
            )
          );
          const priceB = Math.min(
            ...b.subproducts.map((subproduct) =>
              parseFloat(subproduct.price || "0")
            )
          );
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => {
          const priceA = Math.min(
            ...a.subproducts.map((subproduct) =>
              parseFloat(subproduct.price || "0")
            )
          );
          const priceB = Math.min(
            ...b.subproducts.map((subproduct) =>
              parseFloat(subproduct.price || "0")
            )
          );
          return priceB - priceA;
        });
        break;
      case "name-asc":
        sortedProducts.sort((a, b) =>
          a.description.localeCompare(b.description)
        );
        break;
      case "name-desc":
        sortedProducts.sort((a, b) =>
          b.description.localeCompare(a.description)
        );
        break;
      default:
        if (searchResults !== undefined && productsList !== undefined) {
          sortedProducts = [
            ...(searchResults.length > 0 ? searchResults : productsList),
          ];
        }
    }
    setFilteredProducts(
      sortedProducts.reduce((acc: IProductList[], product: IProductList) => {
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
    );
  }, [filterOption, productsList, searchResults, selectedCategory]);

  const handleCategoryChange = (id: string | null) => {
    if (id === null) {
      router.push(`/categories`);
    } else if (id === "promociones") {
      router.push(`/promociones`);
    } else {
      router.push(`/categories/${id}`);
    }
  };

  const renderBreadcrumb = () => {
    if (!category) {
      return (
        <h1 className="text-2xl font-bold">
          <Link href="/categories">
            <p className="text-bold">Productos</p>
          </Link>
        </h1>
      );
    }

    return (
      <h1 className="text-2xl mb-4 lg:mb-0">
        <Link href="/categories">Productos</Link>
        {" / "}
        <span className="font-bold">
          {categorySpanish(category.name) || category.name}{" "}
        </span>
      </h1>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-around items-center bg-teal-800 py-6 text-white ">
        {renderBreadcrumb()}

        <Dropdown
          arrowIcon={false}
          label={
            <div
              className="flex justify-between w-[300px] md:w-[400px]"
              id="custom-dropdown-button"
            >
              <span>Filtrar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          }
          dismissOnClick={true}
          style={{
            border: "1px solid white",
            backgroundColor: "#00695c",
            outline: "none",
          }}
        >
          <Dropdown.Item
            onClick={() => setFilterOption("price-asc")}
            className="md:w-[400px]"
          >
            Ordenar por precio: Menor a Mayor
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setFilterOption("price-desc")}
            className="md:w-[400px]"
          >
            Ordenar por precio: Mayor a Menor
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setFilterOption("name-asc")}
            className="md:w-[400px]"
          >
            Nombre: A-Z
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setFilterOption("name-desc")}
            className="md:w-[400px]"
          >
            Nombre: Z-A
          </Dropdown.Item>
        </Dropdown>
      </div>

      <div className="flex flex-col lg:flex-row m-10">
        <div className="w-full lg:w-1/4 p-4 px-16 lg:px-4 border border-teal-600 rounded-xl lg:mr-10 mr-0">
          <h2 className="text-lg font-bold mb-4 text-gray-600">Categorías</h2>
          <hr className="border-teal-600" />
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <button
                onClick={() => handleCategoryChange(null)}
                className={`text-lg ${
                  selectedCategory === null
                    ? "font-bold text-teal-800"
                    : "text-teal-600"
                }`}
              >
                Todo
              </button>
            </li>
            <li>
              <button
                onClick={() => handleCategoryChange("promociones")}
                className={`text-lg ${
                  selectedCategory === "promociones"
                    ? "font-bold text-teal-800"
                    : "text-teal-600"
                }`}
              >
                Promociones
              </button>
            </li>
            {categories?.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-lg ${
                    selectedCategory === cat.id
                      ? "font-bold text-teal-800"
                      : "text-teal-600"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div> 

        <div className="w-full lg:w-3/4 my-10 lg:my-0">
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => {
                const productCategory = categories?.find(
                  (cat) => cat.id === product.category.id
                );
                const lowestPrice = product.subproducts.reduce(
                  (lowest, current) => {
                    return parseFloat(current.price) < parseFloat(lowest.price)
                      ? current
                      : lowest;
                  },
                  product.subproducts[0]
                );

                return (
                  <div
                  key={index}
                  className="relative flex flex-col rounded-lg h-[650px] shadow-lg hover:scale-105 transition-transform" // Aumentamos la altura a 600px
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <Image
                    width={500}
                    height={500}
                    src={product.imgUrl}
                    alt={product.description}
                    className="w-full h-4/6 object-cover rounded-t-lg" // Mantener el tamaño más grande de la imagen
                  />
                  <hr className="bg-blue-gray-600" />
                  <div className="flex-grow p-4">
                    {productCategory && (
                      <h3 className="text-gray-500 text-sm">{productCategory.name}</h3>
                    )}
                    <h2 className="text-lg font-bold">{product.description}</h2>
                    {product.subproducts
                      .filter((subproduct) => subproduct.discount > 0)
                      .map((subproduct) => (
                        <div
                          key={subproduct.id}
                          className="text-teal-400 text-sm font-bold"
                        >
                          {subproduct.discount}% de descuento x {subproduct.amount} {subproduct.unit}
                        </div>
                      ))}
                    <div className="h-7 flex flex-wrap items-center gap-2">
                      {product.subproducts.map((subProduct, index) => (
                        <p
                          key={index}
                          className="text-sm font-medium text-gray-500"
                        >
                          {subProduct.amount} {subProduct.unit}
                        </p>
                      ))}
                    </div>
                  </div>
                  {/* Contenedor para el precio */}
                  <div className="flex-shrink-0 p-4 flex items-center justify-between w-full">
                    <p className="text-lg font-medium">Desde:</p>
                    <p className="text-lg font-bold">${lowestPrice.price} (+IVA)</p>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <h1 className="text-2xl font-semibold text-gray-500 w-full text-center">
                No hay productos para mostrar en esta categoría.
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;