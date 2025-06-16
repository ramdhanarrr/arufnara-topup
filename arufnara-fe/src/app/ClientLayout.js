"use client";
import Navbar from "@/components/Navbar/Navbar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const hideNavbar =
        pathname.startsWith("/user")|| // Add more paths as needed to hide the navbar
        pathname.startsWith("/admin")

    return (
        <>
            {!hideNavbar && <Navbar />}
            {children}
        </>
    );
}