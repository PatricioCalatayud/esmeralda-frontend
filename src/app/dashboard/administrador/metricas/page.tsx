"use client";
import PieChart from "@/components/PieChart/PieChart";
import { useAuthContext } from "@/context/auth.context";
import { getBestProducts, getDebts, getOrdersByUserMonth, getProductLeastSold, getProductMostSold, getWorstProducts } from "@/helpers/Metrics.helper";
import { useEffect } from "react";



const Metricas = () => {
    const { token } = useAuthContext();
    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrdersByUserMonth(token as string);
        console.log(response);
        const response1 = await  getWorstProducts(token as string);
        console.log(response1);
        const response2 = await  getBestProducts(token as string);
        console.log(response2);
        const response3 = await  getDebts(token as string);
        console.log(response3);
        const response4 = await  getProductLeastSold(token as string);
        console.log(response4);
        const response5 = await  getProductMostSold(token as string);
        console.log(response5);
        }
        fetchData();
    })
    return <div className="flex justify-center"><PieChart /></div>;
};

export default Metricas;