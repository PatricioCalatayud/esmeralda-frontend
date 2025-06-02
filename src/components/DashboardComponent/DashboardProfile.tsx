"use client";
import { useAuthContext } from "@/context/auth.context";
import { putAddress, putUser } from "@/helpers/Autenticacion.helper";
import { ISession } from "@/interfaces/ISession";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "flowbite-react";
import { useState } from "react";
import Swal from "sweetalert2";

// Mapeo de provincias (lo puedes extraer desde la vista de registro o mantenerlo aquí)
const provinceMapping: Record<number, string> = {
  1: "Buenos Aires",
  2: "Córdoba",
  3: "Catamarca",
  4: "Chaco",
  5: "Chubut",
  6: "Corrientes",
  7: "Entre Ríos",
  8: "Formosa",
  9: "Jujuy",
  10: "La Pampa",
  11: "La Rioja",
  12: "Mendoza",
  13: "Misiones",
  14: "Neuquén",
  15: "Río Negro",
  16: "Salta",
  17: "San Juan",
  18: "San Luis",
  19: "Santa Cruz",
  20: "Santa Fe",
  21: "Santiago del Estero",
  22: "Tierra del Fuego",
  23: "Tucumán",
  24: "Ciudad Autónoma de Buenos Aires",
};

const DashboardProfile = ({ session }: { session?: ISession }) => {
  const { token } = useAuthContext();
  const { setSession } = useAuthContext();

  // Estados locales para el teléfono, la dirección y la localidad
  const [phone] = useState<string>(session?.phone || "");
  const [address, setAddress] = useState<string>(
    session?.address?.street || ""
  );
  const [number, setNumber] = useState<number>(session?.address?.number || 0);
  const [locality, setLocality] = useState<string>(
    session?.address?.locality || ""
  );
  const [province, setProvince] = useState<string>(
    session?.address?.province || ""
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);


  // Función para editar la dirección
  const handleEditAddress = async () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          "No se pudo encontrar el token de autenticación. Por favor, inicia sesión de nuevo.",
      });
      return;
    }

    if (session?.id) {
      const updatedAddress = {
        street: address,
        locality: locality,
        province: province,
        number: number.toString(),
        zipcode: session.address?.zipcode || ""
      };

      if(updatedAddress.number === "" || updatedAddress.street === "" || updatedAddress.locality === "" || updatedAddress.province === "" ){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Todos los campos son requeridos",
        });
        return;
      }
      const response = await putUser({id: session?.id, address: updatedAddress}, token)

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se ha actualizado tu dirección correctamente",
        });
        setSession({
          ...session,
          address: {
            street: address,
            locality,
            province,
            number: number || 0,
            zipcode: session.address?.zipcode || ""
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Hubo un error al actualizar tu dirección",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo encontrar el ID de la dirección.",
      });
    }
  };

  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden ">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">
                Perfil de {session?.name}
              </h5>
            </div>
          </div>

          <div className="overflow-x-auto flex flex-col p-4 gap-6">
            <h2>Nombre: {session?.name}</h2>
            <h2>Email: {session?.email}</h2>
            <h2>Teléfono: {session?.phone}</h2>
            <div className="relative">
              <div className="flex items-start gap-2">
                <h2 className="text-nowrap">Dirección: </h2>
                <div className="flex-1">
                  <p>
                    {session?.address?.street} {session?.address?.number} -{" "}
                    {session?.address?.locality}
                  </p>
                </div>
                <Tooltip content="Editar">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </Tooltip>
              </div>
              {isEditing && (
                <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex gap-2 w-full">
                    <div className="w-1/2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="Nueva dirección"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Número
                      </label>
                      <input
                        type="number"
                        name="number"
                        id="number"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="Número"
                        value={number}
                        onChange={(e) => setNumber(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="locality"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Localidad
                    </label>
                    <input
                      type="text"
                      name="locality"
                      id="locality"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      placeholder="Nueva localidad"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Provincia
                    </label>
                    <select
                      name="province"
                      id="province"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      value={province}
                      onChange={(e) => {
                        setProvince(e.target.value);
                      }}
                    >
                      {Object.entries(provinceMapping).map(([key, value]) => (
                        <option key={key} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2 px-4 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleEditAddress();
                        setIsEditing(false);
                      }}
                      className="py-2 px-4 text-sm text-white font-medium bg-teal-600 rounded-lg hover:bg-teal-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex overflow-x-auto sm:justify-center py-5 border-t-2 border" />
        </div>
      </div>
    </section>
  );
};

export default DashboardProfile;
