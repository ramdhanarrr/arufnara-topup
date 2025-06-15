"use client";

import React from "react";
import Admin from "@/components/Admin/Admin";
import Head from "next/head";

export default function AdminLayout({ children }) {
  return (
    <>
      <Head>
      </Head>
      <Admin>{children}</Admin>
    </>
  );
}
