import React from "react";
import heroML from "../../assets/hero-ml.png";
import bgHero from "../../assets/bg-hero.jpg";
import Image from "next/image";

const bgStyle = {
  backgroundImage: `url(${bgHero.src})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "520px",
  width: "100%",
};

const Hero = () => {
  return (
    <div style={bgStyle}>
      <div className="dark:bg-black/70 bg-white/50 backdrop-blur-sm dark:text-white duration-300 h-[520px] flex">
        <div className="container grid grid-cols-1 place-items-center">
          {/* text content section */}
          <div className="text-center text-bold space-y-5 py-14">
            <p
              data-aos="fade-up"
              className="text-primary dark:text-secondary text-3xl font-semibold uppercase"
            >
              Beli Diamond Sekarang!
            </p>
            <h1
              data-aos="fade-up"
              data-aos-delay="600"
              className="text-4xl md:text-6xl font-bold"
            >
              +892-170857
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="1000"
              className="tracking-[8px] text-base sm:text-xl font-semibold"
            >
              www.arufnara.com
            </p>
          </div>

          {/* Image Section */}
          <div data-aos="zoom-in-right" data-aos-delay="1000">
            <Image
              src={heroML}
              alt="Hero ML"
              className="max-h-[500px] max-w-[500px] sm:scale-100 translate-y-10 sm:translate-y-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
