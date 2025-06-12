"use client";

import React from "react";
import Admin from "@/components/Admin/Admin";
import Head from "next/head";

export default function AdminLayout({ children }) {
  return (
    <>
      <Head>
        {/* Tambahkan CSS DataTables CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/2.3.2/css/dataTables.dataTables.min.css"
        />
      </Head>
      <Admin>{children}</Admin>
    </>
  );
}
