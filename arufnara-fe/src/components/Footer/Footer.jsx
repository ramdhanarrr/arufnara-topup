import React from "react";
import {
  FaWhatsapp,
  FaAndroid,
  FaAppStoreIos,
} from "react-icons/fa";
import { MdCall, MdEmail } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 text-white border-t shadow-lg bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-800/70 backdrop-blur-lg border-white/20">
      <div className="container px-4 mx-auto">
        <div className="grid gap-10 text-sm md:grid-cols-3">
          {/* About */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Arufnara Store</h2>
            <p className="leading-relaxed text-white/80">
              Arufnara Store adalah platform digital yang menyediakan layanan top up
              game, pembelian voucher, dan berbagai produk digital lainnya dengan cepat,
              aman, dan terpercaya.
            </p>
          </div>

          {/* Download */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Download Aplikasi</h2>
            <p className="mb-3 text-white/80">Tersedia di:</p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-2 transition-colors hover:text-yellow-400"
              >
                <FaAndroid className="text-xl" />
                Android
              </a>
              <a
                href="#"
                className="flex items-center gap-2 transition-colors hover:text-yellow-400"
              >
                <FaAppStoreIos className="text-xl" />
                iOS
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Kontak Kami</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/80">
                <MdCall className="text-lg" />
                +62 812 3456 7890
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <MdEmail className="text-lg" />
                support@arufnara.store
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <FaWhatsapp className="text-lg" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="underline hover:text-yellow-400">
                  Chat via WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/20" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between text-xs text-white/60 md:flex-row">
          <p>&copy; {currentYear} Arufnara Store. All rights reserved.</p>
          <div className="flex mt-3 space-x-4 md:mt-0">
            <a href="#" className="hover:text-yellow-400">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-yellow-400">Privasi</a>
            <a href="#" className="hover:text-yellow-400">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;