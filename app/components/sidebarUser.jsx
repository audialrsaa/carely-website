// components/sidebarUser.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, AlertCircle, FileText, Settings, LogOut, Heart } from "lucide-react";

export default function SidebarUser() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/users", icon: LayoutDashboard },
    { label: "Kasus Aktif", href: "/users/kasus-aktif", icon: AlertCircle },
    { label: "Riwayat Laporan", href: "/users/history", icon: FileText },
    { label: "Pengaturan", href: "/users/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-teal-500 to-orange-400 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-navy-700">Carely</h1>
            <p className="text-[10px] text-slate-400">Your Safe Space to Speak</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                  active
                    ? "bg-teal-50 text-teal-500 font-medium"
                    : "text-slate-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}