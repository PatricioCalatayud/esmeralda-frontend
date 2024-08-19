"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import Swal from "sweetalert2";
import { Category, IProductResponse, IProductUpdate } from "@/interfaces/IProductList";

import { productAddValidation } from "@/utils/productAddValidation";

import { useAuthContext } from "@/context/auth.context";
import { getCategories } from "../../../../helpers/CategoriesServices.helper";
import { postProducts } from "../../../../helpers/ProductsServices.helper";
import { Spinner } from "@material-tailwind/react";
import { useCategoryContext } from "@/context/categories.context";


const apiURL = process.env.NEXT_PUBLIC_API_URL;

const InsertProduct = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {token} = useAuthContext();
  const {categories, categoriesLoading} = useCategoryContext();

  //! Estado para almacenar los datos del producto
  const [dataProduct, setDataProduct] = useState<IProductUpdate>({
    description: "",
    price: "",
    stock: "",
    discount: "",
    categoryID: "",

    presentacion: "",
    tipoGrano: "",
    medida: "",
  });

  //! Estado para almacenar los errores
  const [errors, setErrors] = useState<IProductUpdate>({
    description: "",
    price: "",
    stock: "",
    discount: "",
    categoryID: "",

    presentacion: "",
    tipoGrano: "",
    medida: "",
  });


  //! Función para manejar los cambios en los inputs
  const handleChange = (e: any) => {
    e.preventDefault();
    setDataProduct({
      ...dataProduct,
      [e.target.name]: e.target.value,
    });
  };

  //! Función para manejar los cambios en la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const imageUrl = URL.createObjectURL(file);

      // Copiar el estado anterior y actualizar solo imgUrl
      setDataProduct((prevDataProduct) => ({
        ...prevDataProduct,
        imgUrl: imageUrl,
      }));
    }
  };

  //! Función para enviar los datos del producto al backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", dataProduct.description);
    formData.append("presentacion", dataProduct.presentacion || "");
    formData.append("tipoGrano", dataProduct.tipoGrano || "");
    formData.append("medida", dataProduct.medida || "");
    formData.append("price", dataProduct.price);
    formData.append("stock", Number(dataProduct.stock).toString());
    formData.append("discount", dataProduct.discount);
    formData.append("categoryID", dataProduct.categoryID);
    if (imageFile) {
      formData.append("file", imageFile);
    }

    // Log the FormData content
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    //! Mostrar alerta de carga mientras se procesa la solicitud
    Swal.fire({
      title: "Agregando producto...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {

      const response = await postProducts(formData, token);

      console.log("Response:", response);
      console.log("Product added successfully");

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Agregado!",
        text: "El producto ha sido agregado con éxito.",
      }).then(() => {
        router.push("../../dashboard/administrador/product");
      });
    } catch (error) {
      console.error("Error adding product:", error);

      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al agregar el producto.",
      });
    }
  };

  //!Validar formulario
/*  useEffect(() => {
    const validationErrors = productAddValidation(dataProduct);
    setErrors(validationErrors);
  }, [dataProduct]);
*/
  return (
    categoriesLoading ? <div className="flex items-center justify-center h-screen">
    <Spinner
      color="teal"
      className="h-12 w-12"
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  </div> :
    <div className="min-h-screen flex flex-col justify-start items-center px-10 dark:bg-gray-700">
      <div className="relative p-4 bg-white rounded-lg shadow-2xl dark:bg-gray-800 sm:p-5">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Agregar un nuevo producto
          </h3>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Producto
              </label>
              <input
                type="text"
                name="description"
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nombre del producto"
                value={dataProduct.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Categorías
              </label>
              <select
                id="category"
                name="categoryID"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={dataProduct.categoryID}
                onChange={handleChange}
              >
                <option value="">--Seleccione--</option>
                {categories?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryID && (
                <span className="text-red-500">{errors.categoryID}</span>
              )}
            </div>

            <div className="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Presentación
                </label>
                <select
                  id="presentacion"
                  name="presentacion"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={dataProduct.presentacion}
                  onChange={handleChange}
                >
                  <option value="">--Seleccione--</option>
                  <option value="molido">Molido</option>
                  <option value="grano">Grano</option>
                  <option value="capsulas">Cápsulas</option>
                </select>
                {errors.presentacion && (
                  <span className="text-red-500">{errors.presentacion}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="discount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tipo de grano
                </label>
                <select
                  id="tipoGrano"
                  name="tipoGrano"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={dataProduct.tipoGrano}
                  onChange={handleChange}
                >
                  <option value="">--Seleccione--</option>
                  <option value="santos">Santos</option>
                  <option value="colombiano">Colombiano</option>
                  <option value="torrado">Torrado</option>
                  <option value="rio de oro">Rio de Oro</option>
                  <option value="descafeino">Descafeinado</option>
                  <option value="blend-premium">Blend</option>
                  <option value="mezcla-baja calidad">Mezcla</option>
                </select>
                {errors.discount && (
                  <span className="text-red-500">{errors.tipoGrano}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Unidad de medida
                </label>
                <select
                  id="medida"
                  name="medida"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={dataProduct.medida}
                  onChange={handleChange}
                >
                  <option value="">--Seleccione--</option>
                  <option value="kilo">Kilo</option>
                  <option value="unidades">Unidades</option>
                  <option value="sobre">Sobres</option>
                  <option value="caja">Caja</option>
                </select>
                {errors.medida && (
                  <span className="text-red-500">{errors.medida}</span>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Precio
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="0.00"
                  value={dataProduct.price}
                  onChange={handleChange}
                />
                {errors.price && (
                  <span className="text-red-500">{errors.price}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="discount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Descuento
                </label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="0.00"
                  value={dataProduct.discount}
                  onChange={handleChange}
                />
                {errors.discount && (
                  <span className="text-red-500">{errors.discount}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="0"
                  value={dataProduct.stock}
                  onChange={handleChange}
                />
                {errors.stock && (
                  <span className="text-red-500">{errors.stock}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Imagen del producto
            </span>
            <div className="flex justify-center items-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col justify-center items-center w-full h-18 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                  <IoCloudUploadOutline />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Click para subir imagen
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or JPGE (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {imageFile && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Imagen del producto"
                  width={500} // debes especificar un ancho
                  height={300} // y una altura
                  className="max-w-44 h-auto"
                />
              </div>
            )}
          </div>

          <div className="items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <button
              disabled={Object.values(errors).some((error) => error)}
              type="submit"
              className="w-full sm:w-auto justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Agregar producto
            </button>

            <Link
              data-modal-toggle="createProductModal"
              type="button"
              className="w-full justify-center sm:w-auto text-red-500 inline-flex items-center hover:bg-gray-100 bg-white  focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              href="../../dashboard/administrador/product"
            >
              <FaArrowLeft />
              &nbsp; Volver
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertProduct;
