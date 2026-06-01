// components/SidebarSuperAdmin.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  FileText, 
  ClipboardList, 
  LogOut,
  Bell
} from "lucide-react";
import Image from "next/image";

const API = "http://localhost:5000/api";

export default function SidebarSuperAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setUnreadCount(data.total || 0);
    } catch (err) {
      console.error("Fetch unread count error:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { label: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    { label: "Notifikasi", href: "/superadmin/notifications", icon: Bell, hasBadge: true },
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
            <p style={styles.logoSubtitle}>Superadmin Panel</p>
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
                
                {item.hasBadge && unreadCount > 0 && (
                  <span style={styles.badge}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
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
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FEF2F2';
          }}
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 260,
    minHeight: '100vh',
    background: '#fff',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
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
    background: 'linear-gradient(135deg, #004b8d, #43acff)',
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
    padding: '16px 12px',
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
  badge: {
    background: '#EF4444',
    color: '#fff',
    minWidth: 20,
    height: 20,
    borderRadius: 9999,
    fontSize: 11,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    fontWeight: 600,
  },
  logoutSection: {
    padding: '20px',
    borderTop: '1px solid #E5E7EB',
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    background: '#FEF2F2',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    color: '#DC2626',
    transition: 'all 0.2s',
  },
};