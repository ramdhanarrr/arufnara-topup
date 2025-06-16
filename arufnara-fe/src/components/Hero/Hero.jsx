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
      <div className="h-[520px] flex bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-800/70 backdrop-blur-lg border-b border-white/20  shadow-lg dark:text-white duration-300">
        <div className="container grid grid-cols-1 place-items-center">
          {/* text content section */}
          <div className="space-y-5 text-center text-bold py-14">
            <p
              data-aos="fade-up"
              className="text-3xl font-semibold text-white uppercase dark:text-secondary"
            >
              Beli Diamond Sekarang!
            </p>
            <h1
              data-aos="fade-up"
              data-aos-delay="600"
              className="text-4xl font-bold text-white md:text-6xl"
            >
              +62 812 3456 7890
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay="1000"
              className="tracking-[8px] text-base text-white sm:text-xl font-semibold"
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
