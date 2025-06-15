import React from "react";
import Img1 from "../../assets/Event-01.png";
import Img2 from "../../assets/Event-03.png";
import Img3 from "../../assets/Event-02.png";
import Image from "next/image";
import Link from "next/link";

const LayananCard = [
  {
    id: 1,
    img: Img1,
    name: "💎 Big Diamond",
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
    img: Img3,
    name: "🔥 Promo Auto Untung",
    desc: "Diamond lagi diskon! Cashback, harga miring, pokoknya ini dia momen paling cuan buat top up!",
    button: "Cek Promo!",
    aosDelay: "500",
  },
];

const Layanan = () => {
  return (
    <div>
      <div className="py-10 text-white border-b bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-800/70 backdrop-blur-lg border-white/20">
        <div className="container">
          {/* Header title section */}
          <div data-aos="fade-up" className="mb-20 text-center">
            <h1 className="text-4xl font-bold text-white">
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
                  className="group rounded-2xl bg-white/20 dark:bg-black/40 hover:!bg-primary/80 shadow-xl border border-white/20 backdrop-blur-md duration-200 max-w-[300px] relative"
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
                  <div className="p-4 space-y-4 text-center">
                    <h1 className="text-xl font-bold text-white">{name}</h1>
                    <p className="text-sm text-white/80 group-hover:text-white line-clamp-3">
                      {desc}
                    </p>
                    <Link href="/auth/login">
                      <button className="px-4 py-3 text-white transition-colors duration-300 rounded-lg bg-black/80 hover:bg-indigo-800">
                        {button}
                      </button>
                    </Link>
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
