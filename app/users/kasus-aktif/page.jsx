"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, MapPin, CalendarDays, Search, Loader2, FileQuestion, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

const API = "http://localhost:5000/api";

export default function ActiveCasesPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  // helper fetch dengan token dan handling error
  const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));

      // redirect ke login jika token tidak valid
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      throw new Error(errBody.message || "Request gagal");
    }

    return res.json();
  };

  // mengambil data kasus aktif milik user
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiFetch("/reports/my");

        // hanya menampilkan laporan yang belum selesai atau ditolak
        const activeCases = data.filter(
          (r) =>
            r.status !== "selesai" &&
            r.status !== "rejected" &&
            r.status !== "ditolak"
        );

        setReports(activeCases);
        setFilteredReports(activeCases);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // filter laporan berdasarkan kata kunci pencarian
  useEffect(() => {
    const filtered = reports.filter(
      (r) =>
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.category_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.incident_location?.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredReports(filtered);
  }, [search, reports]);

  // menentukan tampilan badge prioritas
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "emergency":
        return {
          background: "#FEE2E2",
          color: "#DC2626",
          label: "emergency",
        };

      case "high":
        return {
          background: "#FEF3C7",
          color: "#D97706",
          label: "high",
        };

      case "medium":
        return {
          background: "#DBEAFE",
          color: "#2563EB",
          label: "medium",
        };

      case "low":
      default:
        return {
          background: "#F3F4F6",
          color: "#6B7280",
          label: "low",
        };
    }
  };

  // menentukan tampilan badge status
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          background: "#FEF3C7",
          color: "#D97706",
          label: "pending",
        };

      case "diproses":
        return {
          background: "#DBEAFE",
          color: "#2563EB",
          label: "diproses",
        };

      case "investigasi":
        return {
          background: "#E0E7FF",
          color: "#4F46E5",
          label: "investigasi",
        };

      case "ditindak":
        return {
          background: "#E0E7FF",
          color: "#4F46E5",
          label: "ditindak",
        };

      case "diverifikasi":
        return {
          background: "#E0E7FF",
          color: "#4F46E5",
          label: "diverifikasi",
        };

      case "tindak_lanjut":
        return {
          background: "#E0E7FF",
          color: "#4F46E5",
          label: "tindak_lanjut",
        };

      case "selesai":
        return {
          background: "#D1FAE5",
          color: "#059669",
          label: "selesai",
        };

      case "rejected":
        return {
          background: "#FEE2E2",
          color: "#DC2626",
          label: "rejected",
        };

      case "ditolak":
        return {
          background: "#FEE2E2",
          color: "#DC2626",
          label: "ditolak",
        };

      default:
        return {
          background: "#F3F4F6",
          color: "#6B7280",
          label: status,
        };
    }
  };

  // menghitung jumlah laporan pending
  const pendingCount = reports.filter(
    (r) => r.status === "pending"
  ).length;

  // menghitung jumlah laporan yang sedang diproses
  const processCount = reports.filter((r) =>
    [
      "diproses",
      "investigasi",
      "ditindak",
      "diverifikasi",
      "tindak_lanjut",
    ].includes(r.status)
  ).length;

  // menampilkan loading saat data masih diambil
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat kasus aktif...</p>
        </div>

        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerBadge}>User Panel</div>
          <h1 style={styles.title}>Kasus Aktif</h1>
          <p style={styles.subtitle}>Pantau laporan yang sedang diproses atau menunggu tindak lanjut</p>
        </div>
        <div style={styles.statsBadge}>
          <Shield size={16} />
          Total: {filteredReports.length}
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchBox}>
        <Search size={18} color="#9CA3AF" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan judul, kategori, atau lokasi..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={styles.searchInput}
        />
      </div>

      {/* Stats */}
      <div style={styles.statsCard}>
        <div style={styles.statsLeft}>
          <div style={styles.statsIcon}>
            <AlertCircle size={24} color="#D97706" />
          </div>
          <div>
            <p style={styles.statsLabel}>Total Kasus Aktif</p>
            <h2 style={styles.statsValue}>{filteredReports.length}</h2>
          </div>
        </div>
        <div style={styles.statsRight}>
          <span style={{ ...styles.statBadge, background: "#FEF3C7", color: "#D97706" }}>
            pending: {pendingCount}
          </span>
          <span style={{ ...styles.statBadge, background: "#DBEAFE", color: "#2563EB" }}>
            diproses: {processCount}
          </span>
        </div>
      </div>

      {/* List */}
      {filteredReports.length > 0 ? (
        <div style={styles.reportList}>
          {filteredReports.map((report) => {
            const statusStyle = getStatusStyle(report.status);
            const priorityStyle = getPriorityStyle(report.priority);
            const isHovered = hoveredId === report.id;
            
            return (
              <Link 
                key={report.id} 
                href={`/users/report/${report.id}`}
                style={styles.reportLink}
                onMouseEnter={() => setHoveredId(report.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={{
                  ...styles.reportCard,
                  borderColor: isHovered ? "#2563EB" : "#E5E7EB",
                  boxShadow: isHovered ? "0 8px 24px rgba(37, 99, 235, 0.1)" : "none",
                  transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                }}>
                  <div style={styles.reportHeader}>
                    <div style={styles.reportInfo}>
                      <h2 style={styles.reportTitle}>{report.title}</h2>
                      <p style={styles.reportCategory}>{report.category_name || "Kategori"}</p>
                    </div>
                    <div style={styles.reportBadges}>
                      <span style={{ ...styles.priorityBadge, backgroundColor: priorityStyle.bg, color: priorityStyle.color }}>
                        {priorityStyle.label}
                      </span>
                      <span style={{ ...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                  
                  <p style={styles.reportDescription}>
                    {report.description?.length > 150 ? report.description.substring(0, 150) + '...' : report.description}
                  </p>
                  
                  <div style={styles.reportFooter}>
                    <div style={styles.reportMeta}>
                      <span style={styles.metaItem}>
                        <MapPin size={14} />
                        {report.incident_location || "Lokasi tidak tersedia"}
                      </span>
                      <span style={styles.metaSeparator}>•</span>
                      <span style={styles.metaItem}>
                        <CalendarDays size={14} />
                        {report.incident_date ? new Date(report.incident_date).toLocaleDateString("id-ID") : "-"}
                      </span>
                      <span style={styles.metaSeparator}>•</span>
                      <span style={styles.metaItem}>
                        <Clock size={14} />
                        Dibuat: {new Date(report.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
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
          <FileQuestion size={64} color="#D1D5DB" />
          <p style={styles.emptyText}>Tidak Ada Kasus Aktif</p>
          <p style={styles.emptySubtext}>Semua laporan Anda sudah selesai atau belum ada laporan</p>
          <Link href="/users/report/new" style={styles.createBtn}>
            Buat Laporan Baru
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 24px",
    background: "#F9FAFB",
    minHeight: "100vh",
  },
  header: {
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
  searchBox: {
    background: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    padding: "12px 20px",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    width: "100%",
    outline: "none",
    border: "none",
    background: "transparent",
    fontSize: 14,
    color: "#111827",
  },
  statsCard: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    padding: "20px 24px",
    marginBottom: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
  },
  statsLeft: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  statsIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "#FEF3C7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statsLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  statsRight: {
    display: "flex",
    gap: 12,
  },
  statBadge: {
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  reportList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  reportLink: {
    textDecoration: "none",
  },
  reportCard: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    padding: "24px",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  reportHeader: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  reportCategory: {
    fontSize: 13,
    fontWeight: 600,
    color: "#2563EB",
    marginTop: 6,
    marginBottom: 0,
  },
  reportBadges: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  priorityBadge: {
    padding: "6px 16px",
    borderRadius: 40,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  statusBadge: {
    padding: "6px 16px",
    borderRadius: 40,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  reportDescription: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 1.6,
    margin: 0,
    marginBottom: 16,
  },
  reportFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  reportMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 13,
    color: "#6B7280",
  },
  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  metaSeparator: {
    color: "#D1D5DB",
  },
  arrowIcon: {
    transition: "all 0.2s",
    flexShrink: 0,
  },
  emptyState: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  createBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    background: "#2563EB",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
  },
};