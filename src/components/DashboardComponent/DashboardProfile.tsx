import { ISession } from "@/interfaces/ISession";



const DashboardProfile = ({ session }: { session?: ISession }) => {

    return (<section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
        <div className="mx-auto max-w-screen-2xl px-1 lg:px-2 ">
          <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
              <div className="flex-1 flex items-center space-x-2">
                <h5 className="text-gray-700 font-bold text-center w-full">Perfil de {session?.name}
                </h5>
              </div>
              <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3"></div>
            </div>
            <div className="overflow-x-auto flex flex-col p-4 gap-2">
                  <h2>Name : {session?.name}</h2>
                  <h2>Email : {session?.email}</h2>
                  <h2>Phone : {session?.phone}</h2>
            </div>
            <div className="flex overflow-x-auto sm:justify-center py-5 border-t-2 border "/>
  
          </div>
        </div>
      </section>

    );

}

export default DashboardProfile

