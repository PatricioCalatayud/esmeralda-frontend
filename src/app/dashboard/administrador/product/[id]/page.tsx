"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Category, IProductErrorResponse, IProductErrorUpdate, IProductUpdate } from "@/interfaces/IProductList";
import { productUpdateValidation } from "@/utils/productUpdateValidation";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { useCategoryContext } from "@/context/categories.context";
import { getProductById, putProducts } from "@/helpers/ProductsServices.helper";
import { useAuthContext } from "@/context/auth.context";
import DashboardAddModifyComponent from "@/components/DashboardComponent/DashboardAdd&ModifyComponent";
import { useRouter } from "next/navigation";


const ProductEdit = ({ params }: { params: { id: string } }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {categories} = useCategoryContext();
  const {token} = useAuthContext();
  const router = useRouter();
  const [dataProduct, setDataProduct] = useState<IProductUpdate>({
    description: "",
    presentacion: "",
    tipoGrano: "",
    categoryID: "",
    imgUrl:"",
    
  });
  console.log(dataProduct);

  const [errors, setErrors] = useState<IProductErrorResponse>({

    description: "",
    presentacion: "",
    tipoGrano: "",
    file: undefined,
    categoryID: "",
    imgUrl:"",
  });

  //! Obtener producto por ID
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProductById(params.id, token);
      console.log(productData);
      if (productData && (productData.status === 200 || productData.status === 201)) {

      
      // Desestructurar solo los campos que deseas actualizar
      const {
        description,
        // revisar con el backend
        tipoGrano,
        presentacion,
        imgUrl,
        category = {
          id: "",
          name: "",
        },
      } = productData.data;
      // Establecer solo los campos especificados en dataProduct
      setDataProduct((prevState) => ({
        ...prevState,
        description,
        imgUrl,
        tipoGrano,
        presentacion,
    categoryID: category.id,

      }));
    };
  }
  fetchProduct();

  }, []);



  //! Actualizar campos del producto
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    e.preventDefault();
    setDataProduct({
      ...dataProduct,
      [e.target.name]: e.target.value,
    });
  };

  //! Actualizar imagen del producto
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setDataProduct({
        ...dataProduct,
      });
    }
  };

  //! Actualizar producto
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!token) return;

    // Mostrar alerta de carga mientras se procesa la solicitud
    Swal.fire({
      title: "Actualizando producto...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });


      const formData = new FormData();

      formData.append("description", dataProduct.description);
      formData.append("category", dataProduct.categoryID);
      formData.append("presentacion", dataProduct.presentacion);
      formData.append("tipoGrano", dataProduct.tipoGrano);

      if (imageFile) {
        formData.append("file", imageFile);
      }

      const response = await putProducts( formData,params.id,token);

      

      if (response && (response.status === 200 || response.status === 201)) {

      const updatedProduct = await response;
      console.log("Product updated successfully:", updatedProduct);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El producto ha sido actualizado con éxito.",
      }).then(() => {
        router.push("/dashboard/administrador/product");
      });
    }else {
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al actualizar el producto.",
      });
    }
  
  };
  //!Validar formulario
  useEffect(() => {
    const errors = productUpdateValidation(dataProduct);
    setErrors(errors);
  }, [dataProduct]);

  if (!dataProduct) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardAddModifyComponent
    titleDashboard="Editar producto"
  backLink = "/dashboard/administrador/product"
  buttonSubmitText = "Actualizar"
  handleSubmit = {handleSubmit}
  disabled = {(errors.description !== "" && errors.categoryID !== "" && errors.imgUrl !== "" && errors.presentacion !== "" && errors.tipoGrano !== "")}
  >
<div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div className="grid gap-4 sm:col-span-2">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ingresa el nombre del producto"
                defaultValue={dataProduct.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>
            
                <div className="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-3">
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
                {categories?.find(category => category.id === dataProduct.categoryID)?.name || "--Seleccione--"}
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

            
              <div>
                <label
                  htmlFor="presentacion"
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
                <option value={dataProduct.presentacion}>{dataProduct.presentacion || "--Seleccione--"}</option>
                  <option value="Molido">Molido</option>
                  <option value="Grano">Grano</option>
                  <option value="Capsulas">Cápsulas</option>
                </select>
                {errors.presentacion && (
                  <span className="text-red-500">{errors.presentacion}</span>
                )}
              </div>

              <div>
                <label
                  htmlFor="tipoGrano"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tipo de grano
                </label>
                <select
                  id="tipoGrano"
                  name="tipoGrano"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  onChange={handleChange}
                  value={dataProduct.tipoGrano}
                >
                  <option value={dataProduct.tipoGrano}>{dataProduct.tipoGrano || "--Seleccione--"}</option>
                  <option value="Santos">Santos</option>
                  <option value="Colombiano">Colombiano</option>
                  <option value="Torrado">Torrado</option>
                  <option value="Rio de oro">Rio de Oro</option>
                  <option value="Descafeino">Descafeinado</option>
                  <option value="Blend-premium">Blend</option>
                  <option value="Mezcla baja calidad">Mezcla</option>
                </select>
                {errors.tipoGrano && (
                  <span className="text-red-500">{errors.tipoGrano}</span>
                )} 
                </div>
            </div>
          </div>

          <div className="sm:col-span-2">
          {dataProduct.imgUrl && (
              <div className="mt-4 flex justify-center ">
                <Image
                  src={dataProduct.imgUrl}
                  alt="Imagen del producto"
                  width={500} // debes especificar un ancho
                  height={300} // y una altura
                  className="max-w-44 h-auto rounded-xl"
                />
              </div>
            )}
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


          {errors.imgUrl && (
                  <span className="text-red-500">{errors.imgUrl}</span>
                )}
            
            <hr className="col-span-full my-10" />
          </div>
  </DashboardAddModifyComponent>
  );
};

export default ProductEdit;
