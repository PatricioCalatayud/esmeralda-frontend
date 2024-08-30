"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import Swal from "sweetalert2";
import { Category, IProductErrorResponse, IProductResponse, IProductUpdate, ISubProductUpdate } from "@/interfaces/IProductList";

import { productAddValidation } from "@/utils/productAddValidation";
import {validateSubproduct} from "@/utils/subproductsUpdateValidation"
import { useAuthContext } from "@/context/auth.context";
import { postProducts } from "../../../../helpers/ProductsServices.helper";
import { Spinner } from "@material-tailwind/react";
import { useCategoryContext } from "@/context/categories.context";
import DashboardAddModifyComponent from "@/components/DashboardComponent/DashboardAdd&ModifyComponent";
import { Tooltip } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const InsertProduct = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {token} = useAuthContext();
  const {categories, categoriesLoading} = useCategoryContext();
  const [subproducts, setSubproducts] = useState<ISubProductUpdate[]>([
    {  amount: "", 
      unit: "", 
      price:"", 
      stock:"", 
      discount:"" }
  ]);

  //! Estado para almacenar los datos del producto
  const [dataProduct, setDataProduct] = useState<IProductUpdate>({
    description: "",
    categoryID: "",
    presentacion: "",
    tipoGrano: "",

  });

  //! Estado para almacenar los errores
  const [errors, setErrors] = useState<IProductErrorResponse>({
    description: "",
    categoryID: "",
    presentacion: "",
    tipoGrano: "",
    imgUrl : "",
  });

  const [errorsSubproducts, setErrorsSubproducts] = useState<{amount: string; unit: string; stock: string; price: string; discount: string }[]>([
    { amount: "", unit: "", stock: "", price: "", discount: "" }
  ]);
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
formData.append("averageRating", "0"); // o puedes utilizar `0` directamente si el backend lo soporta
formData.append("presentacion", dataProduct.presentacion || "");
formData.append("tipoGrano", dataProduct.tipoGrano || "");
formData.append("categoryID", dataProduct.categoryID);

// Añadir la imagen al FormData si existe
if (imageFile) {
  formData.append("file", imageFile);} // Asegúrate de que el campo 'file' coincide con lo que espera el backend


// Añadir cada subproduct al FormData
subproducts.forEach((subproduct, index) => {

    formData.append(`subproducts[${index}][amount]`, subproduct.amount);
    formData.append(`subproducts[${index}][unit]`, subproduct.unit);
    formData.append(`subproducts[${index}][stock]`, subproduct.stock);
    formData.append(`subproducts[${index}][price]`, subproduct.price);
    formData.append(`subproducts[${index}][discount]`, subproduct.discount);
    // Añadir más campos según sea necesario
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

      const response = await postProducts(formData, token);

      if (response && ( response.status === 201 || response.status === 200)) {
        Swal.fire({
          icon: "success",
          title: "¡Agregado!",
          text: "El producto ha sido agregado con éxito.",
        }).then(() => {
          router.push("../../dashboard/administrador/product");
        });
      
      // Mostrar alerta de éxito
      
    } else {
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al agregar el producto.",
      });
    }
  };
  const handleAddSubproduct = () => {
    setSubproducts([...subproducts, {  amount: "", unit: "", price:"", stock:"", discount:"" }]);
  };

  const handleSubproductChange = (index: number, e:  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Crear un nuevo array con los subproductos actualizados
    const updatedSubproducts = subproducts.map((subproduct, idx) =>
      idx === index ? { ...subproduct, [name]: value } : subproduct
    );

    setSubproducts(updatedSubproducts);

  };

  //!Validar formulario
  useEffect(() => {
    // Validar los datos del producto
    const validationErrors = productAddValidation(dataProduct);

    // Validar cada subproducto
    const validationResults = subproducts.map((subproduct) => (
        validateSubproduct(subproduct) // Debe devolver un objeto de errores si hay errores
    ));
    console.log(validationResults);
    // Filtrar subproductos inválidos
    const invalidSubproducts = validationResults.filter(result => Object.keys(result).length > 0);

    if (invalidSubproducts.length > 0) {
        console.log("Subproductos inválidos:", invalidSubproducts);
    } else {
        console.log("Todos los subproductos son válidos.");
    }

    // Actualizar los errores de subproductos en el estado
    setErrorsSubproducts(validationResults);

    // Actualizar los errores del producto en el estado
    setErrors(validationErrors);
}, [dataProduct, subproducts]);
console.log("Errores de producto:", errors);
console.log("Errores de subproductos:", errorsSubproducts);
//console.log(errorsSubproducts[0].errors.discount);


