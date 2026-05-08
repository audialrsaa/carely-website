// ======================================================
// components/UserSidebar.jsx
// SIDEBAR USER TERPISAH (PAKAI DI SEMUA PAGE USER)
// ======================================================
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  AlertCircle,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/users",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Kasus Aktif",
      href: "/users/kasus-aktif",
      icon: <AlertCircle size={20} />,
    },
    {
      label: "Riwayat Laporan",
      href: "/users/history",
      icon: <FileText size={20} />,
    },
    {
      label: "Pengaturan",
      href: "/users/settings",
      icon: <Settings size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-white border-r shadow-sm rounded-r-3xl p-8 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-teal-500">
          Care for Her
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Ruang aman & dukungan
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-3 flex-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-medium transition-all cursor-pointer ${
                  active
                    ? "bg-teal-50 text-teal-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium"
      >
        <LogOut size={20} />
        Keluar
      </button>
    </aside>
  );
}