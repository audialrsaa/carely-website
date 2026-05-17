// ============================================================
// app/superadmin/layout.jsx
// Layout Superadmin
// ============================================================
"use client";

import SidebarSuperAdmin from "../components/sidebarSuperAdmin";

export default function SuperAdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Sidebar */}
      <SidebarSuperAdmin />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: 24,
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}