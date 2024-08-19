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
  const [filteredProducts, setFilteredProducts] = useState<IProductList[] | undefined>(productsList);
  const {categories } = useCategoryContext();
  console.log(category);
console.log(productsList);
  useEffect(() => {
    let sortedProducts = productsList || [];
    if (searchResults !== undefined && productsList !== undefined) {
      sortedProducts = [...(searchResults.length > 0 ? searchResults : productsList)];
    }
    if (selectedCategory) {
      sortedProducts = sortedProducts.filter(
        (product) => product.category.id === selectedCategory
      );
    }

    switch (filterOption) {
      case "price-asc":
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.description.localeCompare(a.description));
        break;
      default:
        if (searchResults !== undefined && productsList !== undefined) {
          sortedProducts = [...(searchResults.length > 0 ? searchResults : productsList)];
        }
    }

    setFilteredProducts(sortedProducts);
  }, [filterOption, productsList, searchResults, selectedCategory]);

  const handleCategoryChange = (id: string | null) => {
    if (id === null) {
      router.push(`/categories`);
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
        <span className="font-bold">{categorySpanish(category.name)|| category.name} </span>
      </h1>
    );
  };

  return (
    <>
      {/* Título y filtro */}
      <div className="flex flex-col md:flex-row justify-around items-center bg-teal-800 py-6 text-white ">
        {renderBreadcrumb()}

        <Dropdown
          arrowIcon={false}
          label={
            <div className="flex justify-between w-[200px] md:w-[400px]" id="custom-dropdown-button">
              <span>Filtrar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          }
          dismissOnClick={true}
          style={{
            border: "1px solid white",
            backgroundColor: "#00695c",
            outline: 'none',
          }}
        >
          <Dropdown.Item onClick={() => setFilterOption("price-asc")} className="md:w-[400px]">
            Ordenar por precio: Menor a Mayor
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterOption("price-desc")} className="md:w-[400px]">
            Ordenar por precio: Mayor a Menor
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterOption("name-asc")} className="md:w-[400px]">
            Nombre: A-Z
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setFilterOption("name-desc")} className="md:w-[400px]">
            Nombre: Z-A
          </Dropdown.Item>
        </Dropdown>
      </div>

      <div className="flex flex-col lg:flex-row ">
        {/* Sidebar de categorías */}
        <div className="w-full lg:w-1/4 p-4 lg:ml-24 px-16 lg:px-0">
          <h2 className="text-lg font-bold mb-4 text-gray-400">Categorías</h2>
          <ul>
            <li className="mb-2">
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
            {categories?.map((cat) => (
              <li key={cat.id} className="mb-2">
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

        {/* Contenido principal */}
        <div className="w-full lg:w-3/4 p-4">
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  px-12 lg:px-0">
              {filteredProducts.map((product) => {
                const productCategory = categories?.find(
                  (cat) => cat.id === product.category.id
                );
                return (
                  <div
                    key={product.article_id}
                    className=" rounded-lg h-[400px] shadow-lg hover:scale-105 "
                    onClick={() => router.push(`/products/${product.id}`)}
                  >

                      <Image
                      width={500}
                        height={500}
                        src={product.imgUrl}
                        alt={product.description}
                        className="relative inset-0 w-full h-4/6 object-cover rounded-t-lg animate-fade-in-up  transition-transform duration-300 cursor-pointer"
                      />
                    <hr className=" bg-blue-gray-600"/>
                    <div className="p-4 flex flex-col justify-between w-full h-2/6">
                    {productCategory && (
                      <h3 className="text-gray-500">{productCategory.name}</h3>
                    )}
                    <h2 className="text-xl font-semibold">
                      {product.description}
                    </h2>
                    <p className="text-lg font-bold mt-2">$ {product.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center"><h1 className="text-2xl font-semibold text-gray-500 w-full text-center">No hay productos para mostrar en esta categoría.</h1></div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ProductList;
