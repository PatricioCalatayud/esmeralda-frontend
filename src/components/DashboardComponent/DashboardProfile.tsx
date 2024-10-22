"use client";
import { useAuthContext } from "@/context/auth.context";
import { putUser, putAddress } from "@/helpers/Autenticacion.helper"; // putAddress para la llamada PUT de la dirección
import { ISession } from "@/interfaces/ISession";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "flowbite-react";
import { useState } from "react";
import Swal from "sweetalert2";

const DashboardProfile = ({ session }: { session?: ISession }) => {
  const { token } = useAuthContext();
  const { setSession } = useAuthContext();

  // Estados locales para el teléfono y la dirección
  const [phone] = useState<string>(session?.phone || "");
  const [address, setAddress] = useState<string>(session?.address?.address || "");
  const [editAddress, setEditAddress] = useState<boolean>(false);

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

    // Verificamos que el id de la dirección exista antes de hacer la petición PUT
    if (session?.address?.id) {
      // Llamada PUT a la API para actualizar la dirección
      const response = await putAddress(session?.address?.id, { address }, token);

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se ha actualizado tu dirección correctamente",
        });
        // Actualizamos la sesión solo si el id de la dirección es válido
        setSession({ ...session, address: { ...session.address, address } });
        setEditAddress(false);
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
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">
                Perfil de {session?.name}
              </h5>
            </div>
          </div>

          <div className="overflow-x-auto flex flex-col p-4 gap-2">
            <h2>Name: {session?.name}</h2>
            <h2>Email: {session?.email}</h2>

            {/* Teléfono */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Phone: </h2>
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

            {/* Localidad (no editable) */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Localidad: </h2>
              <p>{session?.address?.localidad}</p>
            </div>

            {/* Provincia (no editable) */}
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Provincia: </h2>
              <p>{session?.address?.province}</p>
            </div>
          </div>

          <div className="flex overflow-x-auto sm:justify-center py-5 border-t-2 border" />
        </div>
      </div>
    </section>
  );
};

export default DashboardProfile;