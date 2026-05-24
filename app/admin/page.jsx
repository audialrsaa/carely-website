// app/admin/page.jsx - Admin Dashboard
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowRight,
  Eye,
  Shield,
  TrendingUp,
  Loader2,
  Calendar,
  ChevronRight,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const [dashboardRes, reportsRes] = await Promise.all([
          fetch(`${API}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/reports`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!dashboardRes.ok || !reportsRes.ok) {
          if (dashboardRes.status === 401 || reportsRes.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
          }
          return;
        }

        const dashboardData = await dashboardRes.json();
        const reportsData = await reportsRes.json();

        setStats(dashboardData);
        setRecentReports(Array.isArray(reportsData) ? reportsData.slice(0, 6) : []);
      } catch (err) {
        console.error("Admin Dashboard Error:", err);
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

  if (!stats) return <div style={styles.errorWrap}>Gagal memuat dashboard.</div>;

  const pending = stats.status_summary?.find((s) => s.status === "pending")?.total || 0;
  const diperiksa = stats.status_summary?.find((s) => s.status === "diperiksa")?.total || 0;
  const selesai = stats.status_summary?.find((s) => s.status === "selesai")?.total || 0;
  const emergency = stats.priority_summary?.find((p) => p.priority === "emergency")?.total || 0;

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#FEF3C7", color: "#D97706", label: "Menunggu" },
      diperiksa: { bg: "#DBEAFE", color: "#2563EB", label: "Diperiksa" },
      diverifikasi: { bg: "#E0E7FF", color: "#4F46E5", label: "Diverifikasi" },
      tindak_lanjut: { bg: "#E0E7FF", color: "#4F46E5", label: "Tindak Lanjut" },
      selesai: { bg: "#D1FAE5", color: "#059669", label: "Selesai" },
      rejected: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak" },
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status };
  };

  const getPriorityStyle = (priority) => {
    const map = {
      emergency: { bg: "#FEE2E2", color: "#DC2626", label: "Emergency" },
      high: { bg: "#FEF3C7", color: "#D97706", label: "High" },
      medium: { bg: "#DBEAFE", color: "#2563EB", label: "Medium" },
      low: { bg: "#F3F4F6", color: "#6B7280", label: "Low" },
    };
    return map[priority] || map.low;
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <Shield size={14} />
            ADMIN PANEL
          </div>
          <h1 style={styles.heroTitle}>Dashboard Admin</h1>
          <p style={styles.heroDesc}>
            Kelola laporan, monitor prioritas kasus, dan pantau status penanganan laporan secara real-time.
          </p>
          <div style={styles.heroFeatures}>
            <span><Activity size={14} /> Monitoring Laporan</span>
            <span><AlertTriangle size={14} /> Prioritas Kasus</span>
            <span><CheckCircle size={14} /> Update Status</span>
          </div>
        </div>
        <div style={styles.heroIcon}>
          <Shield size={64} opacity={0.1} />
        </div>
      </div>

      {/* Stats Grid - Clickable */}
      <div style={styles.statsGrid}>
        <Link href="/admin/reports" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#EFF6FF", color: "#2563EB" }}>
            <FileText size={20} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Laporan</p>
            <h3 style={styles.statValue}>{stats.total_reports || 0}</h3>
          </div>
          <ChevronRight size={16} style={styles.statArrow} />
        </Link>

        <Link href="/admin/reports?filter=today" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#FEF3C7", color: "#D97706" }}>
            <TrendingUp size={20} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Hari Ini</p>
            <h3 style={styles.statValue}>{stats.today_reports || 0}</h3>
          </div>
          <ChevronRight size={16} style={styles.statArrow} />
        </Link>

        <Link href="/admin/reports?status=pending" style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#FEE2E2", color: "#DC2626" }}>
            <Clock size={20} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Menunggu</p>
            <h3 style={styles.statValue}>{pending}</h3>
          </div>
          <ChevronRight size={16} style={styles.statArrow} />
        </Link>
      </div>

      {/* Status Summary - Clickable */}
      <div style={styles.statusGrid}>
        <Link href="/admin/reports?status=diperiksa" style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#DBEAFE", color: "#2563EB" }}>
            <Activity size={20} />
          </div>
          <div style={styles.statusContent}>
            <p style={styles.statusLabel}>Diperiksa</p>
            <h3 style={styles.statusValue}>{diperiksa}</h3>
            <p style={styles.statusDesc}>Sedang diperiksa</p>
          </div>
          <ChevronRight size={16} style={styles.statusArrow} />
        </Link>

        <Link href="/admin/reports?status=selesai" style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#D1FAE5", color: "#059669" }}>
            <CheckCircle size={20} />
          </div>
          <div style={styles.statusContent}>
            <p style={styles.statusLabel}>Selesai</p>
            <h3 style={styles.statusValue}>{selesai}</h3>
            <p style={styles.statusDesc}>Telah diselesaikan</p>
          </div>
          <ChevronRight size={16} style={styles.statusArrow} />
        </Link>

        <Link href="/admin/reports?priority=emergency" style={styles.statusCard}>
          <div style={{ ...styles.statusIcon, background: "#FEE2E2", color: "#DC2626" }}>
            <AlertTriangle size={20} />
          </div>
          <div style={styles.statusContent}>
            <p style={styles.statusLabel}>Emergency</p>
            <h3 style={styles.statusValue}>{emergency}</h3>
            <p style={styles.statusDesc}>Butuh perhatian segera</p>
          </div>
          <ChevronRight size={16} style={styles.statusArrow} />
        </Link>
      </div>

      {/* Recent Reports */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Laporan Terbaru</h3>
            <p style={styles.sectionDesc}>Pantau laporan terbaru dan update status dengan cepat</p>
          </div>
          <Link href="/admin/reports" style={styles.linkBtn}>
            Kelola Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recentReports.length > 0 ? (
          <div style={styles.reportsList}>
            {recentReports.map((report) => {
              const status = getStatusStyle(report.status);
              const priority = getPriorityStyle(report.priority);

              return (
                <div key={report.id} style={styles.reportItem}>
                  <div style={styles.reportInfo}>
                    <div style={styles.reportIcon}>
                      <FileText size={16} color="#6B7280" />
                    </div>
                    <div>
                      <h4 style={styles.reportTitle}>{report.title}</h4>
                      <div style={styles.reportMeta}>
                        <span>{report.reporter_name || "User"}</span>
                        <span>•</span>
                        <span>
                          <Calendar size={12} />
                          {new Date(report.created_at).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.reportActions}>
                    <span style={{ ...styles.badge, backgroundColor: priority.bg, color: priority.color }}>
                      {priority.label}
                    </span>
                    <span style={{ ...styles.badge, backgroundColor: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                    <Link href={`/admin/reports/${report.id}`} style={styles.viewBtn}>
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <FileText size={48} color="#D1D5DB" />
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
    maxWidth: 1200,
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
  errorWrap: {
    textAlign: "center",
    padding: 60,
    color: "#DC2626",
  },
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
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
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
    margin: 0,
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
    cursor: "pointer",
    position: "relative",
  },
  statContent: {
    flex: 1,
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
    color: "#D1D5DB",
    transition: "transform 0.2s",
  },
  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
    textDecoration: "none",
    transition: "all 0.2s",
    cursor: "pointer",
    position: "relative",
  },
  statusContent: {
    flex: 1,
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
  statusArrow: {
    color: "#D1D5DB",
    transition: "transform 0.2s",
  },
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
    marginBottom: 4,
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
    gap: 10,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
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

// Hover effect styles (akan ditambahkan via CSS)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  a:hover .statArrow, a:hover .statusArrow {
    transform: translateX(4px);
  }
  a:hover {
    border-color: #2563EB !important;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }
  .reportItem:hover {
    background: #F9FAFB;
  }
`;
document.head.appendChild(styleSheet);