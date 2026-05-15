// ============================================================
// app/admin/reports/page.jsx
// Kelola Laporan Admin — Carely
// ADMIN hanya update status laporan + lihat prioritas
// STATUS VALID:
// pending | diperiksa | diverifikasi | rejected | tindak_lanjut | selesai
// ============================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================================
  // FETCH REPORTS
  // =========================================
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch reports gagal:", text);

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }

        return;
      }

      const data = await res.json();

      setReports(data);
      setFiltered(data);
    } catch (err) {
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================================
  // FILTER
  // =========================================
  useEffect(() => {
    let temp = [...reports];

    if (search) {
      temp = temp.filter(
        (r) =>
          r.title?.toLowerCase().includes(search.toLowerCase()) ||
          r.reporter_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      temp = temp.filter((r) => r.status === statusFilter);
    }

    setFiltered(temp);
  }, [search, statusFilter, reports]);

  // =========================================
  // UPDATE STATUS
  // =========================================
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/reports/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_status: newStatus,
          notes: `Status diubah admin menjadi ${newStatus}`,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update status gagal:", text);
        alert("Gagal update status");
        return;
      }

      alert("Status berhasil diupdate");
      fetchReports();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Terjadi error");
    }
  };

  // =========================================
  // HELPERS
  // =========================================
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "emergency":
        return { bg: "#fef2f2", color: "#dc2626", label: "Emergency" };
      case "high":
        return { bg: "#fff7d6", color: "#b07d00", label: "High" };
      case "medium":
        return { bg: "#eef6ff", color: "#004b8d", label: "Medium" };
      default:
        return { bg: "#f8fafc", color: "#64748b", label: "Low" };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fff7d6", color: "#b07d00", label: "Pending" };
      case "diperiksa":
        return { bg: "#eef6ff", color: "#004b8d", label: "Diperiksa" };
      case "diverifikasi":
        return { bg: "#ede9fe", color: "#6d28d9", label: "Diverifikasi" };
      case "tindak_lanjut":
        return { bg: "#e0f2fe", color: "#0369a1", label: "Tindak Lanjut" };
      case "selesai":
        return { bg: "#e6f9f4", color: "#0a7c5c", label: "Selesai" };
      case "rejected":
        return { bg: "#fef2f2", color: "#dc2626", label: "Rejected" };
      default:
        return { bg: "#f8fafc", color: "#64748b", label: status };
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* HEADER */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Kelola Laporan</h1>
        <p style={styles.heroDesc}>
          Admin dapat memeriksa, memverifikasi, menindak lanjuti, atau
          menyelesaikan laporan berdasarkan prioritas dari Superadmin.
        </p>
      </div>

      {/* FILTER */}
      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Cari judul / user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="diperiksa">Diperiksa</option>
          <option value="diverifikasi">Diverifikasi</option>
          <option value="tindak_lanjut">Tindak Lanjut</option>
          <option value="selesai">Selesai</option>
          <option value="rejected">Rejected</option>
        </select>

        <button onClick={fetchReports} style={styles.refreshBtn}>
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Judul</th>
              <th style={styles.th}>Pelapor</th>
              <th style={styles.th}>Prioritas</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Tanggal</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((report) => {
                const priority = getPriorityStyle(report.priority);
                const status = getStatusStyle(report.status);

                return (
                  <tr key={report.id}>
                    <td style={styles.td}>{report.title}</td>
                    <td style={styles.td}>
                      {report.reporter_name || "User"}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background: priority.bg,
                          color: priority.color,
                        }}
                      >
                        {priority.label}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {new Date(report.created_at).toLocaleDateString("id-ID")}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.actionWrap}>
                        <Link
                          href={`/admin/reports/${report.id}`}
                          style={styles.detailBtn}
                        >
                          <Eye size={15} />
                        </Link>

                        <select
                          value={report.status}
                          onChange={(e) =>
                            updateStatus(report.id, e.target.value)
                          }
                          style={styles.statusSelect}
                        >
                          <option value="pending">Pending</option>
                          <option value="diperiksa">Diperiksa</option>
                          <option value="diverifikasi">Diverifikasi</option>
                          <option value="tindak_lanjut">Tindak Lanjut</option>
                          <option value="selesai">Selesai</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  Tidak ada laporan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: 42,
    height: 42,
    border: "4px solid #dbeafe",
    borderTopColor: "#004b8d",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  hero: {
    background: "linear-gradient(135deg, #001f3d, #004b8d, #43acff)",
    borderRadius: 24,
    padding: 28,
    color: "#fff",
  },

  heroTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
  },

  heroDesc: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.85)",
  },

  filterCard: {
    display: "flex",
    gap: 12,
    background: "#fff",
    padding: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,75,141,0.08)",
  },

  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "0 12px",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: 12,
  },

  select: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "0 12px",
  },

  refreshBtn: {
    border: "none",
    borderRadius: 12,
    padding: "0 16px",
    background: "#004b8d",
    color: "#fff",
    cursor: "pointer",
  },

  tableWrap: {
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    border: "1px solid rgba(0,75,141,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: 16,
    background: "#f8fafc",
    fontSize: 13,
    color: "#475569",
  },

  td: {
    padding: 16,
    borderTop: "1px solid #f1f5f9",
    fontSize: 14,
    color: "#001f3d",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },

  actionWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  detailBtn: {
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    background: "#eef6ff",
    color: "#004b8d",
    textDecoration: "none",
  },

  statusSelect: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
  },

  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
  },
};