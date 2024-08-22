"use client";
import { useEffect, useState } from "react";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent"
import { Spinner } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { getUsers } from "@/helpers/Autenticacion.helper";
import { useAuthContext } from "@/context/auth.context";
import { IUserProps } from "@/interfaces/IUser";
import { format } from "date-fns";
import { es } from "date-fns/locale";
const Users = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<IUserProps[] | undefined>([]);
    const {token} = useAuthContext();
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
        "Fecha",
        "Precio",
        "Fecha de entrega",
        "Total",
        "Estado",
      ]}
      noContent="No hay Usuarios disponibles"
        >
            {users?.map((user: IUserProps, index) => (
                <tr
                    key={index}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        <div className="flex items-center">
                            {user.name}
                        </div>
                    </th>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                        <div className="flex justify-center items-center">
                        
                        </div>
                    </td>
                </tr>))}
        </DashboardComponent>
    )
}

export default Users