import React from "react";
import Img1 from "../../assets/bonus.png";
import Img2 from "../../assets/aot.png";
import Img3 from "../../assets/cashback.png";
import Img4 from "../../assets/colector.png";
import Img5 from "../../assets/luckyspin.png";
import Img6 from "../../assets/allstar.png";
import Img7 from "../../assets/starlight.png";
import Image from "next/image";
import Link from "next/link";

const TopupCard = [
  {
    id: 1,
    img: Img1,
    name: "🎉 Event Diamond Bonus ML",
    desc: "Top up dan dapetin bonus hingga 50% diamond lebih banyak. Cuma berlaku 3 hari, buruan serbu!",
    button: "Ikut Sekarang",
    aosDelay: "100",
  },
  {
    id: 2,
    img: Img2,
    name: "⚔️ Collab ML x Attack on Titan",
    desc: "Kolaborasi epic MLBB x AOT! Skin Levi dan Mikasa bisa kamu dapatkan dengan diskon spesial.",
    button: "Lihat Detail",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    name: "🔥 Weekend Cashback Diamond",
    desc: "Top up minimal 100k, cashback langsung masuk 15%! Weekend doang ya!",
    button: "Top Up Sekarang",
    aosDelay: "300",
  },
  {
    id: 4,
    img: Img4,
    name: "💥 Skin Collector Flash Event",
    desc: "Skin collector dengan harga miring cuma seminggu ini. Jangan sampai kehabisan!",
    button: "Ambil Skin",
    aosDelay: "400",
  },
  {
    id: 5,
    img: Img5,
    name: "🎁 Lucky Spin Gratis 1x",
    desc: "Top up berapa aja, dapet tiket Lucky Spin gratis. Hadiahnya skin epic permanen!",
    button: "Spin Sekarang",
    aosDelay: "500",
  },
  {
    id: 6,
    img: Img6,
    name: "👑 MLBB All Star 2025",
    desc: "Event terbesar tahun ini! Top up untuk vote idolamu dan dapatkan hadiah eksklusif.",
    button: "Join Event",
    aosDelay: "600",
  },
  {
    id: 7,
    img: Img7,
    name: "🔮 Pre-Order Skin Starlight",
    desc: "Pre-order skin starlight bulan depan dengan diskon khusus pengguna baru!",
    button: "Pesan Sekarang",
    aosDelay: "700",
  },
];

const TopUp = () => {
  return (
    <div>
      <div className="py-10 text-white border-b bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-800/70 backdrop-blur-lg border-white/20">
        <div className="container">
          <div data-aos="fade-up" className="mb-20 text-center">
            <h1 className="text-4xl font-bold text-white">
              Event Top Up MLBB Paling Gacor!
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 place-items-center">
            {TopupCard.map(({ id, img, name, desc, button, aosDelay }) => {
              return (
                <div
                  key={id}
                  data-aos="fade-up"
                  data-aos-delay={aosDelay}
                  className="group rounded-2xl bg-white/20 dark:bg-black/40 hover:!bg-primary/80 shadow-xl border border-white/20 backdrop-blur-md duration-200 max-w-[300px] relative"
                >
                  <div className="h-[110px]">
                    <Image
                      src={img}
                      alt=""
                      className="max-w-[200px] block mx-auto transform -translate-y-20 group-hover:scale-110 group-hover:translate-x-4 duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-4 text-center">
                    <h1 className="text-xl font-bold text-white">{name}</h1>
                    <p className="mb-6 text-sm duration-300 text-white/80 group-hover:text-white line-clamp-2">
                      {desc}
                    </p>
                    <Link href="/auth/login">
                      <button className="px-4 py-2 text-white transition-colors duration-300 rounded-lg bg-black/80 hover:bg-indigo-800">
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

export default TopUp;
