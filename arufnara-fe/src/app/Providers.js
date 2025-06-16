"use client";
import Footer from "@/components/Footer/Footer";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}