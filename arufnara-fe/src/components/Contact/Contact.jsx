import React from "react";
import { MdCall, MdEmail, MdLocationOn } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="px-6 py-20 text-black bg-white dark:bg-dark dark:text-white sm:px-10">
            <div className="container max-w-5xl mx-auto space-y-10 text-center">
                <div>
                    <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Hubungi Kami</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                        Kami siap membantu Anda! Jangan ragu untuk menghubungi Arufnara Store
                        melalui kontak berikut.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
                    {/* Phone */}
                    <div className="flex items-start gap-4">
                        <MdCall className="text-2xl text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Telepon</h3>
                            <p>+62 812 3456 7890</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                        <MdEmail className="text-2xl text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Email</h3>
                            <p>support@arufnara.store</p>
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-start gap-4">
                        <FaWhatsapp className="text-2xl text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">WhatsApp</h3>
                            <a
                                href="https://wa.me/6281234567890"
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-primary hover:opacity-80"
                            >
                                Chat Sekarang
                            </a>
                        </div>
                    </div>
                </div>

                {/* Optional address */}
                <div className="flex items-center justify-center gap-3 pt-10">
                    <MdLocationOn className="text-xl text-primary" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Jl. Digital No. 10, Jakarta, Indonesia
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
