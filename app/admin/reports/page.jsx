"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  RefreshCcw,
  Loader2,
  Trash2,
  FileText,
  Calendar,
  User,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      setReports(Array.isArray(data) ? data : []);
      setFiltered(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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

  const getPriorityStyle = (priority) => {
    const map = {
      emergency: { bg: "#FEE2E2", color: "#DC2626", label: "Emergency" },
      high: { bg: "#FEF3C7", color: "#D97706", label: "High" },
      medium: { bg: "#DBEAFE", color: "#2563EB", label: "Medium" },
      low: { bg: "#F3F4F6", color: "#6B7280", label: "Low" },
    };
    return map[priority] || map.low;
  };

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

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat laporan...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerBadge}>Admin Panel</div>
          <h1 style={styles.title}>Kelola Laporan</h1>
          <p style={styles.subtitle}>Admin dapat memeriksa, memverifikasi, menindak lanjuti, atau menyelesaikan laporan</p>
        </div>
        <div style={styles.statsBadge}>
          <FileText size={16} />
          Total: {reports.length}
        </div>
      </div>

      {/* Filter Section */}
      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <Search size={18} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Cari judul atau pelapor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterRight}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
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
      </div>

      {/* Result Info */}
      <div style={styles.resultInfo}>
        <p>Menampilkan {filtered.length} dari {reports.length} laporan</p>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Laporan</th>
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
                filtered.map((report, index) => {
                  const priority = getPriorityStyle(report.priority);
                  const status = getStatusStyle(report.status);

                  return (
                    <tr key={report.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>
                        <div style={styles.reportTitle}>
                          <FileText size={14} color="#9CA3AF" />
                          <span>{report.title}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.reporterInfo}>
                          <User size={14} color="#9CA3AF" />
                          <span>{report.reporter_name || "User"}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>
                          {report.category_name || "-"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: priority.bg, color: priority.color }}>
                          {priority.label}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          <Calendar size={14} color="#9CA3AF" />
                          <span>{new Date(report.created_at).toLocaleDateString("id-ID")}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionWrap}>
                          <Link href={`/admin/reports/${report.id}`} style={styles.detailBtn}>
                            <Eye size={15} />
                          </Link>

                          <button onClick={() => deleteReport(report.id)} style={styles.deleteBtn}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>
                    <FileText size={48} color="#D1D5DB" />
                    <p style={styles.emptyText}>Tidak ada laporan ditemukan</p>
                    <p style={styles.emptySubtext}>
                      {search || statusFilter !== "all" 
                        ? "Coba dengan filter yang berbeda" 
                        : "Belum ada laporan yang masuk"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  headerBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    margin: 0,
  },
  statsBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    background: "#fff",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    color: "#2563EB",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  filterCard: {
    display: "flex",
    gap: 12,
    background: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: "0 14px",
    background: "#F9FAFB",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "12px 0",
    fontSize: 14,
    background: "transparent",
  },
  filterRight: {
    display: "flex",
    gap: 10,
  },
  select: {
    padding: "0 16px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: 12,
    fontSize: 14,
    background: "#F9FAFB",
    cursor: "pointer",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    height: 42,
    border: "none",
    borderRadius: 12,
    background: "#2563EB",
    color: "#fff",
    cursor: "pointer",
  },
  resultInfo: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },
  tableCard: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 900,
  },
  th: {
    textAlign: "left",
    padding: "16px 20px",
    background: "#F9FAFB",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
  },
  td: {
    padding: "16px 20px",
    fontSize: 14,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#F3F4F6",
  },
  rowEven: {
    background: "#fff",
  },
  rowOdd: {
    background: "#F9FAFB",
  },
  reportTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  reporterInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  categoryBadge: {
    padding: "4px 10px",
    background: "#F3F4F6",
    borderRadius: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  badge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
  },
  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#6B7280",
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
    borderRadius: 8,
    background: "#EFF6FF",
    color: "#2563EB",
    textDecoration: "none",
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "none",
    background: "#FEE2E2",
    color: "#DC2626",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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