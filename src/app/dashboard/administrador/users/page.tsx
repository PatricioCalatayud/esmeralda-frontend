"use client";
import { useEffect, useState } from "react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent"
import { Spinner } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { getUsers, putUser } from "@/helpers/Autenticacion.helper";
import { useAuthContext } from "@/context/auth.context";
import { IUserProps } from "@/interfaces/IUser";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ISession } from "@/interfaces/ISession";
const Users = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<ISession[] | undefined>([]);
    const {token} = useAuthContext();
    const [roleUser, setRoleUser] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const fetchUsers = async () =>{
            console.log("llegue aca?");
            const response = await getUsers(token);
            console.log(response);
            setUsers(response);

        }
        fetchUsers()
        setLoading(false);
    }, []);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value); // Actualizar el estado del término de búsqueda
        setCurrentPage(1); // Reiniciar la página actual al cambiar el término de búsqueda
      };
      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
        const newRole = e.target.value;
        setRoleUser(newRole);
        try {
            const user = {
                role: newRole
            }
          const response = await putUser(id,user, token as string);
          console.log("response", response);
          Swal.fire("¡Éxito!", "El estado de la orden ha sido actualizado.", "success");
        } catch (error) {
          console.error("Error updating order:", error);
          Swal.fire("¡Error!", "No se pudo actualizar el estado de la orden.", "error");
        }
      };
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
            {users?.map((user: ISession, index) => (
                <tr
                    key={index}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        <div className="flex items-center w-full justify-center">
                            {user.name}
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
                    </td>}

                </tr>))}
        </DashboardComponent>
    )
}

export default Users