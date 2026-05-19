"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  RefreshCcw,
  Loader2,
  Trash2,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // FETCH REPORTS
  // =========================
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================
  // FILTER
  // =========================
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

  // =========================
  // UPDATE STATUS
  // =========================
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
        alert("Gagal update status");
        return;
      }

      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  // =========================
  // DELETE REPORT
  // =========================
  const deleteReport = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus laporan ini?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/reports/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Gagal menghapus laporan");
        return;
      }

      alert("Laporan berhasil dihapus");
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  // =========================
  // STYLE HELPERS
  // =========================
  const getPriorityStyle = (priority) => {
    const map = {
      emergency: { bg: "#fde8e8", color: "#c0392b", label: "Emergency" },
      high: { bg: "#fff7d6", color: "#b07d00", label: "High" },
      medium: { bg: "#e8f5ff", color: "#004b8d", label: "Medium" },
    };
    return map[priority] || { bg: "#f1f1e6", color: "#3a5068", label: "Low" };
  };

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

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <Loader2 size={42} style={{ color: "#004b8d", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* HEADER */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Kelola Laporan</h1>
        <p style={styles.heroDesc}>
          Admin dapat memeriksa, memverifikasi, menindak lanjuti, atau menyelesaikan laporan.
        </p>
      </div>

      {/* FILTER */}
      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <Search size={18} color="#8a9bb0" />
          <input
            type="text"
            placeholder="Cari judul atau pelapor..."
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
          <option value="rejected">Ditolak</option>
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
              <th style={styles.th}>Kategori</th>
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

                    {/* CATEGORY */}
                    <td style={styles.td}>
                      {report.category_name || "-"}
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
                          <option value="rejected">Ditolak</option>
                        </select>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => deleteReport(report.id)}
                          style={styles.deleteBtn}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={styles.empty}>
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

// =========================
// STYLE
// =========================
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

  heroTitle: { margin: 0, fontSize: 28, fontWeight: 800 },
  heroDesc: { marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" },

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
    fontSize: 14,
  },

  select: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "0 12px",
    fontSize: 14,
  },

  refreshBtn: {
    border: "none",
    borderRadius: 12,
    padding: "0 20px",
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
    background: "#f8f9ff",
    fontSize: 13,
    fontWeight: 600,
    color: "#001f3d",
  },

  td: {
    padding: 16,
    borderTop: "1px solid #f1f1e6",
    fontSize: 14,
    color: "#001f3d",
  },

  badge: {
    padding: "5px 12px",
    borderRadius: 40,
    fontSize: 12,
    fontWeight: 600,
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
    background: "#e8f5ff",
    color: "#004b8d",
    textDecoration: "none",
  },

  statusSelect: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: 12,
  },

  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "none",
    background: "#fde8e8",
    color: "#c0392b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    textAlign: "center",
    padding: 48,
    color: "#3a5068",
  },
};