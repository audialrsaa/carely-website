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
        setRecentReports(reportsData.slice(0, 6));
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
        <Loader2 size={42} style={{ color: "#004b8d", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!stats) return <div style={{ textAlign: "center", padding: 40 }}>Gagal memuat dashboard.</div>;

  const pending = stats.status_summary?.find((s) => s.status === "pending")?.total || 0;
  const diperiksa = stats.status_summary?.find((s) => s.status === "diperiksa")?.total || 0;
  const selesai = stats.status_summary?.find((s) => s.status === "selesai")?.total || 0;

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#fff7d6", color: "#b07d00", label: "Pending" },
      diperiksa: { bg: "#e8f5ff", color: "#004b8d", label: "Diperiksa" },
      diverifikasi: { bg: "#ede9fe", color: "#6d28d9", label: "Diverifikasi" },
      tindak_lanjut: { bg: "#e0f2fe", color: "#0369a1", label: "Tindak Lanjut" },
      selesai: { bg: "#e6f9f4", color: "#0a7c5c", label: "Selesai" },
      rejected: { bg: "#fde8e8", color: "#c0392b", label: "Ditolak" },
    };
    return map[status] || { bg: "#f1f1e6", color: "#3a5068", label: status };
  };

  const getPriorityStyle = (priority) => {
    const map = {
      emergency: { bg: "#fde8e8", color: "#c0392b", label: "Emergency" },
      high: { bg: "#fff7d6", color: "#b07d00", label: "High" },
      medium: { bg: "#e8f5ff", color: "#004b8d", label: "Medium" },
    };
    return map[priority] || { bg: "#f1f1e6", color: "#3a5068", label: "Low" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero */}
      <div style={styles.hero}>
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

      {/* Stats Grid */}
      <div style={styles.grid3}>
        <StatCard title="Total Laporan" value={stats.total_reports} icon={<FileText size={18} />} bg="#e8f5ff" color="#004b8d" />
        <StatCard title="Laporan Hari Ini" value={stats.today_reports} icon={<TrendingUp size={18} />} bg="#ede9fe" color="#6d28d9" />
        <StatCard title="Pending" value={pending} icon={<Clock size={18} />} bg="#fff7d6" color="#b07d00" />
      </div>

      {/* Status Summary */}
      <div style={styles.grid3}>
        <MiniCard title="Diperiksa" value={diperiksa} icon={<Activity size={18} />} bg="#e8f5ff" color="#004b8d" />
        <MiniCard title="Selesai" value={selesai} icon={<CheckCircle size={18} />} bg="#e6f9f4" color="#0a7c5c" />
        <MiniCard title="Butuh Perhatian" value={stats.priority_summary?.find((p) => p.priority === "emergency")?.total || 0} icon={<AlertTriangle size={18} />} bg="#fde8e8" color="#c0392b" />
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
          recentReports.map((report) => {
            const status = getStatusStyle(report.status);
            const priority = getPriorityStyle(report.priority);

            return (
              <div key={report.id} style={styles.reportItem}>
                <div>
                  <h4 style={styles.reportTitle}>{report.title}</h4>
                  <p style={styles.reportMeta}>
                    {report.reporter_name || "User"} • {new Date(report.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div style={styles.reportRight}>
                  <span style={{ ...styles.badge, background: priority.bg, color: priority.color }}>
                    {priority.label}
                  </span>
                  <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
                    {status.label}
                  </span>
                  <Link href={`/admin/reports/${report.id}`} style={styles.eyeBtn}>
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.empty}>Belum ada laporan.</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.iconBox, background: bg, color }}>{icon}</div>
      <p style={styles.cardLabel}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

function MiniCard({ title, value, icon, bg, color }) {
  return (
    <div style={styles.miniCard}>
      <div style={{ ...styles.iconBoxSmall, background: bg, color }}>{icon}</div>
      <div>
        <p style={styles.cardLabel}>{title}</p>
        <h3 style={{ margin: 0, fontSize: 24, color: "#001f3d" }}>{value}</h3>
      </div>
    </div>
  );
}

const styles = {
  loadingWrap: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    background: "linear-gradient(135deg, #001f3d, #004b8d, #43acff)",
    borderRadius: 24,
    padding: 28,
    color: "#fff",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 14px",
    borderRadius: 40,
    background: "rgba(255,255,255,0.15)",
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 16,
  },
  heroTitle: { margin: 0, fontSize: 30, fontWeight: 800 },
  heroDesc: { marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" },
  heroFeatures: { display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap", fontSize: 13 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
  statCard: { background: "#fff", padding: 20, borderRadius: 18, border: "1px solid rgba(0,75,141,0.08)" },
  miniCard: { background: "#fff", padding: 18, borderRadius: 18, border: "1px solid rgba(0,75,141,0.08)", display: "flex", alignItems: "center", gap: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  iconBoxSmall: { width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardLabel: { margin: 0, fontSize: 13, color: "#3a5068" },
  cardValue: { margin: "4px 0 0", fontSize: 28, fontWeight: 800, color: "#001f3d" },
  tableCard: { background: "#fff", borderRadius: 20, border: "1px solid rgba(0,75,141,0.08)", overflow: "hidden" },
  tableHeader: { padding: "18px 24px", borderBottom: "1px solid #f1f1e6", display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: "#001f3d" },
  sectionDesc: { margin: "4px 0 0", fontSize: 12, color: "#3a5068" },
  linkBtn: { display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "#004b8d", fontWeight: 600, fontSize: 13 },
  reportItem: { padding: "16px 24px", borderBottom: "1px solid #f1f1e6", display: "flex", justifyContent: "space-between", alignItems: "center" },
  reportTitle: { margin: 0, fontSize: 15, fontWeight: 700, color: "#001f3d" },
  reportMeta: { margin: "4px 0 0", fontSize: 12, color: "#3a5068" },
  reportRight: { display: "flex", alignItems: "center", gap: 10 },
  badge: { padding: "5px 12px", borderRadius: 40, fontSize: 12, fontWeight: 600 },
  eyeBtn: { width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "#e8f5ff", color: "#004b8d", textDecoration: "none" },
  empty: { padding: 48, textAlign: "center", color: "#3a5068" },
};