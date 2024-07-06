"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "../../helpers/categories";
import { ICategory } from "@/interfaces/ICategory";
import { IProduct } from "../../interfaces/IProduct";
import { useState } from "react";

interface ProductsClientPageProps {
  selectedCategory: number | null;
  category: ICategory | null;
  productsList: IProduct[];
}

const ProductList: React.FC<ProductsClientPageProps> = ({
  selectedCategory,
  category,
  productsList,
}) => {
  const router = useRouter();
  const [filterOption, setFilterOption] = useState<string>("");

  const handleCategoryChange = (id: number | null) => {
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
      <div className="flex flex-col md:flex-row justify-around items-center bg-green-800 py-6 text-white">
        {renderBreadcrumb()}
        <div className="flex items-center bg-green-700 py-2 px-8 rounded-full mt-4 md:mt-0">
          <select
            id="filter"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="bg-transparent border-none outline-none focus:outline-none p-2 text-white"
          >
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
            {categories.map((cat) => (
              <li key={cat.id} className="mb-2">
                <button
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`text-lg ${
                    selectedCategory === cat.id
                      ? "font-bold text-green-800"
                      : "text-green-600"
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
            {productsList.map((product) => (
              <div
                key={product.id}
                className="border p-4 rounded-lg"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-lg font-bold mt-2">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
