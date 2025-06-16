
'use client'

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import EventsBanner from "@/components/EventsBanner";
import Newsletter from "@/components/Newsletter";
import SearchBusForm from "@/components/SearchBusForm";
import ProductSlider from "@/components/ProductSlider";
import AboutSection from "@/components/AboutSection";


export default function Home() {


  return (
    <>
      <HeroBanner />
      <EventsBanner />
      <ProductSlider />
      <AboutSection />
      <SearchBusForm />
      <Newsletter />
    </>
  );
}

