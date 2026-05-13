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
        {/* Top Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: "16px 22px",
            marginBottom: 24,
            border: "1px solid rgba(0,75,141,0.08)",
            boxShadow: "0 4px 14px rgba(0,75,141,0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#001f3d",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              }}
            >
              Superadmin Dashboard
            </h2>

            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Kelola seluruh sistem Carely secara terpusat
            </p>
          </div>

          {/* Badge */}
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              background: "#eef6ff",
              color: "#004b8d",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            SUPERADMIN ACCESS
          </div>
        </div>

        {/* Dynamic Page */}
        {children}
      </main>
    </div>
  );
}