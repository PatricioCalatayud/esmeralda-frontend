"use client";
import { useEffect, useState } from "react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent"
import { Spinner } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { getUsers, putUser } from "@/helpers/Autenticacion.helper";
import { useAuthContext } from "@/context/auth.context";

import { ISession } from "@/interfaces/ISession";
import { Modal, Tooltip } from "flowbite-react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const Users = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<ISession[] | undefined>([]);
    const {token, session} = useAuthContext();
    const [roleUser, setRoleUser] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const USER_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [limitTransfer, setLimitTransfer] = useState(0);
    useEffect(() => {
        const fetchUsers = async () =>{
            console.log("llegue aca?");
            const limit = USER_PER_PAGE;
            const page = currentPage;
            const response = await getUsers(token);
            console.log(response);
            setUsers(response);
            if (response) setTotalPages(Math.ceil(response.length / USER_PER_PAGE));
            
        }
        fetchUsers()
        setLoading(false);
    }, [roleUser,token]);
    const onPageChange = (page: number) => setCurrentPage(page);

    const getCurrentPageUsers = () => {
        const filteredUsers = filterUsers();
        const startIndex = (currentPage - 1) * USER_PER_PAGE;
        const endIndex = startIndex + USER_PER_PAGE;
        return filteredUsers?.slice(startIndex, endIndex);
      };

      //! Función para filtrar los productos
  const filterUsers = () => {
    if (searchTerm === "") {
      return users; // Si el campo de búsqueda está vacío, mostrar todos los productos
    } else {
      return users?.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value); // Actualizar el estado del término de búsqueda
        setCurrentPage(1); // Reiniciar la página actual al cambiar el término de búsqueda
      };
      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
        if(e.target.value === "Cliente"){
          setShowModal(true);
        }else {
        const newRole = e.target.value;
        
        try {
            const user = {
                role: newRole
            }
          const response = await putUser(id,user, token as string);

         if (response?.status === 200 || response?.status === 201) {
          setRoleUser(newRole)
          Swal.fire("¡Éxito!", "El estado del usuario ha sido actualizado.", "success");

         } else {
          Swal.fire("¡Error!", "No se pudo actualizar el estado del usuario.", "error");
         }
          
        } catch (error) {
          console.error("Error updating order:", error);
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
        }}
      };
      const handleCheck = async (role: string, id: string) => {
        if(role === "Cliente"){
          setShowModal(true);
        
        const newRole = role;
        
        try {
            const user = {
                role: newRole,
                accountLimit: limitTransfer
            }
            if (limitTransfer === 0) {
              Swal.fire({
                title: "¿Este cliente tendra limite de cuenta corriente de $0?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Esta bien",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const response = await putUser(id,user, token as string);
                  if (response && (response?.status === 200 || response?.status === 201)) {
                    Swal.fire("¡Correcto!", "El estado del usuario ha sido actualizado.", "success");
                    setShowModal(false);
                  } else {
                    console.error("Error updating order:", response);
                    Swal.fire("¡Error!", "No se pudo actualizar el estado del usuario.", "error");
                  }
                } else if (result.isDenied) {
                  Swal.fire("No se realizaron cambios", "", "info");
                }
              })
            } else {
              
            
          
              const response = await putUser(id,user, token as string);
         if (response?.status === 200 || response?.status === 201) {
          setRoleUser(newRole)
          Swal.fire("¡Éxito!", "El estado del usuario ha sido actualizado.", "success");
          setShowModal(false);
         } else {
          Swal.fire("¡Error!", "No se pudo actualizar el estado del usuario.", "error");
         }
        }
        } catch (error) {
          console.error("Error updating order:", error);
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
        }}
      };
console.log(limitTransfer);
    return (
        loading ? <div className="flex items-center justify-center h-screen">
    <Spinner
      color="teal"
      className="h-12 w-12"
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    />
  </div> :
        <DashboardComponent 
        setCurrentPage={onPageChange}
        titleDashboard="Listado de Usuarios"
      searchBar="Buscar Usuario"
      handleSearchChange={handleSearchChange}
      totalPages={totalPages}

      tdTable={[
        "Nombre",
        "Telefono",
        "Email",
        "Tipo",
        "Acciones",
      ]}
      noContent="No hay Usuarios disponibles"

        >
            {getCurrentPageUsers() ?.map((user: ISession, index) => (
                <tr
                    key={index}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        <div className="flex items-center w-full justify-center gap-10">
                            {user.name}
                            {user.role === "Cliente" && <Tooltip content="Panel Cliente">
                <Link
                  href={`/dashboard/administrador/users/${user.id}`}
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  className="py-2 px-3 flex items-center text-sm hover:text-white font-medium text-center text-teal-600 border-teal-600 border rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </Tooltip>}
                        </div>
                    </th>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        <div className="flex justify-center items-center">
                            {user.phone}
                        </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        <div className="flex justify-center items-center">
                            {user.email}
                        </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        <div className="flex justify-center items-center">
                            {user.role}
                        </div>
                    </td>
                    {user.role !== "Administrador" && <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        <div className="flex justify-center items-center">
                        <select
                id="status"
                name="status"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => handleChange(e, user.id)}
              >
                <option value="">--Seleccione--</option>
                <option value={"Cliente"}>Cliente</option>
                <option value={"Usuario"}>Usuario</option>
              </select>
                        </div>
                        <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              className="px-80 py-40 custom-modal-container"
            >
              <Modal.Header>Agregar Limite de cuenta corriente</Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
              <div className="w-full h-20 gap-4 flex flex-col">
                  <label
                    htmlFor="limtTransfer"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Limite de cuenta corriente
                  </label>
                  <div className="w-full flex gap-2 items-center justify-center">
                  <span>$</span> <input
                    type="text"
                    name="limtTransfer"
                    id="limtTransfer"
                    className="bg-gray-50 border border-gray-300 text-gray-900 disabled:bg-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                    placeholder="1000"
                    onChange={(e) => setLimitTransfer(Number(e.target.value))}

                  />
                  </div>
                </div>

              </Modal.Body>
              <Modal.Footer>

              <button
                  onClick={() =>handleCheck("Cliente",user.id)}
                  type="button"
                  className={`text-sm px-4 py-2.5 my-0.5 w-full font-semibold tracking-wide rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 bg-teal-600 text-white  hover:bg-teal-800`}
                  disabled={
                    !session ||
                    (limitTransfer === null && limitTransfer === undefined)
                  }
                  
                >
                  Agregar limite
                </button>
              </Modal.Footer>
              </Modal>
                    </td>}

                </tr>))}
        </DashboardComponent>
    )
}

export default Users