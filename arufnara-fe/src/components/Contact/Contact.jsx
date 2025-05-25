import React from "react";

const Contact = () => {
  return (
    <div className="bg-secondary text-black sm:min-h-[600px] sm:grid sm:place-items-center duration-300 pt-24 pb-10 sm:pb-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
          {/* Left text content section */}
          <div className="space-y-5 sm:p-16 pb-6">
            <h1 data-aos="fade-up" className="text-2xl sm:text-3xl ">
              ArufnaraStore
            </h1>
            <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
              TERLARIS SEPANJANG MASA
            </h1>
            <p data-aos="fade-up" className="leading-8 tracking-wide">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis
              accusamus facilis nobis vitae reprehenderit quam! A eaque quis ab
              dolore dolorem quia, sunt expedita sed quod id inventore officia
              veritatis?
            </p>
          </div>
          {/* Right text content section */}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
