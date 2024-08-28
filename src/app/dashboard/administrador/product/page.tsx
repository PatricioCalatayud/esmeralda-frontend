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
import { faCheck, faPen, faPlug, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const [edit, setEdit] = useState(0);

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
  const handleEnableProduct = async (id: string, idSubproduct: string) => {
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
  const handleDisableProduct = async (id: string, idSubproduct: string) => {
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
 const handleEditProduct = (e: any, id: string) => {

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
        "Cantidad",
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

          

            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center" >
            {product.subproducts.map((subproduct, index) => (
              String(edit) !== String(subproduct.id) ? (<p key={index} className="h-10 flex items-center justify-center">
            {subproduct.stock}
            </p>) : (<input key={index} className="h-10 rounded-md p-2 w-14 border border-gray-600" type="text" placeholder={String(subproduct.stock)} onChange={(e) => handleEditProduct(e, String(subproduct.id))}/>)
                      ))}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center " >
            {product.subproducts.map((subproduct, index) => (
              String(edit) !== String(subproduct.id) ? (<p key={index} className="h-10 flex items-center  justify-center">
            {subproduct.amount} {subproduct.unit}
            </p>) : (<div key={index} className="flex justify-center items-center gap-2"> <input className="h-10 rounded-md p-2 w-14 border border-gray-600" type="text" placeholder={subproduct.amount} onChange={(e) => handleEditProduct(e, String(subproduct.id))}/><select
                id="status"
                name="status"
                className="bg-gray-50 h-10 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full "
                onChange={(e) => handleEditProduct(e, String(subproduct.id))}
              >
                <option value="">Unidad</option>
                <option value={"Kilo"}>Kilo</option>
                <option value={"Gramos"}>Gramos</option>
                <option value={"Unidad"}>Unidad</option>
                <option value={"Sobres"}>Sobres</option>
              </select> </div>)
                      ))}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center " >
          {product.subproducts.map((subproduct, index) => (
            String(edit) !== String(subproduct.id) ?
            (<p key={index} className="h-10 flex items-center  justify-center">
            $ {subproduct.price}
            </p>) : (<input key={index} className="h-10  rounded-md p-2 w-20 border border-gray-600" type="text" placeholder={`$ ${subproduct.price}`} onChange={(e) => handleEditProduct(e, String(subproduct.id))}/>)
          ))}
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center " >
          {product.subproducts.map((subproduct, index) => (
             String(edit) !== String(subproduct.id) ?
            (<p key={index} className="h-10 flex items-center  justify-center">
            {subproduct.discount} %
            </p>) : (<input key={index} className="h-10 rounded-md p-2 w-20 border border-gray-600" type="text" placeholder={`${subproduct.discount} %`} onChange={(e) => handleEditProduct(e, String(subproduct.id))}/>)
          ))}
          </td>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <div className="flex items-center space-x-4 justify-center">
              <div className="flex flex-col gap-2">
            {product.subproducts.map((subproduct, index) => (
                  edit === subproduct.id ? (
                    <Tooltip content="Correcto" key={index}>
                  <button
                    type="button"
                    onClick={() => setEdit(0)}
                    className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </Tooltip>
                  ): (<span className="h-8" key={index}/>)
                ))}
                </div>
              <div className="flex flex-col gap-2">
                
            {product.subproducts.map((subproduct, index) => (
              
              
              <Tooltip content="Editar" key={index}>
                <div

                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"

                  onClick={() =>{
                    if (edit === subproduct.id) {
                      setEdit(0);
                    } else {
                      setEdit(subproduct.id);
                    }
                  }}
                  
                >
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </Tooltip>
            ))}
            </div>
            <Tooltip content="Agregar Subproducto">
                <Link
                href={`/dashboard/administrador/product/${product.id}`}
                  type="button"
                  className="flex items-center text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                >
                  <FontAwesomeIcon icon={faPlus} />
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
            <div className="flex flex-col items-center justify-center gap-2">
               {product.subproducts.map((subproduct, index) => (
                <input
                key={index}
                type="checkbox"
                checked={subproduct.isAvailable}
                onChange={() =>
                  subproduct.isAvailable
                    ? handleDisableProduct(product.id, String(subproduct.id))
                    : handleEnableProduct(product.id, String(subproduct.id))
                }
                className="w-5 h-5"
              />
              ))}
            </div>
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default ProductList;
