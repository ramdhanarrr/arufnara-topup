import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaAndroid,
  FaAppStoreIos,
} from "react-icons/fa";
import { MdCall, MdEmail } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 text-gray-300 bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="grid gap-10 text-sm md:grid-cols-3">
          {/* About */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Arufnara Store</h2>
            <p className="leading-relaxed">
              Arufnara Store adalah platform digital yang menyediakan layanan top up
              game, pembelian voucher, dan berbagai produk digital lainnya dengan cepat,
              aman, dan terpercaya.
            </p>
          </div>

          {/* Download */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Download Aplikasi</h2>
            <p className="mb-3">Tersedia di:</p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <FaAndroid className="text-xl" />
                Android
              </a>
              <a
                href="#"
                className="flex items-center gap-2 transition-colors hover:text-white"
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
              <li className="flex items-center gap-2">
                <MdCall className="text-lg" />
                +62 812 3456 7890
              </li>
              <li className="flex items-center gap-2">
                <MdEmail className="text-lg" />
                support@arufnara.store
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="text-lg" />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
                  Chat via WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between text-xs text-gray-500 md:flex-row">
          <p>&copy; {currentYear} Arufnara Store. All rights reserved.</p>
          <div className="flex mt-3 space-x-4 md:mt-0">
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white">Privasi</a>
            <a href="#" className="hover:text-white">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
