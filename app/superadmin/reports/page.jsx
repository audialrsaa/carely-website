// ============================================================
// app/superadmin/reports/page.jsx
// Semua Laporan Superadmin
// ============================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";

const API = "http://localhost:5000/api";

export default function SuperAdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Fetch Reports Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      (report.reporter_name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    if (status === "pending")
      return { bg: "#fff7d6", color: "#b07d00" };

    if (status === "selesai")
      return { bg: "#e6f9f4", color: "#0a7c5c" };

    return { bg: "#eef6ff", color: "#004b8d" };
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={titleStyle}>Semua Laporan</h1>
        <p style={subtitleStyle}>
          Monitoring seluruh laporan user Carely
        </p>
      </div>

      {/* Search */}
      <div style={searchBox}>
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Cari laporan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      {/* Table */}
      <div style={tableWrap}>
        <table style={tableStyle}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={thStyle}>Judul</th>
              <th style={thStyle}>Pelapor</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Prioritas</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Detail</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => {
              const status = getStatusStyle(report.status);

              return (
                <tr key={report.id}>
                  <td style={tdStyle}>{report.title}</td>
                  <td style={tdStyle}>{report.reporter_name || "-"}</td>
                  <td style={tdStyle}>{report.category_name || "-"}</td>
                  <td style={tdStyle}>{report.priority || "-"}</td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: 999,
                        background: status.bg,
                        color: status.color,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {new Date(report.created_at).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>

                  <td style={tdStyle}>
                    <Link
                      href={`/superadmin/reports/${report.id}`}
                      style={viewBtn}
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
          <div style={emptyState}>Tidak ada laporan ditemukan.</div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// STYLE
// ============================================================
const titleStyle = {
  fontSize: 28,
  fontWeight: 800,
  color: "#001f3d",
};

const subtitleStyle = {
  color: "#64748b",
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#fff",
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
};

const searchInput = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: 14,
};

const tableWrap = {
  background: "#fff",
  borderRadius: 20,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: 16,
  fontSize: 13,
  color: "#475569",
};

const tdStyle = {
  padding: 16,
  borderTop: "1px solid #f1f5f9",
  fontSize: 14,
};

const viewBtn = {
  display: "inline-flex",
  padding: 8,
  borderRadius: 10,
  background: "#eef6ff",
  color: "#004b8d",
};

const emptyState = {
  padding: 30,
  textAlign: "center",
  color: "#64748b",
};