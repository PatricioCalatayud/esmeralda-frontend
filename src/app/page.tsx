"use client";

import HeadlineCards from "@/components/headlineCards/HeadlineCards";
import Hero from "@/components/hero/hero";
import Products from "@/components/Products/Products";
import Banner from "@/components/Banner/Banner";
import ProcesoProductivo from "@/components/ProcesoProductivo/ProcesoProductivo";
import React from "react";
import Testimonials from "../components/Testimonials/Testimonials";

const Home = () => {
  return (
    <div className="h-min-screen">
      <Hero />
      <HeadlineCards />
      <Products />
      <Banner />
      <ProcesoProductivo />
      <Testimonials />
    </div>
  );
};

export default Home;
