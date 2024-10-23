"use client";
import { useAuthContext } from "@/context/auth.context";
import { putAddress } from "@/helpers/Autenticacion.helper";
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
  const [address, setAddress] = useState<string>(session?.address?.address || "");
  const [locality, setLocality] = useState<string>(session?.address?.localidad || "");
  const [province, setProvince] = useState<number>(session?.address?.province || 0);
  const [editAddress, setEditAddress] = useState<boolean>(false);
  const [editLocality, setEditLocality] = useState<boolean>(false);
  const [editProvince, setEditProvince] = useState<boolean>(false);

  // Función para editar la dirección
  const handleEditAddress = async () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo encontrar el token de autenticación. Por favor, inicia sesión de nuevo.",
      });
      return;
    }

    if (session?.address?.id) {
      const updatedAddress = {
        address,
        localidad: locality,
        province, // Guardar la provincia como número
        deliveryNumber: session.address.deliveryNumber || 0,
      };

      const response = await putAddress(session?.address?.id, updatedAddress, token);

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se ha actualizado tu dirección correctamente",
        });
        setSession({ ...session, address: { ...session.address, address, localidad: locality, province } });
        setEditAddress(false);
        setEditLocality(false);
        setEditProvince(false);
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
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">
                Perfil de {session?.name}
              </h5>
            </div>
          </div>

          <div className="overflow-x-auto flex flex-col p-4 gap-2">
            <h2>Nombre: {session?.name}</h2>
            <h2>Email: {session?.email}</h2>

            {/* Teléfono */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Teléfono: </h2>
              <p>{session?.phone}</p>
            </div>

            {/* Dirección (editable) */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Dirección: </h2>
              {editAddress ? (
                <>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Nueva dirección"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Tooltip content="Guardar">
                    <button
                      type="button"
                      onClick={handleEditAddress}
                      className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <p>{session?.address?.address}</p>
                  <Tooltip content="Editar">
                    <button
                      type="button"
                      onClick={() => setEditAddress(true)}
                      className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </Tooltip>
                </>
              )}
            </div>

            {/* Localidad (editable) */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Localidad: </h2>
              {editLocality ? (
                <>
                  <input
                    type="text"
                    name="locality"
                    id="locality"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Nueva localidad"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                  />
                  <Tooltip content="Guardar">
                    <button
                      type="button"
                      onClick={handleEditAddress}
                      className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <p>{session?.address?.localidad}</p>
                  <Tooltip content="Editar">
                    <button
                      type="button"
                      onClick={() => setEditLocality(true)}
                      className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </Tooltip>
                </>
              )}
            </div>

            {/* Provincia (editable) */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Provincia: </h2>
              {editProvince ? (
                <>
                  <select
                    name="province"
                    id="province"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={province}
                    onChange={(e) => setProvince(Number(e.target.value))}
                  >
                    {Object.keys(provinceMapping).map((key) => (
                      <option key={key} value={key}>
                        {provinceMapping[Number(key)]}
                      </option>
                    ))}
                  </select>
                  <Tooltip content="Guardar">
                    <button
                      type="button"
                      onClick={handleEditAddress}
                      className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  </Tooltip>
                </>
              ) : (
                <>
                  {/* Muestra el nombre de la provincia usando el mapeo */}
                  <p>{provinceMapping[session?.address?.province || 0]}</p>
                  <Tooltip content="Editar">
                    <button
                      type="button"
                      onClick={() => setEditProvince(true)}
                      className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </Tooltip>
                </>
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