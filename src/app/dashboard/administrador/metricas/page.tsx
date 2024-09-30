"use client";
import PieChart from "@/components/PieChart/PieChart";
import { useAuthContext } from "@/context/auth.context";
import { getBestProducts, getCsv, getDebts, getOrdersByUserMonth, getProductLeastSold, getProductMostSold, getProductsByMonth, getWorstProducts, uploadCsv } from "@/helpers/Metrics.helper";
import { Tabs } from "flowbite-react";
import {  HiCalendar, HiCash, HiClipboardList, HiMinus, HiOutlineChartPie,  HiPlus } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Button, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";


const Metricas = () => {
    const { token } = useAuthContext();
    const [ordersByUserMonth, setOrdersByUserMonth] = useState<any>();
    const [worstProducts, setWorstProducts] = useState<any>();
    const [bestProducts, setBestProducts] = useState<any>();
    const [debts, setDebts] = useState<any>();
    const [productLeastSold, setProductLeastSold] = useState<any>();
    const [productMostSold, setProductMostSold] = useState<any>();
    const [productsByMonth, setProductsByMonth] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            if (token) {  // Asegúrate de que `token` esté definido antes de hacer la llamada
                const response = await getOrdersByUserMonth(token );
                setOrdersByUserMonth(response);
                console.log(response);
    
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

                const response6 = await getProductsByMonth(token );
                setProductsByMonth(response6);
                console.log(response6);

                

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
        const response9 = await uploadCsv(token, file);
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
        {productsByMonth?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}><p>{product.productId}</p></div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Mejores productos" icon={HiClipboardList}>
      {bestProducts?.map ((product: any, index: number) => (
          <div className="flex justify-center" key={index}><p>{product.description}</p></div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Peores productos" icon={HiClipboardList}>
        {worstProducts?.map ((product: any , index: number) => (
          <div className="flex justify-center" key={index}><p>{product.description}</p></div>
        ))}
      </Tabs.Item>
      <Tabs.Item title="Pedidos de usuarios por mes" icon={HiCalendar}>
      {ordersByUserMonth?.map ((order: any, index: number) => (
        <div className="flex justify-center" key={index}>{order.description}</div>
      ))}
      </Tabs.Item>
      <Tabs.Item title="Deudores" icon={HiCash}>
      {debts?.map ((debt: any, index: number) => (
          <div className="flex justify-center" key={index}>{debt.userName}</div>
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