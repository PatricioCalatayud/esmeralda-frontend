"use client";
import { RiDeleteBin6Fill, RiAddLargeFill } from "react-icons/ri";
import { Tooltip } from "flowbite-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { IProductList } from "@/interfaces/IProductList";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { useProductContext } from "@/context/product.context";
import {
  deleteProducts,
  getProducts,
  putProducts,
} from "../../../../helpers/ProductsServices.helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "@material-tailwind/react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";

const ProductList = () => {
  const { token } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const PRODUCTS_PER_PAGE = 7; // Cantidad de productos por página
  const { allProducts } = useProductContext();
  const [products, setProducts] = useState<IProductList[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  //! Obtener los productos
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      if (products) {
        setTotalPages(Math.ceil(products.length / PRODUCTS_PER_PAGE));
    setProducts(products);
    setLoading(false);
      }
      
    }

    fetchProducts();
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
      const response = await putProducts(dataProducts, id, token);

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
      const response = await putProducts(dataProducts, id, token);
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

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <Spinner
        color="teal"
        className="h-12 w-12"
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      />
    </div>
  ) : (
    <DashboardComponent
    setCurrentPage={onPageChange}
      titleDashboard="Listado de Productos"
      searchBar="Buscar productos"
      handleSearchChange={handleSearchChange}
      totalPages={totalPages}
      tdTable={[
        "Producto",
        "Stock",
        "Precio",
        "Descuento",
        "Acciones",
        "Habilitar",
      ]}
      noContent="No hay Productos disponibles"
      buttonTopRight={
        <>
            <RiAddLargeFill />
            Agregar Producto
            </>
      }
      buttonTopRightLink="../../dashboard/administrador/productAdd"
    >
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
          {/*<td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {product.stock}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            $ {product.price}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
            {product.discount} %
          </td>*/}
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div className="flex items-center space-x-4 justify-center">
              <Tooltip content="Editar">
                <Link
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  href={`/dashboard/administrador/product/${product.id}`}
                >
                  <FontAwesomeIcon icon={faPen} />
                </Link>
              </Tooltip>
              <Tooltip content="Eliminar">
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex items-center text-red-400 hover:text-white border border-red-800 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </Tooltip>
            </div>
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div className="flex items-center justify-center space-x-4">
              {/*<input
                type="checkbox"
                checked={product.isAvailable}
                onChange={() =>
                  product.isAvailable
                    ? handleDisableProduct(product.id)
                    : handleEnableProduct(product.id)
                }
                className="w-5 h-5"
              />*/}
            </div>
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default ProductList;
