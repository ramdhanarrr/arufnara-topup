"use client";
import Link from "next/link";
import React from "react";
import DarkMode from "./DarkMode";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Top Up", link: "/topup" },
  { id: 3, name: "Promo", link: "/features" },
  { id: 4, name: "Login", link: "/auth/login" },
];

const Navbar = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const toogleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="sticky top-0 z-50 w-full duration-300 border-b shadow-md bg-white/10 border-white/20 backdrop-blur-lg dark:bg-dark/30 dark:text-white">
      <div className="container py-2 md:py-0">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/">
            <picture>
              <img
                src="/arufnara-black.png"
                alt="Logo"
                className="block h-12 dark:hidden"
              />
              <img
                src="/arufnara-white.png"
                alt="Logo"
                className="hidden h-12 dark:block"
              />
            </picture>
          </Link>

          {/* Desktop Menu Section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6">
              {Navlinks.map(({ id, name, link }) => (
                <li key={id} className="py-4">
                  <Link
                    href={link}
                    className="px-4 py-2 text-lg font-medium text-black duration-300 rounded-full dark:text-white hover:bg-primary hover:text-white"
                  >
                    {name}
                  </Link>
                </li>
              ))}
              <DarkMode />
            </ul>
          </div>

          {/* Mobile Menu Section */}
          <div className="flex items-center gap-4 md:hidden">
            <DarkMode />
            {showMenu ? (
              <HiMenuAlt1
                onClick={toogleMenu}
                className="transition-all cursor-pointer"
                size={30}
              />
            ) : (
              <HiMenuAlt3
                onClick={toogleMenu}
                className="transition-all cursor-pointer"
                size={30}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveMenu
        showMenu={showMenu}
        toogleMenu={toogleMenu}
        Navlinks={Navlinks}
      />
    </nav>
  );
};

export default Navbar;
