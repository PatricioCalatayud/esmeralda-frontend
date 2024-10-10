"use client";
import { RiDeleteBin6Fill, RiAddLargeFill } from "react-icons/ri";
import { Tooltip } from "flowbite-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { IProductList, ISubProduct } from "@/interfaces/IProductList";
import Image from "next/image";
import { useAuthContext } from "@/context/auth.context";
import { useProductContext } from "@/context/product.context";
import {
  deleteProducts,
  getProducts,
  putProducts,
} from "../../../../helpers/ProductsServices.helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "@material-tailwind/react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";
import { validateSubproduct } from "@/utils/subproductsUpdateValidation";

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
  const [addSubproduct, setAddSubproduct] = useState<{ id: string }>();
  const [editProductId, setEditProductId] = useState({
    amount : "",
    price : "",
    discount : 0,
    unit: "",
    stock: 0,
  });
  const [addSubproductId, setAddSubproductId] = useState({
    amount : "",
    price : "",
    discount : 0,
    unit: "",
    stock: 0,
  });
  //! Obtener los productos
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      if (products) {
        setTotalPages(Math.ceil(products.length / PRODUCTS_PER_PAGE));
        setProducts(products);
        setLoading(false);
      }
    };

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
  const handleEnableProduct = async (id: string, subproduct:ISubProduct) => {
    const dataProducts = {
      subproducts:[
      {
        id:subproduct.id,
      isAvailable: true as boolean
    }
    ] };
    console.log(typeof dataProducts.subproducts[0].isAvailable);
    if (!token) {
      Swal.fire(
        "¡Error!",
        "Token no encontrado. Por favor, inicia sesión.",
        "error"
      );
      return;
    }
    console.log(dataProducts);

      const response = await putProducts(dataProducts, id, token);

      console.log("Producto habilitado:", response);
   if(response && (response.status === 200 || response.status === 201)){
    setProducts((prevProducts) =>
      prevProducts?.map((product) => {
        if (product.id === id) {
          // Reemplaza el subproducto existente con el subproducto actualizado
          const updatedSubproducts = product.subproducts.map((sp) =>
            sp.id === subproduct.id
              ? { ...sp, isAvailable: true } // Solo cambia el estado de disponibilidad
              : sp
          );
          return { ...product, subproducts: updatedSubproducts };
        }
        return product;
      })
    );
    } else {
      console.error("Error enabling product:", response);
      Swal.fire(
        "¡Error!",
        "Ha ocurrido un error al habilitar el producto",
        "error"
      );
    }
  };

  //! Función para manejar la deshabilitación de un producto
  const handleDisableProduct = async (id: string, subproduct:ISubProduct) => {
    const dataProducts = {
      subproducts:[
      {
        id:subproduct.id,
      isAvailable: false as boolean
    }
    ] };
    console.log(typeof dataProducts.subproducts[0].isAvailable);
    if (!token) {
      Swal.fire(
        "¡Error!",
        "Token no encontrado. Por favor, inicia sesión.",
        "error"
      );
      return;
    }
      const response = await putProducts(dataProducts, id, token);
      console.log("Producto deshabilitado:", response);
    if(response && (response.status === 200 || response.status === 201)){
      setProducts((prevProducts) =>
        prevProducts?.map((product) => {
          if (product.id === id) {
            // Reemplaza el subproducto existente con el subproducto actualizado
            const updatedSubproducts = product.subproducts.map((sp) =>
              sp.id === subproduct.id
                ? { ...sp, isAvailable: false } // Solo cambia el estado de disponibilidad
                : sp
            );
            return { ...product, subproducts: updatedSubproducts };
          }
          return product;
        })
      );
    }
      
    else {
      console.error("Error disabling product:", response);
      Swal.fire(
        "¡Error!",
        "Ha ocurrido un error al deshabilitar el producto",
        "error"
      );
    }
  };

  //! Funciónes para editar un subproducto
  const handleEditProduct = (e:  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, subproductId: string) => {

    const { name, value } = e.target;
    setEditProductId((prev) => ({
      ...prev,
      [name]: value,
      id : subproductId, // Incluye el ID del subproducto o producto principal
    }));
    console.log(editProductId);
  };

  const handleEditSubproductCheck = async(id: string,subproduct:ISubProduct) => {
    if(editProductId.stock === 0 && editProductId.price === "" && editProductId.discount === undefined && editProductId.unit === "" && editProductId.amount === ""){
      Swal.fire(
        "¡Error!",
        "Todos los campos son obligatorios",
        "error"
      );
      return;
    }else {
    const bodySubproducts = {
      subproducts : [{
        ...editProductId
      }]
    }
    const response = await putProducts(bodySubproducts,id, token);
    if (response && (response.status === 200 || response.status === 201) ) {
      
      setProducts((prevProducts: any) =>
        prevProducts?.map((product:any) => {
          if (product.id === id) {
            // Reemplaza el subproducto existente con el subproducto actualizado
            const updatedSubproducts = product.subproducts.map((sp:any) =>
              sp.id === subproduct.id
                ? { ...editProductId, id: subproduct.id } // Reemplaza completamente el subproducto
                : sp
            );
            console.log(product);
            return { ...product, subproducts: updatedSubproducts };
          }
          return product;
        })
      );
      setEdit(0);
    } else {
      const validate = validateSubproduct(editProductId);

      console.error("Error al editar el subproducto:", response);
      Swal.fire(
        "¡Error!",
        `Ha ocurrido un error al editar el subproducto ${validate.amount && validate.amount + " ," } ${validate.unit && validate.unit + " ,"} ${validate.price && validate.price + " ,"} ${validate.stock && validate.stock + " ,"} ${validate.discount}`,
        "error"
      );
    }}
  };
  //! Funciónes para agregar un subproducto
  const handleAddSubproduct = (e:  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: string) => {
    const { name, value } = e.target;
    
    setAddSubproductId((prev) => ({
      ...prev,
      [name]: value,
      //id, // Incluye el ID del subproducto o producto principal
    }));
    console.log(addSubproductId);
  };
  const handleAddSubproductCheck = async(id: string) => {
    if (addSubproductId.stock === 0 && addSubproductId.amount ==="" && addSubproductId.unit === "" && addSubproductId.price === "" && addSubproductId.discount === undefined) {
      Swal.fire(
        "¡Error!",
        "Todos los campos son obligatorios",
        "error"
      );
      return;
    }else {

    const bodySubproducts = {
      subproducts : [{
        ...addSubproductId
      }]
    }
    
    const response = await putProducts(bodySubproducts ,id, token);
    if (response && (response.status === 200 || response.status === 201) ) {
      const addId  = response.data.subproducts.at(-1)?.id
      const newSubproduct = {
        id: addId,
        amount: addSubproductId.amount,
        unit: addSubproductId.unit,
        price: addSubproductId.price,
        stock: addSubproductId.stock,
        discount: addSubproductId.discount,
        isAvailable: true
      }
      setProducts((prevProducts) =>
        prevProducts?.map((product) => {
          if (product.id === id) {
            const updatedSubproducts = [
              ...product.subproducts , // Mantener los subproductos existentes
              newSubproduct // Agregar el nuevo subproducto
            ];
            return { ...product, subproducts: updatedSubproducts };
          }
          return product;
        }) as IProductList[] 
      );
      setAddSubproduct({id:""}); 
      setAddSubproductId({amount : "",
        price : "",
        discount : 0,
        unit: "",
        stock: 0,});
    } else {
      console.error("Error al agregar el subproducto:", response);
      const validate = validateSubproduct(addSubproductId);
      Swal.fire(
        "¡Error!",
        `Ha ocurrido un error al agregar el subproducto ${validate.amount && validate.amount + " ," } ${validate.unit && validate.unit + " ,"} ${validate.price && validate.price + " ,"} ${validate.stock && validate.stock + " ,"} ${validate.discount}`,
        "error"
      );
    }}
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
            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/2"
          >
            <div className="flex items-center justify-between w-full">
              <Image
                width={500}
                height={500}
                priority={true}
                src={product.imgUrl}
                alt={product.description}
                className="h-12 w-12 mr-3 rounded-lg"
              />
              {product.description}
              <Tooltip content="Editar">
                <Link
                  href={`/dashboard/administrador/product/${product.id}`}
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <FontAwesomeIcon icon={faPen} />
                </Link>
              </Tooltip>
            </div>
          </th>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center w-20">
            <div className="flex flex-col gap-1 ">
            {product.subproducts.map((subproduct, index) =>
              String(edit) !== String(subproduct.id) ? (
                <p
                  key={index}
                  className="h-10 flex items-center justify-center w-20"
                >
                  {subproduct.stock}
                </p>
              ) : (
                <input
                  key={index}
                  className="h-10 rounded-md p-2 w-20 border border-gray-600 "
                  type="text"
                  name="stock"
                  defaultValue={String(subproduct.stock)}
                  placeholder={String(subproduct.stock)}
                  onChange={(e) => handleEditProduct(e, String(subproduct.id))}
                />
              )
            )}
            {addSubproduct?.id === product.id ? (
              <input
                className="h-10 rounded-md p-2 w-20 border border-gray-600"
                type="text"
                name="stock"
                placeholder="0"
                onChange={(e) => handleAddSubproduct(e, String(product.id))}
              />
            ) : <div className="h-10 flex items-center justify-center"/>}
            </div>
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center w-52">
          <div className="flex flex-col gap-1">
            {product.subproducts.map((subproduct, index) =>
              String(edit) !== String(subproduct.id) ? (
                <p
                  key={index}
                  className="h-10 flex items-center  justify-center w-52"
                >
                  {subproduct.amount} {subproduct.unit}
                </p>
              ) : (
                <div
                  key={index}
                  className="flex justify-center items-center gap-2 w-52"
                >
                  {" "}
                  <input
                    className="h-10 rounded-md p-2 w-1/3 border border-gray-600"
                    type="text"
                    name="amount"
                    placeholder="0"
                    defaultValue={subproduct.amount}
                    onChange={(e) =>
                      handleEditProduct(e, String(subproduct.id))
                    }
                  />
                  <select
                    id="unit"
                    name="unit"
                    className="bg-gray-50 h-10 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-2/3 "
                    onChange={(e) =>
                      handleEditProduct(e, String(subproduct.id))
                    }
                  >
                    <option value={subproduct.unit}>{subproduct.unit}</option>
                     {subproduct.unit !== "Kilo" && <option value="Kilo">Kilo</option>}
    {subproduct.unit !== "Gramos" && <option value="Gramos">Gramos</option>}
    {subproduct.unit !== "Unidades" && <option value="Unidades">Unidades</option>}
    {subproduct.unit !== "Sobres" && <option value="Sobres">Sobres</option>}
    {subproduct.unit !== "Cajas" && <option value="Cajas">Cajas</option>}
                  </select>{" "}
                </div>
              )
            )}
            {addSubproduct?.id === product.id ? (
              <div className="flex justify-center items-center gap-2 w-52">
                {" "}
                <input
                  className="h-10 rounded-md p-2 w-1/3  border border-gray-600"
                  type="text"
                  name="amount"
                  placeholder="0"
                  onChange={(e) => handleAddSubproduct(e, String(product.id))}
                />
                <select
                  id="unit"
                  name="unit"
                  className="bg-gray-50 h-10 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-2/3 "
                  onChange={(e) => handleAddSubproduct(e, String(product.id))}
                >
                  <option value="">Seleccionar</option>
                  <option value={"Kilo"}>Kilo</option>
                  <option value={"Gramos"}>Gramos</option>
                  <option value={"Unidades"}>Unidades</option>
                  <option value={"Sobres"}>Sobres</option>
                  <option value={"Cajas"}>Cajas</option>
                </select>{" "}
              </div>
            ):  <div className="h-10 flex items-center justify-center"/>}
            </div>
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center w-32">
          <div className="flex flex-col gap-1">
            {product.subproducts.map((subproduct, index) =>
              String(edit) !== String(subproduct.id) ? (
                <p
                  key={index}
                  className="h-10 flex items-center  justify-center w-32"
                >
                  $ {subproduct.price}
                </p>
              ) : (
                <div className="flex justify-center items-center gap-2 w-32" key={index}> $ <input
                  key={index}
                  name="price"
                  className="h-10  rounded-md p-2 w-full border border-gray-600"
                  type="text"
                  placeholder={`${subproduct.price}`}
                  defaultValue={subproduct.price}
                  onChange={(e) => handleEditProduct(e, String(subproduct.id))}
                /> </div>
              )
            )}
            {addSubproduct?.id === product.id ? (
              <div className="flex justify-center items-center gap-2 w-32"> $<input
                className="h-10 rounded-md p-2 w-full border border-gray-600"
                type="text"
                name="price"
                placeholder="0"
                onChange={(e) => handleAddSubproduct(e, String(product.id))}
              /></div>
            ) : <div className="h-10 flex items-center justify-center"/>}
            </div>
          </td>
          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center w-32">
          <div className="flex flex-col gap-1">
            {product.subproducts.map((subproduct, index) =>
              String(edit) !== String(subproduct.id) ? (
                <p
                  key={index}
                  className="h-10 flex items-center  justify-center w-32"
                >
                  {subproduct.discount} %
                </p>
              ) : (
                <div className="flex justify-center items-center gap-2 w-32" key={index}><input
                  key={index}
                  className="h-10 rounded-md p-2 w-full border border-gray-600"
                  type="text"
                  name="discount"
                  defaultValue={subproduct.discount}
                  placeholder={`${subproduct.discount}`}
                  onChange={(e) => handleEditProduct(e, String(subproduct.id))}
                /> %</div>
              )
            )}
            {addSubproduct?.id === product.id ? (
              <div className="flex justify-center items-center gap-2 w-32"><input
                className="h-10 rounded-md p-2 w-full border border-gray-600"
                type="text"
                name="discount"
                placeholder="0"
                onChange={(e) => handleAddSubproduct(e, String(product.id))}
              />%</div>
            ):  <div className="h-10 flex items-center justify-center"/>}
            </div>
          </td>

          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white w-full">
            <div className="flex items-center space-x-4 justify-center ">
              <div className="flex flex-col gap-3">
                {product.subproducts.map((subproduct, index) =>
                  edit === subproduct.id ? (
                    <Tooltip content="Correcto" key={index}>
                      <button
                        type="button"
                        onClick={() => handleEditSubproductCheck(product.id, subproduct)}
                        className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip content="Editar" key={index}>
                      <div
                        data-drawer-target="drawer-update-product"
                        data-drawer-show="drawer-update-product"
                        aria-controls="drawer-update-product"
                        className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600  rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        onClick={() => {setEdit(subproduct.id)
                          setEditProductId(subproduct )}
                          
                        }
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </div>
                    </Tooltip>
                  )
                )}
 {addSubproduct?.id !== product.id ?
                <Tooltip content="Agregar Subproducto">
                  <button
                    onClick={() => setAddSubproduct({ id: product.id })}
                    type="button"
                    className="flex items-center text-gray-600 hover:text-white  hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </Tooltip> : <Tooltip content="Agregar Subproducto">
                  <button
                    onClick={() => handleAddSubproductCheck(product.id)}
                    type="button"
                    className="flex items-center text-gray-600 hover:text-white  hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                    
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </Tooltip>}
              </div>

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
            <div className="flex flex-col items-center justify-center gap-3">
              {product.subproducts.map((subproduct, index) => (
                <input
                  key={index}
                  type="checkbox"
                  checked={subproduct.isAvailable}
                  onChange={() =>
                    subproduct.isAvailable
                      ? handleDisableProduct(product.id, subproduct)
                      : handleEnableProduct(product.id, subproduct)
                  }
                  className="w-5 h-5 m-1"
                />
              ))}
              <div className="h-5"/>
            </div>
            
          </td>
        </tr>
      ))}
    </DashboardComponent>
  );
};

export default ProductList;
