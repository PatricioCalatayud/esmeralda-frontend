
import React from "react";
import { Pagination } from "@mui/material";
import { IoSearchSharp } from "react-icons/io5";
import Link from "next/link";

interface IDashboardInterface {
  titleDashboard: string;
  children: JSX.Element | undefined | JSX.Element[];
  searchBar?: string;
  buttonTopRight?: JSX.Element;
  buttonTopRightLink?: string;
  tdTable: string[];
  noContent: string;
  totalPages: number;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const DashboardComponent = ({
  titleDashboard,
  children,
  searchBar,
  tdTable,
  noContent,
  buttonTopRight,
  buttonTopRightLink,
  totalPages,
  handleSearchChange,
}: IDashboardInterface) => {
  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="mx-auto max-w-screen-2xl px-1 lg:px-2 ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-1 p-4 bg-gray-50 border border-gray-200 rounded-t-lg">
            <div className="flex-1 flex items-center space-x-2">
              <h5 className="text-gray-700 font-bold text-center w-full">
                {titleDashboard}
              </h5>
            </div>
            <div className="flex-shrink-0 flex flex-col items-start md:flex-row md:items-center lg:justify-end space-y-3 md:space-y-0 md:space-x-3"></div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2">
            {searchBar && <form className="flex items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <IoSearchSharp />
            </div>
            <input
              type="text"
              id="simple-search"
              placeholder={searchBar}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={handleSearchChange}
            />
          </div>
        </form>
            }
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            {buttonTopRight && 
            <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link
            type="button"
            id="createProductButton"
            data-modal-toggle="createProductModal"
            className=" gap-2 flex items-center justify-center text-white bg-teal-800 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            href={buttonTopRightLink }
          >
            {buttonTopRight}
          </Link>
        </div>}

            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 border-y-2 dark:text-gray-400">
                <tr>
                  {tdTable && tdTable.length > 0
                    ? tdTable.map((td, index) => (
                        <th key={index} scope="col" className="p-4">
                          {td}
                        </th>
                      ))
                    : null}
                </tr>
              </thead>
              <tbody>
                {children && React.Children.count(children) > 0 ? (
                  children
                ) : (
                  <tr>
                    <td
                      colSpan={tdTable.length}
                      className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {noContent}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex overflow-x-auto sm:justify-center py-5 ">
            <Pagination
              count={totalPages}

            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default DashboardComponent;
