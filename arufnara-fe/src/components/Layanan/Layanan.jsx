import React from "react";
import Img2 from "../../assets/car2.png";
import Image from "next/image";

const LayananCard = [
  {
    id: 1,
    img: Img2,
    name: "💎 Paket Diamond Gede",
    desc: "Mau top up 86 sampe 1000 diamond? Tinggal klik, langsung masuk! Mau push rank? Diamond dulu, jago belakangan.",
    button: "Cek Promo!",
    aosDelay: "300",
  },
  {
    id: 2,
    img: Img2,
    name: "🗓️ Event Paling Gacor",
    desc: "Lagi ada event seru, bro! Bisa dapet skin gratis, bonus diamond, sampe kolaborasi epic — jangan sampe kudet!",
    button: "Gas Top Up!",
    aosDelay: "100",
  },
  {
    id: 3,
    img: Img2,
    name: "🔥 Promo Auto Untung",
    desc: "Diamond lagi diskon! Cashback, harga miring, pokoknya ini dia momen paling cuan buat top up!",
    button: "Cek Promo!",
    aosDelay: "500",
  },
];

const Layanan = () => {
  return (
    <div>
      <div className="py-10 bg-white dark:bg-dark text-black dark:text-white">
        <div className="container">
          {/* Header title section */}
          <div data-aos="fade-up" className="text-center mb-20">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white ">
              Top Up Sekarang, Bantai Musuh!
            </h1>
          </div>

          {/* Card section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 place-items-center">
            {LayananCard.map(({ id, img, name, desc, button, aosDelay }) => {
              return (
                <div
                  key={id}
                  data-aos="fade-up"
                  data-aos-delay={aosDelay}
                  className="group rounded-2xl bg-white dark:bg-black hover:!bg-primary shadow-xl duration-200 max-w-[300px] relative"
                >
                  {/* image section */}
                  <div className="h-[110px]">
                    <Image
                      src={img}
                      alt=""
                      className="max-w-[200px] block mx-auto transform -translate-y-20 group-hover:scale-110 group-hover:translate-x-4 duration-300"
                    ></Image>
                  </div>
                  {/* text content section */}
                  <div className="p-4 text-center space-y-4">
                    <h1 className="text-xl font-bold">{name}</h1>
                    <p className="text-gray-600 group-hover:text-black-duration-300 text-sm line-clamp-2">
                      {desc}
                    </p>
                    <button className="bg-black text-white px-4 py-2 rounded-lg">
                      {button}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layanan;
