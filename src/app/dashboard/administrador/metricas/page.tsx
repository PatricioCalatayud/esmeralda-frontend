"use client";
import PieChart from "@/components/PieChart/PieChart";
import { useAuthContext } from "@/context/auth.context";
import { getBestProducts, getCsv, getDebts, getOrdersByUserMonth, getProductLeastSold, getProductMostSold, getProductsByMonth, getProductsSold, getWorstProducts, uploadCsv } from "@/helpers/Metrics.helper";
import { Tabs } from "flowbite-react";
import {  HiCalendar, HiCash, HiClipboardList, HiMinus, HiOutlineChartPie,  HiPlus } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Button, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useProductContext } from "@/context/product.context";
import { getUsers } from "@/helpers/Autenticacion.helper";



const Metricas = () => {
    const { token } = useAuthContext();
    const {allProducts} = useProductContext();
    const [ordersByUserMonth, setOrdersByUserMonth] = useState<any>();
    const [worstProducts, setWorstProducts] = useState<any>();
    const [bestProducts, setBestProducts] = useState<any>();
    const [debts, setDebts] = useState<any>();
    const [productLeastSold, setProductLeastSold] = useState<any>();
    const [productMostSold, setProductMostSold] = useState<any>();
    const [productsByMonth, setProductsByMonth] = useState<any>();
    const [productsSold, setProductsSold] = useState<any>();
    const [productId, setProductId] = useState<any>();
    const [date, setDate] = useState<any>();
    const [users, setUsers] = useState<any>();
    const [user, setUser] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            if (token) {  // Asegúrate de que `token` esté definido antes de hacer la llamada
  
    
                const response1 = await getWorstProducts(token );
                setWorstProducts(response1);
                console.log(response1);
    
                const response2 = await getBestProducts(token );
                setBestProducts(response2);
                console.log(response2);
    
                const response3 = await getDebts(token );
                setDebts(response3);
                console.log(response3);
    
                const response4 = await getProductLeastSold(token );
                setProductLeastSold(response4);
                console.log(response4);
    
                const response5 = await getProductMostSold(token );
                setProductMostSold(response5);
                console.log(response5);

                const response6 = await getUsers(token );
                setUsers(response6);  


                const response7 = await getProductsSold(token );
                setProductsSold(response7);
                console.log(response7);

            }
        };
        fetchData();
    }, [token]);
    const handleDownloadCsv = async() => {
        const response8 = await getCsv(token );
        const url = window.URL.createObjectURL(new Blob([response8]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'archivo.csv');
document.body.appendChild(link);
link.click();
link.parentNode?.removeChild(link);

        console.log(response8);
    };
    const handleUploadCsv = async(file: any) => {
      const formData = new FormData();

    formData.append("file", file);
        const response9 = await uploadCsv(token, formData);
        console.log(response9);
    };
    
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const handleSeachProductsByMonth = async() => {
    const response6 = await getProductsByMonth(token, date, productId);
    setProductsByMonth(response6);
    console.log(response6);
  }
  const handleSeachOrdersByMonth = async() => {
    const response7 = await getOrdersByUserMonth(token, date, user);
    setOrdersByUserMonth(response7);
    console.log(response7);
  }
    return (
        <section className="p-1 sm:p-1 antialiased h-screen dark:bg-gray-700">
      <div className="w-full ">
        <div className="bg-white dark:bg-gray-800 relative shadow-2xl sm:rounded-lg overflow-hidden ">
    <Tabs aria-label="Tabs with underline" variant="underline">
      <Tabs.Item active title="Productos vendidos" icon={HiOutlineChartPie}>
        <div className="flex justify-center"><PieChart /></div>
      </Tabs.Item>
      <Tabs.Item title="Productos mas vendidos" icon={HiPlus}>
      {productMostSold?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}>{product.productId}</div>
        ))}
        
      </Tabs.Item>
      <Tabs.Item title="Productos menos vendidos" icon={HiMinus}>
      {productLeastSold?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}><p>{product.productId}</p></div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Productos por mes" icon={HiCalendar}>
        <div className="flex justify-center w-full gap-4 px-4">
        <div className="w-full">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Producto
              </label>
              <select
                name="productID"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">--Seleccione--</option>
                {allProducts?.map((product: any) => (
                  <option key={product.id} value={product.id}>
                    {product.description}
                  </option>
                ))}
              </select>

            </div>
            <div className="w-full">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Fecha
              </label>
              <input
                type="date"
                placeholder="Fecha"
                name="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setDate(e.target.value)}
              >
              </input>

            </div>
        </div>
        <button
              type="submit"
              className="m-4 w-full sm:w-auto disabled:bg-gray-500 disabled:hover:none disabled:cursor-default justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        onClick={handleSeachProductsByMonth}
            >
                Buscar productos en este mes
            </button>
            <hr />
                { productsByMonth && productsByMonth.lengt > 0 ? (productsByMonth?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}><p>{product.productId}</p></div>
        ))): <p className="flex justify-center my-20">No hay productos vendidos este mes</p>}
      </Tabs.Item>
      <Tabs.Item title="Mejores productos" icon={HiClipboardList}>
      {bestProducts?.map ((product: any, index: number) => (
          <>
          <div className="flex justify-between w-full px-8 py-4" key={index}>
           <p> {product.description}</p>
           <p className={`${product.averageRating < 2 ? 'text-red-800' : (product.averageRating < 3.5 && product.averageRating > 2) ? 'text-yellow-800' : 'text-green-800'} font-semibold`}>Puntaje: {product.averageRating.toFixed(2)} / 5</p>
            </div>
            <hr /></>
        ))}
        
      </Tabs.Item>
      <Tabs.Item title="Peores productos" icon={HiClipboardList}>
        {worstProducts?.map ((product: any , index: number) => (
          <>
          <div className="flex justify-between w-full px-8 py-4" key={index}>
           <p> {product.description}</p>
           <p className={`${product.averageRating < 2 ? 'text-red-800' : (product.averageRating < 3.5 && product.averageRating > 2) ? 'text-yellow-800' : 'text-green-800'} font-semibold`}>Puntaje: {product.averageRating.toFixed(2)} / 5</p>
            </div>
            <hr /></>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Pedidos de usuarios por mes" icon={HiCalendar}>
      <div className="flex justify-center w-full gap-4 px-4">
        <div className="w-full">
              <label
                htmlFor="userId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Usuarios
              </label>
              <select
                name="userId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setUser(e.target.value)}
              >
                <option value="">--Seleccione--</option>
                {users?.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

            </div>
            <div className="w-full">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Fecha
              </label>
              <input
                type="date"
                placeholder="Fecha"
                name="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                onChange={(e) => setDate(e.target.value)}
              >
              </input>

            </div>
        </div>
        <button
              type="submit"
              className="m-4 w-full sm:w-auto disabled:bg-gray-500 disabled:hover:none disabled:cursor-default justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        onClick={handleSeachOrdersByMonth}
            >
                Buscar pedidos en este mes
            </button>
            <hr />
      {ordersByUserMonth && ordersByUserMonth.length > 0 ? (ordersByUserMonth?.map ((order: any, index: number) => (
        <div className="flex justify-center" key={index}>{order.description}</div>
      ))): <p className="flex justify-center my-20">No hay pedidos de este mes</p>}
      </Tabs.Item>
      <Tabs.Item title="Deudores" icon={HiCash}>
      {debts?.map ((debt: any, index: number) => (
        <>
          <div className="flex justify-between w-full px-8 py-4" key={index}>
           <p> {debt.userName}</p>
           <p className="text-red-800 font-semibold">Deuda de $ {debt.balance}</p>
            </div>
            <hr /></>
        ))}
      </Tabs.Item>

    </Tabs>
    <hr className="mt-20"/>
    <div className="mt-4 mb-4 mx-4 flex gap-4">
    <button
              type="submit"
              className="w-full sm:w-auto disabled:bg-gray-500 disabled:hover:none disabled:cursor-default justify-center text-white inline-flex bg-teal-800 hover:bg-teal-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        onClick={handleDownloadCsv}
            >
                DESCARGAR ARCHIVO CSV
            </button>

            <Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
  startIcon={<FontAwesomeIcon icon={faUpload} />}
>
  Subir Archivo CSV
  <VisuallyHiddenInput
    type="file"
    onChange={(e) => handleUploadCsv(e.target.files?.[0])}
    multiple
  />
</Button>
            </div>
   </div>
 
   </div></section>
    )
    
};

export default Metricas;