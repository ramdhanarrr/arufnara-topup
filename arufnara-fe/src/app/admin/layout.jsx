// app/admin/layout.jsx
"use client";
import React from "react";
import Admin from "@/components/Admin/Admin";

export default function AdminLayout({ children }) {
  return <Admin>{children}</Admin>;
}
