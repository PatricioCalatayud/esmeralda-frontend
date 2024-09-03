
import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface IDashboardAddModifyInterface {
  titleDashboard: string;
  children: React.ReactNode;
  backLink: string;
  buttonSubmitText: string;
  disabled?: boolean
screen?: string
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
const DashboardAddModifyComponent = ({
  titleDashboard,
  children,
  backLink,
  buttonSubmitText,
  handleSubmit,
  disabled,
  screen
}: IDashboardAddModifyInterface) => {
  return (
<div className={`${screen || "min-h-screen"} flex flex-col justify-start items-center  dark:bg-gray-700`}>
      <div className="relative p-4 bg-white rounded-lg shadow-2xl dark:bg-gray-800 sm:p-5 w-full">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {titleDashboard}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          {children}


          <div className="flex items-center space-x-4 mt-4">
            <button
              type="submit"
              className="w-full sm:w-auto disabled:bg-gray-500 disabled:hover:none disabled:cursor-default justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            disabled={disabled === true}
            >
              {buttonSubmitText}
            </button>
            <Link
              href={backLink}
              className="w-full  justify-center sm:w-auto text-red-500 inline-flex items-center hover:bg-gray-100 bg-white  focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              
              <FaArrowLeft />
              &nbsp; Volver
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default DashboardAddModifyComponent;
