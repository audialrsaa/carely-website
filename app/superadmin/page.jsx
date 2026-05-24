// app/superadmin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  Loader2,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalReports: 0,
    todayReports: 0,
    pendingReports: 0,
    processReports: 0,
    selesaiReports: 0,
  });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const dashboardRes = await fetch(`${API}/admin/dashboard/super`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (dashboardRes.status === 401 || dashboardRes.status === 403) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
          return;
        }

        if (!dashboardRes.ok) {
          throw new Error(`Dashboard Error`);
        }

        const dashboardData = await dashboardRes.json();

        const reportsRes = await fetch(`${API}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!reportsRes.ok) {
          throw new Error(`Reports Error`);
        }

        const reportsData = await reportsRes.json();

        const pendingReports = dashboardData.status_summary?.find((s) => s.status === "pending")?.total || 0;
        const selesaiReports = dashboardData.status_summary?.find((s) => s.status === "selesai")?.total || 0;
        const processReports = dashboardData.status_summary
          ?.filter((s) => ["diproses", "investigasi", "ditindak"].includes(s.status))
          .reduce((acc, curr) => acc + curr.total, 0) || 0;

        setStats({
          totalUsers: dashboardData.total_users || 0,
          totalAdmins: dashboardData.total_admins || 0,
          totalReports: dashboardData.total_reports || 0,
          todayReports: dashboardData.today_reports || 0,
          pendingReports,
          processReports,
          selesaiReports,
        });

        setRecentReports(Array.isArray(reportsData) ? reportsData.slice(0, 6) : []);
      } catch (error) {
        console.error("Dashboard Superadmin Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat dashboard...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#FEF3C7", color: "#D97706", label: "Menunggu" },
      diproses: { bg: "#DBEAFE", color: "#2563EB", label: "Diproses" },
      investigasi: { bg: "#E0E7FF", color: "#4F46E5", label: "Investigasi" },
      ditindak: { bg: "#E0E7FF", color: "#4F46E5", label: "Ditindak" },
      selesai: { bg: "#D1FAE5", color: "#059669", label: "Selesai" },
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status };
  };

  const statCards = [
    { 
      label: "Total User", 
      value: stats.totalUsers, 
      icon: <Users size={20} />, 
      bg: "#EFF6FF", 
      color: "#2563EB",
      link: "/superadmin/users"
    },
    { 
      label: "Total Admin", 
      value: stats.totalAdmins, 
      icon: <Shield size={20} />, 
      bg: "#F3E8FF", 
      color: "#9333EA",
      link: "/superadmin/admins"
    },
    { 
      label: "Total Laporan", 
      value: stats.totalReports, 
      icon: <FileText size={20} />, 
      bg: "#FEF3C7", 
      color: "#D97706",
      link: "/superadmin/reports"
    },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>SUPER ADMIN CONTROL CENTER</div>
          <h1 style={styles.heroTitle}>Dashboard Superadmin</h1>
          <p style={styles.heroDesc}>
            Pantau user, admin, laporan masuk, dan status investigasi dalam satu panel utama.
          </p>
          <div style={styles.heroFeatures}>
            <span><Users size={14} /> User Management</span>
            <span><Shield size={14} /> Admin Oversight</span>
            <span><FileText size={14} /> Report Monitoring</span>
          </div>
        </div>
        <div style={styles.heroIcon}>
          <Activity size={64} opacity={0.1} />
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((card) => (
          <Link href={card.link} key={card.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <p style={styles.statLabel}>{card.label}</p>
              <h3 style={styles.statValue}>{card.value.toLocaleString()}</h3>
            </div>
            <ArrowRight size={16} style={styles.statArrow} />
          </Link>
        ))}
      </div>

      {/* Status Cards */}
      <div style={styles.statusGrid}>
        <div style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#EFF6FF", color: "#2563EB" }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <p style={styles.statusLabel}>Hari Ini</p>
            <h3 style={styles.statusValue}>{stats.todayReports}</h3>
            <p style={styles.statusDesc}>Laporan masuk hari ini</p>
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#FEF3C7", color: "#D97706" }}>
            <Clock size={20} />
          </div>
          <div>
            <p style={styles.statusLabel}>Menunggu</p>
            <h3 style={styles.statusValue}>{stats.pendingReports}</h3>
            <p style={styles.statusDesc}>Perlu ditindaklanjuti</p>
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#DBEAFE", color: "#2563EB" }}>
            <Activity size={20} />
          </div>
          <div>
            <p style={styles.statusLabel}>Diproses</p>
            <h3 style={styles.statusValue}>{stats.processReports}</h3>
            <p style={styles.statusDesc}>Sedang dalam penanganan</p>
          </div>
        </div>

        <div style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#D1FAE5", color: "#059669" }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <p style={styles.statusLabel}>Selesai</p>
            <h3 style={styles.statusValue}>{stats.selesaiReports}</h3>
            <p style={styles.statusDesc}>Telah diselesaikan</p>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Laporan Terbaru</h3>
            <p style={styles.sectionDesc}>6 laporan terbaru dari seluruh sistem</p>
          </div>
          <Link href="/superadmin/reports" style={styles.linkBtn}>
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recentReports.length > 0 ? (
          <div style={styles.reportsList}>
            {recentReports.map((report) => {
              const status = getStatusStyle(report.status);
              return (
                <div key={report.id} style={styles.reportItem}>
                  <div style={styles.reportInfo}>
                    <div style={styles.reportIcon}>
                      <FileText size={16} color="#6B7280" />
                    </div>
                    <div>
                      <h4 style={styles.reportTitle}>{report.title}</h4>
                      <div style={styles.reportMeta}>
                        <span>{report.reporter_name || "Anonymous"}</span>
                        <span>•</span>
                        <span>
                          <Calendar size={12} />
                          {new Date(report.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.reportActions}>
                    <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                    <Link href={`/superadmin/reports/${report.id}`} style={styles.viewBtn}>
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <AlertCircle size={48} color="#D1D5DB" />
            <p style={styles.emptyText}>Belum ada laporan</p>
            <p style={styles.emptySubtext}>Laporan akan muncul di sini setelah ada yang masuk</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "32px 24px",
    background: "#F9FAFB",
    minHeight: "100vh",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F9FAFB",
  },
  loadingCard: {
    textAlign: "center",
    background: "#fff",
    padding: "48px",
    borderRadius: 24,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderTopColor: "#2563EB",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  // Hero Section
  hero: {
    background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)",
    borderRadius: 24,
    padding: "32px 40px",
    marginBottom: 32,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    flex: 1,
    zIndex: 1,
  },
  heroBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    padding: "4px 14px",
    borderRadius: 40,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#fff",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    maxWidth: 500,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  heroFeatures: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  heroIcon: {
    position: "relative",
    zIndex: 0,
  },
  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    textDecoration: "none",
    transition: "all 0.2s",
    position: "relative",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  statArrow: {
    position: "absolute",
    right: 20,
    color: "#D1D5DB",
  },
  // Status Grid
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  statusCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusLabel: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  statusDesc: {
    fontSize: 11,
    color: "#9CA3AF",
    margin: 0,
    marginTop: 4,
  },
  // Table Card
  tableCard: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "20px 24px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  sectionDesc: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
    marginTop: 4,
  },
  linkBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    textDecoration: "none",
    color: "#2563EB",
    fontWeight: 600,
    fontSize: 13,
  },
  reportsList: {
    display: "flex",
    flexDirection: "column",
  },
  reportItem: {
    padding: "16px 24px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#F3F4F6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.2s",
  },
  reportInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    marginBottom: 6,
  },
  reportMeta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  reportActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  viewBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#EFF6FF",
    color: "#2563EB",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  emptyState: {
    padding: "64px 24px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#111827",
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    margin: 0,
  },
};