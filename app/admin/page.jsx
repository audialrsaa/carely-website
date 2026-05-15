// ============================================================
// app/admin/page.jsx
// Dashboard Admin
// API: /api/admin/dashboard
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { FileText, Clock, AlertTriangle } from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const pending =
    stats.status_summary?.find((s) => s.status === "pending")?.total || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          background: "linear-gradient(135deg,#001f3d,#004b8d,#43acff)",
          borderRadius: 24,
          padding: 28,
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>Dashboard Admin</h1>
        <p>Kelola laporan dan monitor prioritas kasus.</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
        }}
      >
        <StatCard
          title="Total Laporan"
          value={stats.total_reports}
          icon={<FileText size={18} />}
        />

        <StatCard
          title="Laporan Hari Ini"
          value={stats.today_reports}
          icon={<Clock size={18} />}
        />

        <StatCard
          title="Pending"
          value={pending}
          icon={<AlertTriangle size={18} />}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 18,
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ marginBottom: 12 }}>{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}