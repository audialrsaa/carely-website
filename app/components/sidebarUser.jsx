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
    <aside style={{
      width: 256,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid rgba(0, 75, 141, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: 24, borderBottom: '1px solid rgba(0, 75, 141, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #004b8d, #43acff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 75, 141, 0.25)',
          }}>
            <Heart size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 15, color: '#001f3d', margin: 0 }}>Carely</h1>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, color: '#3a5068', margin: 0 }}>Your Safe Space to Speak</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12, fontSize: 14,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: active ? '#f1f1e6' : 'transparent',
                  color: active ? '#004b8d' : '#3a5068',
                  borderLeft: active ? '3px solid #004b8d' : '3px solid transparent',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#f1f1e6'; e.currentTarget.style.color = '#004b8d'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3a5068'; } }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: 16, borderTop: '1px solid rgba(0, 75, 141, 0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 12, border: 'none',
            background: 'transparent', cursor: 'pointer', fontSize: 14,
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
            color: '#004b8d', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fff7d6'; e.currentTarget.style.color = '#004b8d'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#004b8d'; }}
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}