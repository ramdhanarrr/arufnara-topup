"use client";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Admin from "@/components/Admin/Admin";
import Hero from "@/components/Hero/Hero";
import Layanan from "@/components/Layanan/Layanan";
import Contact from "@/components/Profil/Profil";
import Testimonial from "@/components/Testimonial/Testimonial";
import Profil from "@/components/Profil/Profil";

function Page() {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="dark:bg-dark dark:text-white">
      <Hero />
      <Profil />
      <Layanan />
      <Testimonial />
    </div>
  );
}

export default Page;
