"use client";

import { useAuthContext } from "@/context/auth.context";
import {
  getDebts,
  getSales,
  getProductsSold,
} from "@/helpers/Metrics.helper";
import { Tabs } from "flowbite-react";
import {
  HiCalendar,
  HiCash,
  HiClipboardList,
  HiMinus,
  HiOutlineChartPie,
  HiPlus,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { getUsers } from "@/helpers/Autenticacion.helper";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Metricas = () => {
  const { token } = useAuthContext();

  const [debts, setDebts] = useState<any>();
  const [productsSold, setProductsSold] = useState<any>();
  const [productId, setProductId] = useState<any>();
  const [date, setDate] = useState<any>();
  const [deliveryId, setDeliveryId] = useState<any>();
  const [sales, setSales] = useState<any>();
  //const [productsByMonthBonus, setProductsByMonthBonus] = useState<any>();
  //const [productsByMonthBonusAmount, setProductsByMonthBonusAmount] = useState<any>();
  const [productsDistribution, setProductsDistribution] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [startDate, setStartDate] = useState<any>();
  const [filter, setFilter] = useState<any>();
  const MOST_SOLD = "mas-vendido";
  const LEAST_SOLD = "menos-vendido";
  const BEST_RATED = "mejor-puntaje";
  const WORST_RATED = "peor-puntaje";
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        const response3 = await getDebts(token);
        setDebts(response3);
        console.log(response3);
      }
    };
    fetchData();
  }, [token]);

  const handleSeachProducts = async () => {
    const response8 = await getProductsSold(
      token,
      startDate,
      endDate,
      10,
      1,
      filter
    );
    setProductsSold(response8);
    console.log(response8);
  };
  const handleSales= async () => {
    const response9 = await getSales(token,startDate,endDate);
    setSales(response9);
    console.log(response9);
  };

  return (
    <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden ">
          <Tabs aria-label="Tabs with underline" variant="underline">
            <Tabs.Item active title="Productos" icon={HiOutlineChartPie}>
              <div className="flex justify-center flex-col p-4 gap-4">
                <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Desde el dia
                    </label>
                    <input
                      type="date"
                      placeholder="Fecha"
                      name="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={(e) => setStartDate(e.target.value)}
                    ></input>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Hasta el dia
                    </label>
                    <input
                      type="date"
                      placeholder="Fecha"
                      name="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={(e) => setEndDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    ></input>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-1/2 sm:w-auto disabled:bg-gray-500 disabled:hover:none disabled:cursor-default justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={handleSeachProducts}
                >
                  Buscar productos
                </button>
                <hr />
                {productsSold && productsSold.products.length > 0 ? (
                  <>
                  <div className="flex justify-end">
                    <select
                      name="filter"
                      id="filter"
                      onChange={(e) => {setFilter(e.target.value); handleSeachProducts()}}
                      className="bg-gray-50 border text-sm rounded-lg block w-1/2 p-2.5 shadow-sm"

                    >
                      <option value={""}>Filtros</option>
                      <option value={MOST_SOLD}>Más vendido</option>
                      <option value={LEAST_SOLD}>Menos vendido</option>
                      <option value={BEST_RATED}>Mejor puntaje</option>
                      <option value={WORST_RATED}>Peor puntaje</option>
                    </select>
                    </div>
                    <table className="w-full text-sm text-center dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 border-2 dark:text-gray-400 ">
                        <th className="py-4 px-4">ID</th>
                        <th className="py-4">Nombre del producto</th>
                        <th className="py-4">Total vendidos</th>
                        <th className="py-4">Total ganancias</th>
                        <th className="py-4">Rating</th>
                      </thead>

                      <tbody>
                        {productsSold.products.map(
                          (product: any, index: number) => (
                            console.log(product),
                            (
                              <tr
                                key={index}
                                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <th>{product?.productId}</th>
                                <th className="py-4">{product?.description}</th>
                                <th className="text-teal-800 py-4">
                                  {product?.totalSales}
                                </th>
                                <th className="text-teal-800 py-4">
                                  {product?.totalRevenue}
                                </th>
                                <th className="text-teal-800 py-4">
                                  {product?.totalRevenue}
                                </th>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p className="flex justify-center my-20">
                    No hay productos vendidos
                  </p>
                )}
              </div>
            </Tabs.Item>
            <Tabs.Item title="Deudores" icon={HiCash}>
              {debts && debts.clients.length > 0 ? 
              <table className="w-full text-sm text-center dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 border-2 dark:text-gray-400 ">
                      <th className="py-4 px-4">ID</th>
                        <th className="py-4">Nombre del cliente</th>
                        <th className="py-4">Email</th>
                        <th className="py-4">Contacto</th>
                        <th className="py-4">Balance</th>
                      </thead>

                      <tbody>
                        {debts?.clients.map((debt: any, index: number) => (
                            console.log(debt),
                            (
                              <tr
                                key={index}
                                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <th className="py-4 px-4">{debt?.id}</th>
                                <th className="py-4">{debt?.name}</th>
                                <th className=" py-4">
                                  {debt?.email}
                                </th>
                                <th className="text-teal-800 py-4">
                                <FontAwesomeIcon icon={faWhatsapp} style={{width: "26px", height: "26px"}} onClick={() => window.open(`https://wa.me/${debt?.phone}`)} className="cursor-pointer"/>
                                </th>
                                <th className={`${debt?.balance < 0 ? "text-red-800" : "text-teal-800"} py-4`}>
                                  {debt?.balance}
                                </th>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>
              : (
                <p className="flex justify-center my-20">No hay deudores</p>
              )}
            </Tabs.Item>
            <Tabs.Item title="Ventas" icon={HiCash}>
            <div className="flex justify-center flex-col p-4 gap-4">
            <div className="flex w-full gap-4">
                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Desde el dia
                    </label>
                    <input
                      type="date"
                      placeholder="Fecha"
                      name="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={(e) => setStartDate(e.target.value)}
                    ></input>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Hasta el dia
                    </label>
                    <input
                      type="date"
                      placeholder="Fecha"
                      name="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={(e) => setEndDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    ></input>
                  </div>
                </div>
              <button
                type="submit"
                className=" w-full sm:w-auto disabled:bg-gray-500 disabled:hover:none disabled:cursor-default justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleSales}
              >
                Buscar ventas
              </button>
              </div>
            
              <hr />
              {sales ? (
                <div className="flex justify-between w-full px-8 py-4 items-center">
                  <div className="flex flex-col gap-2">
                    <p>{sales.importeGenerado}</p>
                  </div>
                  <p></p>
                  <p></p>
                </div>
              ) : (
                <p className="flex justify-center my-20">
                  No hay pedidos de este mes
                </p>
              )}
            </Tabs.Item>
          </Tabs>
          <hr className="mt-4" />
        </div>
      </div>
    </section>
  );
};

export default Metricas;
