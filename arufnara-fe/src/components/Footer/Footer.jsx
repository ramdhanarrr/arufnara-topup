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
      </div>
      {/* Bottom Footer section */}
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-21 py-12">
        {/* First Col  Section */}
        <div className="space-y-6">
          {/* Heading */}
          <h1 className="text-2xl py-3 font-bold uppercase border-b-8 border-primary">
            About Arufnara
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            sit perspiciatis, nulla deserunt tempora aperiam, perferendis,
            repellat facere dolore iure dolor exercitationem. Et commodi ducimus
            doloremque eligendi minima ad! Iure?
          </p>
          {/* Social Links */}
          <div className="flex items-center text-primary gap-3 text-2xl">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaGoogle />
          </div>
        </div>

        {/* Second Col Section */}
        <div className="space-y-6">
          <h1 className="text-2xl py-3 font-bold uppercase border-b-8 border-primary">
            Download
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            dicta perspiciatis aliquid nisi quos quasi nihil. Reprehenderit vero
            placeat omnis quod praesentium nam perferendis, ab, exercitationem
            repudiandae fugiat ad architecto.
          </p>
          <div className="flex items-center gap-8">
            <div className="text-primary text-xl font-semibold flex items-center gap-2">
              Android user
              <span>
                <FaAndroid className="text-2xl text-black dark:text-white" />
              </span>
            </div>
            <div className="text-primary text-xl font-semibold flex items-center gap-2">
              Ios user
              <span>
                <FaAppStoreIos className="text-2xl text-black dark:text-white" />
              </span>
            </div>
          </div>
        </div>

        {/* Third Col Section */}
        <div className="space-y-6">
          {/* Heading */}
          <h1 className="text-2xl py-3 font-bold uppercase border-b-8 border-primary">
            Contact
          </h1>
          <div className="flex items-center gap-4">
            <FaMapMarker />
            123 Street, New York, USA
          </div>
          <div className="flex items-center gap-4">
            <MdCall />
            +123 456 789
          </div>
          <div className="flex items-center gap-4">
            <MdEmail />
            arufnara@gmail.com
          </div>
          <div className="flex items-center gap-4">
            <FaMousePointer />
            www.arufnara.com
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
