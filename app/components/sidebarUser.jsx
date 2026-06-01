// components/SidebarUser.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, AlertCircle, FileText, Settings, LogOut, Bell} from "lucide-react";
import Image from "next/image";

export default function SidebarUser() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/users", icon: LayoutDashboard },
    { label: "Kasus Aktif", href: "/users/kasus-aktif", icon: AlertCircle },
    { label: "Riwayat Laporan", href: "/users/history", icon: FileText },
    
  { label: "Notifikasi", href: "/users/notifications", icon: Bell },
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
    <aside style={styles.sidebar}>
      {/* Logo Section */}
      <div style={styles.logoSection}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBox}>
            <Image 
              src="/images/logo.png" 
              alt="Carely Logo" 
              width={32} 
              height={32}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <h1 style={styles.logoTitle}>Carely</h1>
            <p style={styles.logoSubtitle}>Safe Space to Speak</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} style={styles.navLink}>
              <div
                style={{
                  ...styles.navItem,
                  background: isActive ? '#F3F4F6' : 'transparent',
                  color: isActive ? '#2563EB' : '#4B5563',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F9FAFB';
                    e.currentTarget.style.color = '#2563EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#4B5563';
                  }
                }}
              >
                <Icon size={18} />
                <span style={styles.navLabel}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={styles.logoutSection}>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FEE2E2';
            e.currentTarget.style.color = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
          }}
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 260,
    height: '100vh',
    position: 'sticky',
    top: 0,
    background: '#fff',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflowY: 'auto',
  },
  logoSection: {
    padding: '24px 20px',
    borderBottom: '1px solid #E5E7EB',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0, 75, 141, 0.25)',
    overflow: 'hidden',
  },
  logoTitle: {
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: '#111827',
    margin: 0,
  },
  logoSubtitle: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 10,
    color: '#6B7280',
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navLink: {
    textDecoration: 'none',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navLabel: {
    flex: 1,
  },
  logoutSection: {
    padding: '20px',
    borderTop: '1px solid #E5E7EB',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    background: '#FEF2F2',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 600,
    color: '#DC2626',
    transition: 'all 0.2s',
  },
};