"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Category, IProductList } from "@/interfaces/IProductList";
import { getCategories } from "@/helpers/categories.helper";
import { useProductContext } from '@/context/product.context';
import Link from "next/link";

interface ProductsClientPageProps {
  selectedCategory: string | null;
  category: Category | null;
  productsList: IProductList[];
}

const ProductList: React.FC<ProductsClientPageProps> = ({
  selectedCategory,
  category,
  productsList,
}) => {
  const router = useRouter();
  const { searchResults, allProducts } = useProductContext();
  const [filterOption, setFilterOption] = useState<string>("");
  const [filteredProducts, setFilteredProducts] =
    useState<IProductList[]>(productsList);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    let sortedProducts = [...(searchResults.length > 0 ? searchResults : productsList)];

    if (selectedCategory) {
      sortedProducts = sortedProducts.filter(product => product.category.id === selectedCategory);
    }

    switch (filterOption) {
      case "price-asc":
        sortedProducts.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
        break;
      case "price-desc":
        sortedProducts.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
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
        sortedProducts = [...(searchResults.length > 0 ? searchResults : productsList)];
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
      <h1 className="text-2xl">
        <Link href="/categories">Productos</Link>
        {" / "}
        <span className="font-bold">{category.name}</span>
      </h1>
    );
  };

  return (
    <>
      {/* Título y filtro */}
      <div className="flex flex-col md:flex-row justify-around items-center bg-teal-800 py-6 text-white">
        {renderBreadcrumb()}
        <div className="flex items-center bg-teal-700 py-2 px-8 rounded-full mt-4 md:mt-0">
          <select
            id="filter"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="bg-transparent border-none outline-none focus:outline-none p-2 text-white"
          >
            <option value="" className="text-black">
              Filtrar
            </option>
            <option value="price-asc" className="text-black">
              Ordenar por precio: Menor a Mayor
            </option>
            <option value="price-desc" className="text-black">
              Ordenar por precio: Mayor a Menor
            </option>
            <option value="name-asc" className="text-black">
              Nombre: A-Z
            </option>
            <option value="name-desc" className="text-black">
              Nombre: Z-A
            </option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar de categorías */}
        <div className="w-full lg:w-1/4 p-4 lg:ml-24">
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
            {categories.map((cat) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const productCategory = categories.find(
                (cat) => cat.id === product.category.id
              );
              return (
                <div
                  key={product.article_id}
                  className="p-4 rounded-lg h-full"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <div className="relative pb-56 flex justify-items-start">
                    <img
                      src={product.imgUrl}
                      alt={product.description}
                      className="absolute inset-0 w-46 h-full object-contain rounded-t-lg animate-fade-in-up hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                  {productCategory && (
                    <h3 className="text-gray-500">{productCategory.name}</h3>
                  )}
                  <h2 className="text-xl font-semibold">
                    {product.description}
                  </h2>
                  <p className="text-lg font-bold mt-2">${product.price}</p>
                </div>
              );
            })}
          </div>
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