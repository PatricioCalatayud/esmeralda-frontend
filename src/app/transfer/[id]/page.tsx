"use client";
import DashboardAddModifyComponent from "@/components/DashboardComponent/DashboardAdd&ModifyComponent";
import { useAuthContext } from "@/context/auth.context";
import { getOrder, putOrderTransaction } from "@/helpers/Order.helper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Swal from "sweetalert2";
const Transfer = ({ params }: { params: { id: string } }) => {
    const [receiptId, setReceiptId] = useState("");
    const router = useRouter();
    const { token } = useAuthContext();
  const [imageFile, setImageFile] = useState<File | null>(null);

  //! Estado para almacenar los datos del producto
  const [dataProduct, setDataProduct] = useState({
    imgUrl: "",
  });

  //! Estado para almacenar los errores
  const [errors, setErrors] = useState({
    imgUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getOrder(params.id, token);
      if (response && response.receipt) {
        setReceiptId(response.receipt.id);
      }
    };
    fetchProduct();
  }, []);

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(imageFile);
    const formData = new FormData();
    // Añadir la imagen al FormData si existe
    formData.append("id", receiptId);

    if (imageFile) {
      formData.append("file", imageFile);
    } 

    //! Mostrar alerta de carga mientras se procesa la solicitud
    Swal.fire({
      title: "Agregando producto...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await putOrderTransaction( formData, token);
    console.log(response);
          if (response && ( response.status === 201 || response.status === 200)) {
            Swal.fire({
              icon: "success",
              title: "¡Agregado!",
              text: "El producto ha sido agregado con éxito.",
            }).then(() => {
              //router.push("../../dashboard/cliente/order");
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
  //!Validar formulario
  useEffect(() => {
    if (!dataProduct.imgUrl) {
      errors.imgUrl = "La imagen es obligatoria";
    } else {
      errors.imgUrl = "";
    }

    // Actualizar los errores del producto en el estado
    setErrors(errors);
  }, []);

  return (
    <div className="p-8">
      <DashboardAddModifyComponent
        disabled={errors.imgUrl === ""}
        titleDashboard="Agregar comprobante de transferencia"
        backLink="/dashboard/cliente/order"
        buttonSubmitText="Enviar comprobante"
        handleSubmit={handleSubmit}
      >
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div className="mb-4 col-span-full">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Comprobante de transferencia
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
                      Click para subir comprobante
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG or JPGE (MAX. 800x400px)
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
            {!dataProduct.imgUrl ? (
              <span className="text-red-500">{errors.imgUrl}</span>
            ) : null}
            {imageFile && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Imagen del producto"
                  width={500} // debes especificar un ancho
                  height={300} // y una altura
                  className="max-w-44 h-auto "
                />
              </div>
            )}
          </div>
        </div>
      </DashboardAddModifyComponent>
    </div>
  );
};
export default Transfer;
