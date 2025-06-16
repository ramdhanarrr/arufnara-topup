import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Navlinks } from "./Navbar";
import Link from "next/link";

const ResponsiveMenu = ({ showMenu }) => {
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[50%] flex-col justify-between bg-gradient-to-br from-indigo-900/70 via-purple-800/60 to-blue-900/70 border-r border-white/20 backdrop-blur-lg dark:bg-dark/30 text-white px-8 pb-6 pt-16 duration-300 md:hidden rounded-r-xl shadow-md`}
    >
      <div>
        {/* user top section */}
        <div className="flex items-center justify-start gap-3">
          <FaUserCircle className="text-5xl" />
          <div>
            <h1 className="text-white">Hello User</h1>
          </div>
        </div>

        {/* Navigation links section */}
        <nav className="mt-12">
          <ul>
            {Navlinks.map(({ id, name, link }) => {
              return (
                <li key={id} className="py-4">
                  <Link
                    href={link}
                    className="text-xl font-medium text-white duration-300"
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom footer section */}
      <div className="footer">
        <h1 className="text-white">
          Made with ❤️ by{" "}
          <a href="" className="underline">
            Arufnara-Store
          </a>
        </h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
