// components/SidebarSuperAdmin.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  FileText, 
  ClipboardList, 
  LogOut 
} from "lucide-react";
import Image from "next/image";

export default function SidebarSuperAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    { label: "Manajemen User", href: "/superadmin/users", icon: Users },
    { label: "Manajemen Admin", href: "/superadmin/admins", icon: Shield },
    { label: "Semua Laporan", href: "/superadmin/reports", icon: FileText },
    { label: "Audit Log", href: "/superadmin/audit", icon: ClipboardList },
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
      width: 260,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid rgba(0, 75, 141, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0, 75, 141, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #004b8d, #43acff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 75, 141, 0.25)',
            overflow: 'hidden',
          }}>
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={32} 
              height={32}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 18, color: '#001f3d', margin: 0 }}>Carely</h1>
            <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 10, color: '#3a5068', margin: 0 }}>Superadmin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {menuItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 12, fontSize: 14,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: active ? '#f1f1e6' : 'transparent',
                  color: active ? '#004b8d' : '#3a5068',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#f8f9ff'; e.currentTarget.style.color = '#004b8d'; } }}
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
      <div style={{ padding: 20, borderTop: '1px solid rgba(0, 75, 141, 0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12, border: 'none',
            background: '#fde8e8', cursor: 'pointer', fontSize: 14,
            fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500,
            color: '#c0392b', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fcc5c5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fde8e8'; }}
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}