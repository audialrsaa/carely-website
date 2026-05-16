// components/SidebarAdmin.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Shield,
  Settings,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

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
    {
      label: "Pengaturan",
      href: "/admin/settings",
      icon: Settings,
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
        borderRight: "1px solid rgba(0, 75, 141, 0.08)",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(0, 75, 141, 0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #004b8d, #43acff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(0, 75, 141, 0.25)",
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#001f3d",
                margin: 0,
              }}
            >
              Carely
            </h1>
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 10,
                color: "#3a5068",
                margin: 0,
              }}
            >
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 6 }}>
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
                padding: "12px 16px",
                borderRadius: 12,
                textDecoration: "none",
                background: active ? "#f1f1e6" : "transparent",
                color: active ? "#004b8d" : "#3a5068",
                fontWeight: active ? 600 : 500,
                transition: "all 0.2s",
                fontSize: 14,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: 20, borderTop: "1px solid rgba(0, 75, 141, 0.08)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "none",
            borderRadius: 12,
            background: "#fde8e8",
            color: "#c0392b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: 14,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fcc5c5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fde8e8";
          }}
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}