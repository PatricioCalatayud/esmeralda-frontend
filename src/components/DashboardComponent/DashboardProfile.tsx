"use client";
import { useAuthContext } from "@/context/auth.context";
import { putUser } from "@/helpers/Autenticacion.helper";
import { ISession } from "@/interfaces/ISession";
import { faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "flowbite-react";
import { useState } from "react";
import Swal from "sweetalert2";

const DashboardProfile = ({ session }: { session?: ISession }) => {
  const { token } = useAuthContext();
  const {setSession} = useAuthContext();
  const [phone, setPhone] = useState<string>(session?.phone || ""); // Inicializa con el valor de sesión o vacío
  const [edit, setEdit] = useState<boolean>(false);
  const handleEditPhone = async () => {
    const response = await putUser(session?.id as string, { phone: phone }, token);
    console.log(response);
    
    if (response && (response.status === 200 || response.status === 201)) {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Se ha actualizado tu teléfono correctamente",
      });
      setSession(response.data);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al actualizar tu teléfono",
      });
    }
  };

  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">Perfil de {session?.name}</h5>
            </div>
          </div>
          <div className="overflow-x-auto flex flex-col p-4 gap-2">
            <h2>Name: {session?.name}</h2>
            <h2>Email: {session?.email}</h2>
            <div className="flex items-center justify-start gap-2">
              <h2 className="text-nowrap">Phone: </h2>
              {session?.phone} <div className="flex items-center justify-start gap-2">
                {edit && <><input
                  type="text"
                  name="phone"
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="2123456789"
                  value={phone} // Usa el estado local `phone` aquí
                  onChange={(e) => setPhone(e.target.value)} // Actualiza el estado `phone`
                />
                <Tooltip content="Correcto">
                  <button
                    type="button"
                    onClick={handleEditPhone}
                    className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </Tooltip></>}
                <Tooltip content="Editar">
                  <button
                    type="button"
                    onClick={ () => setEdit(!edit)}
                    className="py-3 px-3.5 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </Tooltip>
              </div> 
            </div>
          </div>
          <div className="flex overflow-x-auto sm:justify-center py-5 border-t-2 border" />
        </div>
      </div>
    </section>
  );
};

export default DashboardProfile;
