"use client";
import Link from "next/link";
import React from "react";
import DarkMode from "./DarkMode";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveMenu";

export const Navlinks = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About", link: "/about" },
  { id: 3, name: "Features", link: "/features" },
  { id: 4, name: "Blog", link: "/blog" },
  { id: 5, name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [showMenu, setShowMenu] = React.useState(false);
  const toogleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <nav className="relative z-10 shadow-md w-full dark:bg-dark dark:text-white duration-300">
      <div className="container py-2 md:py-0">
        <div className="flex items-center justify-between">
          {/* logo section */}
          <Link href="/">
            <img
              src="/arufnara-black.png"
              alt="Logo"
              className="h-12 block dark:hidden"
            />
            <img
              src="/arufnara-white.png"
              alt="Logo"
              className="h-12 hidden dark:block"
            />
          </Link>

          {/* Desktop Menu Section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6">
              {Navlinks.map(({ id, name, link }) => {
                return (
                  <li key={id} className="py-4">
                    <Link
                      href={link}
                      className={`text-lg font-medium text-black dark:text-white py-2 px-4 rounded-full hover:bg-secondary hover:text-white duration-300`}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}

              {/* Darkmode feature */}
              <DarkMode />
            </ul>
          </div>

          {/* Mobile Menu Section */}
          <div className="md:hidden flex items-center gap-4 ">
            <DarkMode />
            {showMenu ? (
              <HiMenuAlt1
                onClick={toogleMenu}
                className="cursor-pointer transition-all"
                sixe={30}
              />
            ) : (
              <HiMenuAlt3
                onClick={toogleMenu}
                className="cursor-pointer transition-all"
                sixe={30}
              />
            )}
          </div>
        </div>
      </div>
      <ResponsiveMenu
        showMenu={showMenu}
        toogleMenu={toogleMenu}
        Navlinks={Navlinks}
      />
    </nav>
  );
};

export default Navbar;
