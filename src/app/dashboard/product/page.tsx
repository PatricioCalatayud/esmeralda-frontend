"use client";
import { MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { RiDeleteBin6Fill, RiAddLargeFill } from "react-icons/ri";
import { Pagination, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { useProductContext } from "@/context/product.context";
import { deleteProducts, putProducts } from "../../../helpers/ProductsServices.helper";

const ProductList = () => {
  const {token} = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const PRODUCTS_PER_PAGE = 10; // Cantidad de productos por página
  const {allProducts} = useProductContext();
  const [products, setProducts] = useState<IProductList[] | undefined>([]);

  //! Obtener los productos
  useEffect(() => {
    if (allProducts)
        setTotalPages(Math.ceil(allProducts.length / PRODUCTS_PER_PAGE));
        setProducts(allProducts);

  }, [allProducts]);

  //! Función para calcular los productos a mostrar en la página actual
  const getCurrentPageProducts = () => {
    const filteredProducts = filterProducts();
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts?.slice(startIndex, endIndex);
  };

  //! Función para filtrar los productos
  const filterProducts = () => {
    if (searchTerm === "") {
      return products; // Si el campo de búsqueda está vacío, mostrar todos los productos
    } else {
      return products?.filter((product) =>
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  //! Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Actualizar el estado del término de búsqueda
    setCurrentPage(1); // Reiniciar la página actual al cambiar el término de búsqueda
  };

  const onPageChange = (page: number) => setCurrentPage(page);

  //! Función para manejar la eliminación de un producto
  const handleDeleteProduct = async (id: string) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      try {
        if (!token) {
          Swal.fire(
            "¡Error!",
            "Token no encontrado. Por favor, inicia sesión.",
            "error"
          );
          return;
        }

        const response = await deleteProducts(id, token);


        console.log("Response data:", response);

        if (response && response.status === 200) {
          Swal.fire("¡Eliminado!", "El producto ha sido eliminado", "success");
          setProducts((prevProducts) =>
            prevProducts?.filter((product) => product.id !== id)
          );
          console.log("Producto eliminado:", id);
        } else {
          console.error(
            "Error en la respuesta del servidor:",
            response?.status,
            response?.statusText,
            response
          );
          Swal.fire(
            "¡Error!",
            `Error del servidor: ${
              response?.statusText || "No se pudo eliminar el producto"
            }`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire(
          "¡Error!",
          "Ha ocurrido un error al eliminar el producto",
          "error"
        );
      }
    }
  };

  //! Función para habilitar un producto
  const handleEnableProduct = async (id: string) => {
    const dataProducts = { isAvailable: true };
    if (!token) {
      Swal.fire(
        "¡Error!",
        "Token no encontrado. Por favor, inicia sesión.",
        "error"
      );
      return;
    }

    try {
      const response = await putProducts(
        dataProducts ,
        id,
        token
      )

      console.log("Producto habilitado:", response);
      setProducts((prevProducts) =>
        prevProducts?.map((product) =>
          product.id === id ? { ...product, isAvailable: true } : product
        )
      );
    } catch (error) {
      console.error("Error enabling product:", error);
      Swal.fire(
        "¡Error!",
        "Ha ocurrido un error al habilitar el producto",
        "error"
      );
    }
  };

  //! Función para manejar la deshabilitación de un producto
  const handleDisableProduct = async (id: string) => {
    const dataProducts = { isAvailable: false };
    if (!token) {
      Swal.fire(
        "¡Error!",
        "Token no encontrado. Por favor, inicia sesión.",
        "error"
      );
      return;
    }

    try {
      const response = await putProducts(
        dataProducts ,
        id,
        token
      )
      console.log("Producto deshabilitado:", response);
      setProducts((prevProducts) =>
        prevProducts?.map((product) =>
          product.id === id ? { ...product, isAvailable: false } : product
        )
      );
    } catch (error) {
      console.error("Error disabling product:", error);
      Swal.fire(
        "¡Error!",
        "Ha ocurrido un error al deshabilitar el producto",
        "error"
      );
    }
  };

  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="mx-auto max-w-screen-2xl px-1 lg:px-2 ">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-900">
            <div className="flex-1 flex items-center space-x-2">
              <h5>
                <span className="text-green-400">Listado de Productos</span>
              </h5>
            </div>
            <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3"></div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IoSearchSharp />
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    placeholder="Search for products"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <Link
                  type="button"
                  id="createProductButton"
                  data-modal-toggle="createProductModal"
                  className=" gap-2 flex items-center justify-center text-white bg-teal-800 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                  href="../../dashboard/productAdd"
                >
                  <RiAddLargeFill />
                  Agregar Producto
                </Link>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4 text-center">
                    Producto
                  </th>
                  <th scope="col" className="p-4 text-center">
                    Stock
                  </th>
                  <th scope="col" className="p-4 text-center">
                    Precio
                  </th>
                  <th scope="col" className="p-4 text-center">
                    Descuento
                  </th>
                  <th scope="col" className="p-4 text-center">
                    Acciones
                  </th>
                  <th scope="col" className="p-4 text-center">
                    Habilitar
                  </th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageProducts()?.map((product: IProductList) => (
                  <tr
                    key={product.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="flex items-center ">
                        <Image
                          width={500}
                          height={500}
                          priority={true}
                          src={product.imgUrl}
                          alt={product.description}
                          className="h-12 w-12 mr-3 rounded-lg"
                        />
                        {product.description}
                      </div>
                    </th>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        {product.stock}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      $ {product.price} 
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {product.discount} %
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center space-x-4 justify-center">
                        <Tooltip content="Editar">
                          <Link
                            type="button"
                            data-drawer-target="drawer-update-product"
                            data-drawer-show="drawer-update-product"
                            aria-controls="drawer-update-product"
                            className="py-2 px-3 flex items-center text-sm font-medium text-center text-teal-600 bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            href={`../../dashboard/product/${product.id}`}
                          >
                            <MdEdit size={20} />
                          </Link>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center text-red-400 hover:text-white border border-teal-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          >
                            <RiDeleteBin6Fill size={20} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center justify-center space-x-4">
                        <input
                          type="checkbox"
                          checked={product.isAvailable}
                          onChange={() =>
                            product.isAvailable
                              ? handleDisableProduct(product.id)
                              : handleEnableProduct(product.id)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex overflow-x-auto sm:justify-center py-5 bg-gray-900">
            <Pagination
              layout="pagination"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              previousLabel="Anterior"
              nextLabel="Siguiente"
              showIcons
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;