// ============================================================
// app/superadmin/page.jsx
// Dashboard Superadmin — Carely (FULL FIXED VERSION)
// SUDAH SESUAI BACKEND BARU:
// GET /api/admin/dashboard/super
// ============================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  Activity,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalReports: 0,
    todayReports: 0,
    emergencyReports: 0,
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

        // =====================================================
        // DASHBOARD STATS SUPERADMIN
        // =====================================================
        const dashboardRes = await fetch(`${API}/admin/dashboard/super`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (dashboardRes.status === 401 || dashboardRes.status === 403) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
          return;
        }

        if (!dashboardRes.ok) {
          const text = await dashboardRes.text();
          throw new Error(`Dashboard Error: ${text}`);
        }

        const dashboardData = await dashboardRes.json();

        // =====================================================
        // AMBIL SEMUA LAPORAN UNTUK RECENT REPORTS
        // =====================================================
        const reportsRes = await fetch(`${API}/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reportsRes.ok) {
          const text = await reportsRes.text();
          throw new Error(`Reports Error: ${text}`);
        }

        const reportsData = await reportsRes.json();

        // =====================================================
        // STATUS SUMMARY DARI BACKEND VIEW
        // =====================================================
        const pendingReports =
          dashboardData.status_summary.find((s) => s.status === "pending")
            ?.total || 0;

        const selesaiReports =
          dashboardData.status_summary.find((s) => s.status === "selesai")
            ?.total || 0;

        const processReports =
          dashboardData.status_summary
            .filter((s) =>
              ["diproses", "investigasi", "ditindak"].includes(s.status)
            )
            .reduce((acc, curr) => acc + curr.total, 0) || 0;

        setStats({
          totalUsers: dashboardData.total_users,
          totalAdmins: dashboardData.total_admins,
          totalReports: dashboardData.total_reports,
          todayReports: dashboardData.today_reports,
          emergencyReports: dashboardData.emergency_reports,
          pendingReports,
          processReports,
          selesaiReports,
        });

        setRecentReports(reportsData.slice(0, 6));
      } catch (error) {
        console.error("Dashboard Superadmin Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            border: "4px solid #dbeafe",
            borderTopColor: "#004b8d",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================
  // STATUS STYLE
  // ============================================================
  const getStatusStyle = (status) => {
    if (status === "pending") {
      return { bg: "#fff7d6", color: "#b07d00", label: "Pending" };
    }

    if (status === "selesai") {
      return { bg: "#e6f9f4", color: "#0a7c5c", label: "Selesai" };
    }

    return { bg: "#e8f5ff", color: "#004b8d", label: "Diproses" };
  };

  // ============================================================
  // STAT CARDS
  // ============================================================
  const statCards = [
    {
      label: "Total User",
      value: stats.totalUsers,
      icon: <Users size={18} />,
      bg: "#eef6ff",
      color: "#004b8d",
    },
    {
      label: "Total Admin",
      value: stats.totalAdmins,
      icon: <Shield size={18} />,
      bg: "#ede9fe",
      color: "#6d28d9",
    },
    {
      label: "Total Laporan",
      value: stats.totalReports,
      icon: <FileText size={18} />,
      bg: "#f1f1e6",
      color: "#004b8d",
    },
    {
      label: "Emergency",
      value: stats.emergencyReports,
      icon: <AlertTriangle size={18} />,
      bg: "#fef2f2",
      color: "#dc2626",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #001f3d, #004b8d, #43acff)",
          borderRadius: 24,
          padding: 28,
          color: "white",
          boxShadow: "0 12px 30px rgba(0,75,141,0.18)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            padding: "4px 12px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 14,
          }}
        >
          CONTROL CENTER
        </div>

        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Dashboard Superadmin
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.82)",
            maxWidth: 700,
            lineHeight: 1.7,
          }}
        >
          Pantau user, admin, laporan masuk, status investigasi, serta kasus
          darurat dalam satu panel utama.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 18,
            flexWrap: "wrap",
            fontSize: 13,
          }}
        >
          <span>👥 User Management</span>
          <span>🛡 Admin Oversight</span>
          <span>🚨 Emergency Monitoring</span>
        </div>
      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 20,
              border: "1px solid rgba(0,75,141,0.08)",
              boxShadow: "0 4px 14px rgba(0,75,141,0.05)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: card.bg,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              {card.icon}
            </div>

            <p
              style={{
                fontSize: 13,
                color: "#3a5068",
                marginBottom: 4,
              }}
            >
              {card.label}
            </p>

            <h3
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#001f3d",
              }}
            >
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ================================================= */}
      {/* MINI STATUS */}
      {/* ================================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
        }}
      >
        <MiniStatusCard
          title="Hari Ini"
          value={stats.todayReports}
          icon={<Clock size={18} />}
          color="#6d28d9"
          bg="#ede9fe"
        />

        <MiniStatusCard
          title="Pending"
          value={stats.pendingReports}
          icon={<Clock size={18} />}
          color="#b07d00"
          bg="#fff7d6"
        />

        <MiniStatusCard
          title="Diproses"
          value={stats.processReports}
          icon={<Activity size={18} />}
          color="#004b8d"
          bg="#eef6ff"
        />

        <MiniStatusCard
          title="Selesai"
          value={stats.selesaiReports}
          icon={<CheckCircle size={18} />}
          color="#0a7c5c"
          bg="#e6f9f4"
        />
      </div>

      {/* ================================================= */}
      {/* RECENT REPORTS */}
      {/* ================================================= */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(0,75,141,0.08)",
          boxShadow: "0 4px 14px rgba(0,75,141,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #eef2f7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#001f3d",
              }}
            >
              Laporan Terbaru
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#64748b",
              }}
            >
              6 laporan terbaru seluruh sistem
            </p>
          </div>

          <Link
            href="/superadmin/reports"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#004b8d",
              textDecoration: "none",
            }}
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {recentReports.length > 0 ? (
          recentReports.map((report) => {
            const status = getStatusStyle(report.status);

            return (
              <div
                key={report.id}
                style={{
                  padding: "16px 22px",
                  borderBottom: "1px solid #f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#001f3d",
                    }}
                  >
                    {report.title}
                  </h4>

                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    {report.reporter_name || "User"} •{" "}
                    {new Date(report.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: status.bg,
                    color: status.color,
                  }}
                >
                  {status.label}
                </span>
              </div>
            );
          })
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Belum ada laporan.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MINI STATUS CARD COMPONENT
// ============================================================
function MiniStatusCard({ title, value, icon, color, bg }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(0,75,141,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: bg,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>

      <div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          {title}
        </p>

        <h3
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            color: "#001f3d",
          }}
        >
          {value}
        </h3>
      </div>
    </div>
  );
}