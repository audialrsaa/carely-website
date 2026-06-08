// ===========================================
// FILE 1:
// app/superadmin/reports/page.jsx
// ===========================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Eye, FileText, Loader2, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

const API = "http://localhost:5000/api";

// ======================================================
// superadmin reports page
// halaman untuk melihat seluruh laporan yang masuk
// serta melakukan pencarian dan filtering laporan
// ======================================================
export default function SuperAdminReportsPage() {

  // menyimpan seluruh data laporan
  const [reports, setReports] = useState([]);

  // menyimpan keyword pencarian
  const [search, setSearch] = useState("");

  // menyimpan status loading halaman
  const [loading, setLoading] = useState(true);

  // menyimpan filter status yang dipilih
  const [filterStatus, setFilterStatus] = useState("all");

  // ======================================================
  // initial load
  // mengambil seluruh data laporan saat halaman dibuka
  // ======================================================
  useEffect(() => {

    const fetchReports = async () => {

      try {

        // mengambil token login
        const token = localStorage.getItem("token");

        // jika token tidak ada arahkan ke login
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // request data laporan ke backend
        const res = await fetch(
          `${API}/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // jika request gagal
        if (!res.ok) {

          const text = await res.text();

          console.error(
            "Fetch Reports Error:",
            text
          );

          return;
        }

        // mengubah response menjadi json
        const data = await res.json();

        // menyimpan data laporan ke state
        setReports(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "Fetch Reports Error:",
          err
        );

      } finally {

        // menghentikan loading
        setLoading(false);
      }
    };

    fetchReports();

  }, []);

  // ======================================================
  // get status count
  // menghitung jumlah laporan berdasarkan status
  // ======================================================
  const getStatusCount = (status) => {

    // jika semua status dipilih
    if (status === "all") {
      return reports.length;
    }

    // menghitung jumlah laporan sesuai status
    return reports.filter(
      (r) => r.status === status
    ).length;
  };

  // ======================================================
  // filtered reports
  // melakukan pencarian dan filter laporan
  // ======================================================
  const filteredReports = reports.filter(
    (report) => {

      // filter berdasarkan judul laporan atau nama pelapor
      const matchesSearch =
        report.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        (report.reporter_name || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      // filter berdasarkan status laporan
      const matchesStatus =
        filterStatus === "all" ||
        report.status === filterStatus;

      // hanya tampilkan data yang sesuai filter
      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  // ======================================================
  // get status style
  // menentukan warna, label, dan icon status laporan
  // ======================================================
  const getStatusStyle = (status) => {

    const map = {

      pending: {
        bg: "#FEF3C7",
        color: "#D97706",
        label: "Menunggu",
        icon: Clock,
      },

      diperiksa: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "Diperiksa",
        icon: AlertCircle,
      },

      diverifikasi: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "Diverifikasi",
        icon: CheckCircle,
      },

      tindak_lanjut: {
        bg: "#E0E7FF",
        color: "#4F46E5",
        label: "Tindak Lanjut",
        icon: TrendingUp,
      },

      selesai: {
        bg: "#D1FAE5",
        color: "#059669",
        label: "Selesai",
        icon: CheckCircle,
      },

      rejected: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "Ditolak",
        icon: AlertCircle,
      },
    };

    // mengembalikan style sesuai status
    return (
      map[status] || {
        bg: "#F3F4F6",
        color: "#6B7280",
        label: status,
        icon: FileText,
      }
    );
  };

  // ======================================================
  // get priority style
  // menentukan warna dan label prioritas laporan
  // ======================================================
  const getPriorityStyle = (priority) => {

    const map = {

      emergency: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "Emergency",
        borderColor: "#FCA5A5",
      },

      high: {
        bg: "#FEF3C7",
        color: "#D97706",
        label: "High",
        borderColor: "#FCD34D",
      },

      medium: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "Medium",
        borderColor: "#93C5FD",
      },

      low: {
        bg: "#F3F4F6",
        color: "#6B7280",
        label: "Low",
        borderColor: "#D1D5DB",
      },
    };

    // mengembalikan style prioritas
    return map[priority] || map.low;
  };

  // ======================================================
  // loading state
  // menampilkan loading saat data laporan dimuat
  // ======================================================
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>

          <Loader2
            size={48}
            style={styles.spinner}
          />

          <p style={styles.loadingText}>
            Memuat data laporan...
          </p>

        </div>

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div>
          <div style={styles.headerBadge}>Super Admin Dashboard</div>
          <h1 style={styles.title}>Kelola Laporan</h1>
          <p style={styles.subtitle}>Pantau dan kelola seluruh laporan dari pengguna Carely</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString("id-ID", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#EFF6FF", color: "#2563EB" }}>
            <FileText size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Total Laporan</p>
            <h3 style={styles.statValue}>{reports.length}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#FEF3C7", color: "#D97706" }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Menunggu</p>
            <h3 style={styles.statValue}>{getStatusCount("pending")}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#D1FAE5", color: "#059669" }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Selesai</p>
            <h3 style={styles.statValue}>{getStatusCount("selesai")}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#FEE2E2", color: "#DC2626" }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Ditolak</p>
            <h3 style={styles.statValue}>{getStatusCount("rejected")}</h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <Search size={20} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Cari laporan berdasarkan judul atau pelapor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterTabs}>
          {["all", "pending", "diperiksa", "selesai", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.filterTab,
                ...(filterStatus === status ? styles.filterTabActive : {}),
              }}
            >
              {status === "all" ? "Semua" : 
               status === "pending" ? "Menunggu" :
               status === "diperiksa" ? "Diperiksa" :
               status === "selesai" ? "Selesai" : "Ditolak"}
              <span style={styles.filterCount}>{getStatusCount(status)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Daftar Laporan</h3>
          <p style={styles.tableSubtitle}>Menampilkan {filteredReports.length} dari {reports.length} laporan</p>
        </div>
        
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Judul Laporan</th>
                <th style={styles.th}>Pelapor</th>
                <th style={styles.th}>Kategori</th>
                <th style={styles.th}>Prioritas</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => {
                const status = getStatusStyle(report.status);
                const priority = getPriorityStyle(report.priority);
                const StatusIcon = status.icon;

                return (
                  <tr key={report.id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                    <td style={styles.td}>
                      <div style={styles.reportTitle}>
                        <FileText size={16} color="#6B7280" />
                        <span>{report.title}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.reporterInfo}>
                        <div style={styles.reporterAvatar}>
                          {report.reporter_name?.charAt(0) || "?"}
                        </div>
                        <span>{report.reporter_name || "-"}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>
                        {report.category_name || "-"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.priorityBadge,
                        backgroundColor: priority.bg,
                        color: priority.color,
                        borderLeftColor: priority.borderColor,
                      }}>
                        {priority.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: status.bg,
                        color: status.color,
                      }}>
                        <StatusIcon size={12} style={{ marginRight: 4 }} />
                        {status.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateInfo}>
                        {new Date(report.created_at).toLocaleDateString("id-ID", {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <Link href={`/superadmin/reports/${report.id}`} style={styles.viewBtn}>
                        <Eye size={16} />
                        <span>Detail</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredReports.length === 0 && (
            <div style={styles.emptyState}>
              <FileText size={48} color="#D1D5DB" />
              <p style={styles.emptyText}>Tidak ada laporan ditemukan</p>
              <p style={styles.emptySubtext}>Coba ubah kata kunci pencarian atau filter status</p>
            </div>
          )}
        </div>
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
    color: "#2563EB",
    animation: "spin 1s linear infinite",
    marginBottom: 16,
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 16,
  },
  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
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
  dateBadge: {
    padding: "8px 16px",
    background: "#fff",
    borderRadius: 12,
    fontSize: 13,
    color: "#6B7280",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
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
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  statIcon: {
    padding: 12,
    borderRadius: 16,
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
  filterSection: {
    marginBottom: 32,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    padding: "12px 20px",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
    fontFamily: "'Inter', system-ui",
    background: "transparent",
  },
  filterTabs: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  filterTab: {
    padding: "8px 16px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 500,
    background: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    color: "#6B7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.2s",
  },
  filterTabActive: {
    background: "#2563EB",
    color: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#2563EB",
  },
  filterCount: {
    background: "rgba(0,0,0,0.05)",
    padding: "2px 6px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
  },
  tableContainer: {
    background: "#fff",
    borderRadius: 24,
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
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
    marginBottom: 4,
  },
  tableSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
  },
  tableWrap: {
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
  tableRowEven: {
    background: "#fff",
  },
  tableRowOdd: {
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
  reporterAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
  },
  categoryBadge: {
    padding: "4px 10px",
    background: "#F3F4F6",
    borderRadius: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  priorityBadge: {
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-block",
    borderLeftWidth: 3,
    borderLeftStyle: "solid",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  dateInfo: {
    fontSize: 13,
    color: "#6B7280",
  },
  viewBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 10,
    background: "#EFF6FF",
    color: "#2563EB",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
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