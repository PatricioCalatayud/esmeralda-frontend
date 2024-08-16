"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { getCategories } from '@/helpers/Categories.helper';

import { Category, IProductErrorUpdate, IProductUpdate } from "@/interfaces/IProductList";
import { productUpdateValidation } from "@/utils/productUpdateValidation";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

const ProductEdit = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  //const [token, setToken] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[] | undefined>([]);

  const [dataProduct, setDataProduct] = useState<IProductUpdate>({

    description: "",
    //imgUrl: "",
    price: "",
    stock: "",
    discount: "",
    presentacion: "",
    tipoGrano: "",
    medida: "",
    categoryID: "",
    /*category: {
      id: "",
      name: "",
    },*/
  });

  const [errors, setErrors] = useState<IProductErrorUpdate>({

    description: "",
    //imgUrl: "",
    price: "",
    stock: "",
    discount: "",
    presentacion: "",
    tipoGrano: "",
    medida: "",
    categoryID: "",
    /*
    category: {
      id: "",
      name: "",
    },*/
  });

  //! Obtener producto por ID
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await fetch(`${apiURL}/products/${params.id}`).then(
        (res) => res.json()
      );
      // Desestructurar solo los campos que deseas actualizar
      const {
        article_id,
        description,
        price,
        stock,
        tipoGrano,
        medida,
        presentacion,
        imgUrl,
        discount,
        category = {
          id: "",
          name: "",
        },
      } = productData;
      // Establecer solo los campos especificados en dataProduct
      setDataProduct((prevState) => ({
        ...prevState,
        article_id,
        description,
        price,
        stock,
        imgUrl,
        discount,
        tipoGrano,
        medida,
        presentacion,
        category: {
          id: category.id,
          name: category.name,
        },
      }));
    };
    fetchProduct();
  }, [params.id]);

  //! Obtener categorias  -----OK
  useEffect(() => {
    const fetchCategories = async () => {
      //const categories = await getCategories();
      setCategories(categories);
    };
    fetchCategories();
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
        //imgUrl: imageUrl,
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

    try {
      const formData = new FormData();
      //formData.append("article_id", dataProduct.article_id);
      formData.append("description", dataProduct.description);
      formData.append("price", dataProduct.price.toString());
      formData.append("stock", dataProduct.stock.toString());
      formData.append("discount", dataProduct.discount.toString());
      //formData.append("category", dataProduct.category.id);
      formData.append("presentacion", dataProduct.presentacion);
      formData.append("tipoGrano", dataProduct.tipoGrano);
      formData.append("medida", dataProduct.medida);
      if (imageFile) {
        formData.append("file", imageFile);
      }
      console.log("formData", formData);
      const response = await fetch(
        `${apiURL}/products/${params.id}`,
        {
          method: "PUT",

          body: formData,
        }
      );

      

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      console.log("Product updated successfully:", updatedProduct);

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El producto ha sido actualizado con éxito.",
      }).then(() => {
        router.push("../../dashboard/product");
      });
    } catch (error) {
      console.error("Error updating product:", error);

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
    <div className="min-h-screen flex flex-col justify-start items-center p-10 dark:bg-gray-700">
      <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editar producto
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
                name="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={dataProduct.categoryID}
                onChange={handleChange}
              >
                <option value="">--Seleccione--</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {/*errors.category.id && (
                <span className="text-red-500">{errors.category.id}</span>
              )*/}
            </div>

            <div className="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-3">
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
                  htmlFor="tipoGrano"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tipo de grano
                </label>
                <select
                  id="tipoGrano"
                  name="tipoGrano"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                {/* {errors.tipoGrano && (
                  <span className="text-red-500">{errors.tipoGrano}</span>
                )} */}
                </div>

                <div>
                  <label
                    htmlFor="medida"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Medida
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
                  {/* {errors.medida && (
                    <span className="text-red-500">{errors.medida}</span>
                  )} */}
                  </div>

             
              

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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                htmlFor="stock"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Stock
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="0.00"
                value={dataProduct.stock}
                onChange={handleChange}
              />
              {errors.stock && (
                <span className="text-red-500">{errors.stock}</span>
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
                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="12"
                value={dataProduct.discount}
                onChange={handleChange}
              />
              {errors.discount && (
                <span className="text-red-500">{errors.discount}</span>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="imgUrl"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Imagen
            </label>
            <input
              type="file"
              name="imgUrl"
              id="imgUrl"
              accept="image/*"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={handleImageChange}
            />
            {/*dataProduct.imgUrl && (
              <Image
                width={500}
                height={500}
                src={dataProduct.imgUrl}
                alt="Product Image"
                className="mt-2 rounded-md"
                style={{ maxHeight: "150px", objectFit: "contain" }}
              />
            )*/}
            {/* {errors.imgUrl && (
              <span className="text-red-500">{errors.imgUrl}</span>
            )} */}
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <button
              type="submit"
              className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Actualizar producto
            </button>
            <Link
              href="../../dashboard/product"
              className="w-full text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 border border-gray-300 rounded-lg text-sm px-5 py-2.5 text-center"
            >
              
             Volver
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
