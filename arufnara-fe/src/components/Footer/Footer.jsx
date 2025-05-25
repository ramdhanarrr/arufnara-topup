import React from "react";
import {
  FaAndroid,
  FaAppStoreIos,
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaMapMarker,
  FaMousePointer,
  FaTwitter,
} from "react-icons/fa";
import { MdEmail, MdCall } from "react-icons/md";

const Footer = () => {
  return (
    <div className="bg-white text-black dark:bg-dark dark:text-white">
      {/* upper section banner */}
      <div className="bg-secondary ">
        <div className="container text-black text-center py-10 lg:py-14 text-2xl font-bold space-y-4">
          <p>WE READY TO TAKE YOUT CALL 24 HOURS, 7 DAYS!</p>
          <h1 className="text-3xl md:text-5xl font-bold">+123 456 789 </h1>
        </div>
      </div>
      {/* Bottom Footer section */}
      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-21 py-12">
        {/* First Col  Section */}
        <div className="space-y-6">
          {/* Heading */}
          <h1 className="text-2xl py-3 font-bold uppercase border-b-8 border-secondary">
            About Arufnara
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            sit perspiciatis, nulla deserunt tempora aperiam, perferendis,
            repellat facere dolore iure dolor exercitationem. Et commodi ducimus
            doloremque eligendi minima ad! Iure?
          </p>
          {/* Social Links */}
          <div className="flex items-center text-secondary gap-3 text-2xl">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaGoogle />
          </div>
        </div>

        {/* Second Col Section */}
        <div className="space-y-6">
          <h1 className="text-2xl py-3 font-bold uppercase border-b-8 border-secondary">
            Download
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            dicta perspiciatis aliquid nisi quos quasi nihil. Reprehenderit vero
            placeat omnis quod praesentium nam perferendis, ab, exercitationem
            repudiandae fugiat ad architecto.
          </p>
          <div className="flex items-center gap-8">
            <div className="text-secondary text-xl font-semibold flex items-center gap-2">
              Android user
              <span>
                <FaAndroid className="text-2xl text-black dark:text-white" />
              </span>
            </div>
            <div className="text-secondary text-xl font-semibold flex items-center gap-2">
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
          <h1 className="text-2xl py-3 font-bold uppercase border-b-8 border-secondary">
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
      <p className="text-center py-4 text-sm">
        Copyright © 2025. All rights reserved
      </p>
    </div>
  );
};

export default Footer;
