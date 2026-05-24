// ============================================================
// app/users/page.jsx — UserDashboardPage
// ============================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Clock, AlertCircle, CheckCircle, PlusCircle, ArrowRight, Shield, Zap, ChevronRight } from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, process: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);
  const [hoveredReportId, setHoveredReportId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }

        const [profileRes, reportsRes] = await Promise.all([
          fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/reports/my`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (profileRes.status === 401) { localStorage.clear(); window.location.href = "/login"; return; }

        const profileData = await profileRes.json();
        const reportsData = await reportsRes.json();

        setProfile(profileData);
        setReports(reportsData);

        const pending = reportsData.filter((r) => r.status === "pending").length;
        const process = reportsData.filter((r) => ["diproses", "investigasi", "ditindak", "diverifikasi", "tindak_lanjut"].includes(r.status)).length;
        const selesai = reportsData.filter((r) => r.status === "selesai").length;

        setStats({ total: reportsData.length, pending, process, selesai });
      } catch (err) {
        console.error(err);
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
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = [
    { icon: <FileText size={18} />, label: 'Total Laporan', value: stats.total, bg: '#F3F4F6', color: '#6B7280' },
    { icon: <Clock size={18} />, label: 'Pending', value: stats.pending, bg: '#FEF3C7', color: '#D97706' },
    { icon: <AlertCircle size={18} />, label: 'Diproses', value: stats.process, bg: '#DBEAFE', color: '#2563EB' },
    { icon: <CheckCircle size={18} />, label: 'Selesai', value: stats.selesai, bg: '#D1FAE5', color: '#059669' },
  ];

  const getStatusStyle = (status) => {
    if (status === 'pending') return { background: '#FEF3C7', color: '#D97706', label: 'pending' };
    if (status === 'selesai') return { background: '#D1FAE5', color: '#059669', label: 'selesai' };
    return { background: '#DBEAFE', color: '#2563EB', label: 'diproses' };
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <Shield size={14} />
            DASHBOARD PERSONAL
          </div>
          <h1 style={styles.heroTitle}>Halo, {profile?.full_name?.split(" ")[0] || "Pengguna"}!</h1>
          <p style={styles.heroDesc}>Lingkungan aman untuk melaporkan. Kerahasiaan Anda prioritas kami.</p>
          <div style={styles.heroFeatures}>
            <span><Shield size={14} /> Privasi Terjaga</span>
            <span><Zap size={14} /> Respon Cepat</span>
          </div>
          <Link href="/users/report/new" style={styles.createBtn}>
            <PlusCircle size={16} />
            Buat Laporan Baru
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p style={styles.statLabel}>{s.label}</p>
              <h3 style={styles.statValue}>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div style={styles.recentCard}>
        <div style={styles.recentHeader}>
          <div>
            <h3 style={styles.recentTitle}>Riwayat Laporan</h3>
            <p style={styles.recentSubtitle}>Aktivitas terbaru Anda</p>
          </div>
          <Link href="/users/history" style={styles.viewAllLink}>
            Lihat semua
            <ArrowRight size={14} />
          </Link>
        </div>

        {reports.length > 0 ? (
          <div style={styles.reportList}>
            {reports.slice(0, 5).map((report) => {
              const statusStyle = getStatusStyle(report.status);
              const isHovered = hoveredReportId === report.id;
              
              return (
                <Link
                  key={report.id}
                  href={`/users/report/${report.id}`}
                  style={styles.reportLink}
                  onMouseEnter={() => setHoveredReportId(report.id)}
                  onMouseLeave={() => setHoveredReportId(null)}
                >
                  <div style={{
                    ...styles.reportItem,
                    background: isHovered ? "#F9FAFB" : "#fff",
                  }}>
                    <div style={styles.reportInfo}>
                      <div style={styles.reportIcon}>
                        <FileText size={16} color="#6B7280" />
                      </div>
                      <div>
                        <h4 style={styles.reportTitle}>{report.title}</h4>
                        <p style={styles.reportMeta}>
                          {report.category_name || "Laporan"} • {new Date(report.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div style={styles.reportRight}>
                      <span style={{ ...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.label}
                      </span>
                      <ChevronRight size={16} style={{
                        ...styles.arrowIcon,
                        color: isHovered ? "#2563EB" : "#D1D5DB",
                        transform: isHovered ? "translateX(4px)" : "translateX(0)",
                      }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <FileText size={48} color="#D1D5DB" />
            <p style={styles.emptyText}>Belum ada laporan</p>
            <p style={styles.emptySubtext}>Mulai buat laporan pertama Anda</p>
            <Link href="/users/report/new" style={styles.emptyCreateBtn}>
              Buat Laporan Baru
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "32px 24px",
    background: "#F9FAFB",
    minHeight: "100vh",
  },
  loadingWrap: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    textAlign: "center",
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
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },
  hero: {
    background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)",
    borderRadius: 20,
    padding: "32px",
    marginBottom: 32,
    color: "#fff",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 40,
    padding: "6px 16px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 16,
    lineHeight: 1.5,
  },
  heroFeatures: {
    display: "flex",
    gap: 20,
    fontSize: 12,
    opacity: 0.85,
    marginBottom: 24,
  },
  createBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    color: "#2563EB",
    textDecoration: "none",
    borderRadius: 40,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  recentCard: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  recentHeader: {
    padding: "20px 24px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  recentSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
    marginTop: 4,
  },
  viewAllLink: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#2563EB",
    textDecoration: "none",
    fontWeight: 600,
  },
  reportList: {
    display: "flex",
    flexDirection: "column",
  },
  reportLink: {
    textDecoration: "none",
  },
  reportItem: {
    padding: "16px 24px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#F3F4F6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
    cursor: "pointer",
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
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
  },
  reportRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  arrowIcon: {
    transition: "all 0.2s",
  },
  emptyState: {
    padding: "60px 24px",
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
    marginBottom: 20,
  },
  emptyCreateBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#2563EB",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
  },
};