const areAllFieldsEmpty = (errorsSubproducts: Array<{ [key: string]: string }>): boolean => {
  return errorsSubproducts.every(subproduct => {
    return Object.values(subproduct).every(value => value === "");
  });
};


const allFieldsEmpty = areAllFieldsEmpty(errorsSubproducts);

  return (
    categoriesLoading ? <div className="flex items-center justify-center h-screen">
    <Spinner
      color="teal"
      className="h-12 w-12"
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  </div> :
  <DashboardAddModifyComponent
  disabled={ ((errors.description === "" && errors.categoryID === "" && errors.imgUrl === "" && errors.presentacion === "" && errors.tipoGrano === "") && allFieldsEmpty) ? false : true}
  titleDashboard="Agregar un nuevo producto"
backLink = "/dashboard/administrador/product"
buttonSubmitText = "Agregar producto"
handleSubmit = {handleSubmit}
>
<div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div className="col-span-full">
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
            
            
            <div className="mb-4 col-span-full">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Imagen del producto
            </span>
            <div className="flex justify-center items-center w-full ">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col justify-center items-center w-full h-18 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col justify-center items-center pt-5 pb-6 ">
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
            {errors.imgUrl && (
                  <span className="text-red-500">{errors.imgUrl}</span>
                )}
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
          <hr  className="col-span-full "/>

 {/* Subproductos */}
         { subproducts.map((product, index) => (
           
        
            <div className="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-3" key={index}>

            <div>
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  
                  Cantidad por unidad
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="0.00"

                  onChange={(e) => handleSubproductChange(index, e)}
                />
                {Array.isArray(errorsSubproducts) && 
                  errorsSubproducts[index]?.amount && (
                    <span className="text-red-500">{errorsSubproducts[index].amount}</span>
                )}
              </div>
            <div>
                <label
                  htmlFor="unit"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Unidad de medida
                </label>
                <select
                  id="unit"
                  name="unit"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"

                  onChange={(e) => handleSubproductChange(index, e)}
                >
                  <option value="">--Seleccione--</option>
                  <option value="Kilo">Kilo</option>
                  <option value="Unidades">Unidades</option>
                  <option value="Sobre">Sobres</option>
                  <option value="Caja">Caja</option>
                  <option value="Gramos">Gramos</option>

                                  </select>
              {Array.isArray(errorsSubproducts) && 
                  errorsSubproducts[index]?.unit&& (
                    <span className="text-red-500">{errorsSubproducts[index].unit}</span>
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

                  onChange={(e) => handleSubproductChange(index, e)}
                />
                {Array.isArray(errorsSubproducts) && 
                  errorsSubproducts[index]?.stock && (
                    <span className="text-red-500">{errorsSubproducts[index].stock}</span>
                )}
              </div>
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

                  onChange={(e) => handleSubproductChange(index, e)}
                />
                {Array.isArray(errorsSubproducts) && 
                  errorsSubproducts[index]?.price && (
                    <span className="text-red-500">{errorsSubproducts[index].price}</span>
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

                  onChange={(e) => handleSubproductChange(index, e)}
                />
                {Array.isArray(errorsSubproducts) && 
                  errorsSubproducts[index]?.discount && (
                    <span className="text-red-500">{errorsSubproducts[index].discount}</span>
                )}
              </div>
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio Final</p>
                <p className="h-10 flex items-center">  $ {(Number(product.price) - (Number(product.price) * Number(product.discount) / 100)).toFixed(2)}</p>
              </div>
              <hr  className="col-span-full "/>
            </div>
            
))}
 {/* Botón para añadir más subproductos */}
            
            <div className="h-40 col-span-full flex items-center justify-center">
            <Tooltip content="Agregar Subproducto" >
                  <button
                    type="button"
                    onClick={handleAddSubproduct}
                    className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ width: "24px", height: "24px" }}/>
                  </button>
                </Tooltip>
            </div>
          </div>

          
  </DashboardAddModifyComponent>
    
  );
};

export default InsertProduct;
