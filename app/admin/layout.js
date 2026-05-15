"use client";

import SidebarAdmin from "../components/sidebarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <SidebarAdmin />

      <main
        style={{
          flex: 1,
          padding: 24,
        }}
      >
        {children}
      </main>
    </div>
  );
}