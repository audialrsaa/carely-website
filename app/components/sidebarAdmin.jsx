"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Kelola Laporan",
      href: "/admin/reports",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <aside
      style={{
        width: 260,
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 24, borderBottom: "1px solid #e2e8f0" }}>
        <h2 style={{ margin: 0, color: "#001f3d" }}>Carely Admin</h2>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
          Admin Panel
        </p>
      </div>

      <nav style={{ flex: 1, padding: 16 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                marginBottom: 8,
                borderRadius: 12,
                textDecoration: "none",
                background: active ? "#eef6ff" : "transparent",
                color: active ? "#004b8d" : "#334155",
                fontWeight: active ? 700 : 500,
              }}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: 16 }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 12,
            background: "#fef2f2",
            color: "#dc2626",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}