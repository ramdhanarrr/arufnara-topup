import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: "Facebook", icon: FaFacebook, href: "#" },
    { label: "Instagram", icon: FaInstagram, href: "#" },
    { label: "Twitter", icon: FaTwitter, href: "#" },
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://wa.me/6281234567890",
    },
  ];

  const navLinks = [
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="container mx-auto px-6 text-center">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-400 transition-colors duration-300"
            >
              <social.icon size={22} />
            </a>
          ))}
        </div>

        {/* Navigation Links */}
        <nav className="mb-6">
          <ul className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-sky-400 transition-colors duration-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="mailto:support@example.com"
                className="hover:text-sky-400 transition-colors duration-300 flex items-center justify-center"
              >
                <MdEmail size={18} className="mr-1.5" /> Hubungi Kami
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright & Disclaimer */}
        <div className="text-xs">
          <p className="mb-1">
            &copy; {currentYear} Arufnara. All Rights Reserved.
          </p>
          <p>
            Dibuat dengan <span className="text-sky-400">&hearts;</span> untuk
            Gamers.
          </p>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Mobile Legends: Bang Bang™ dan aset terkait adalah merek dagang
            Moonton. Website ini tidak berafiliasi dengan Moonton.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
