"use client";

import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Category, IProductErrorResponse, IProductUpdate } from "@/interfaces/IProductList";
import { productUpdateValidation } from "@/utils/productUpdateValidation";
import { IoCloudUploadOutline } from "react-icons/io5";
import Image from "next/image";
import { useCategoryContext } from "@/context/categories.context";
import { getProductById, putProductsFormData } from "@/helpers/ProductsServices.helper";
import { useAuthContext } from "@/context/auth.context";
import DashboardAddModifyComponent from "@/components/DashboardComponent/DashboardAdd&ModifyComponent";
import { useRouter } from "next/navigation";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const ProductEdit = ({ params }: { params: { id: string } }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { categories } = useCategoryContext();
  const { token } = useAuthContext();
  const router = useRouter();
  const [dataProduct, setDataProduct] = useState<IProductUpdate>({
    description: "",
    presentation: "",
    tipoGrano: "",
    categoryID: 0,
    imgUrl: "",
  });

  const [errors, setErrors] = useState<IProductErrorResponse>({
    description: "",
    presentation: "",
    tipoGrano: "",
    file: undefined,
    categoryID: "",
    imgUrl: "",
  });

  //! Obtener producto por ID
  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProductById(params.id, token);
      if (productData && (productData.status === 200 || productData.status === 201)) {
        const {
          description,
          tipoGrano,
          presentation,
          imgUrl,
          category = { id: "", name: "" },
        } = productData.data;
        setDataProduct((prevState) => ({
          ...prevState,
          description,
          imgUrl,
          tipoGrano,
          presentation,
          categoryID: category.id,
        }));
      }
    };
    fetchProduct();
  }, [params.id, token]);

  //! Actualizar campos del producto
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      URL.createObjectURL(file);
    }
  };

  //! Actualizar producto
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "Actualizando producto...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const formData = new FormData();
    formData.append("description", dataProduct.description);
    formData.append("category", dataProduct.categoryID.toString());
    if (dataProduct.presentation) {
      formData.append("presentation", dataProduct.presentation);
    }
    if (dataProduct.tipoGrano) {
      formData.append("tipoGrano", dataProduct.tipoGrano);
    }
    if (imageFile) {
      formData.append("file", imageFile);
    }

    const response = await putProductsFormData(formData, params.id, token);

    if (response && (response.status === 200 || response.status === 201)) {
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El producto ha sido actualizado con éxito.",
      }).then(() => router.push("/dashboard/administrador/product"));
    } else {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al actualizar el producto.",
      });
    }
  };

  //! Validar formulario
  useEffect(() => {
    setErrors(productUpdateValidation(dataProduct));
  }, [dataProduct]);

  //! Obtener imagen del producto
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchImageBlob = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/product/${dataProduct.imgUrl}`);
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      throw new Error("Error al cargar la imagen");
    } catch (error) {
      console.error("Error al obtener la imagen:", error);
      return null;
    }
  }, [dataProduct.imgUrl]);

  useEffect(() => {
    const getImage = async () => {
      const img = await fetchImageBlob();
      if (img) setImageUrl(img);
    };
    getImage();
  }, [fetchImageBlob]);

  return (
    <DashboardAddModifyComponent
      titleDashboard="Editar producto"
      backLink="/dashboard/administrador/product"
      buttonSubmitText="Actualizar"
      handleSubmit={handleSubmit}
      disabled={
        errors.description !== "" &&
        errors.categoryID !== "" &&
        errors.imgUrl !== "" &&
        errors.presentation !== "" &&
        errors.tipoGrano !== ""
      }
    >
      <div className="grid gap-4 mb-4 sm:grid-cols-2">
        <div className="grid gap-4 sm:col-span-2">
          <label htmlFor="description">Producto</label>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Ingresa el nombre del producto"
            defaultValue={dataProduct.description}
            onChange={handleChange}
          />
          {errors.description && <span className="text-red-500">{errors.description}</span>}
        </div>
      </div>

      <div className="sm:col-span-2">
        {imageUrl && (
          <div className="mt-4 flex justify-center">
            <Image src={String(imageUrl)} alt="Imagen del producto" width={500} height={300} />
          </div>
        )}
        <div className="mb-4">
          <span>Imagen del producto</span>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} />
        </div>
        {errors.imgUrl && <span className="text-red-500">{errors.imgUrl}</span>}
      </div>
    </DashboardAddModifyComponent>
  );
};

export default ProductEdit;
