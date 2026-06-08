// app/users/history/page.jsx — MyReportsPage
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Loader2, AlertCircle, FileQuestion, ChevronRight, Calendar, User } from "lucide-react";

const API = "http://localhost:5000/api";

export default function MyReportsPage() {

  // state untuk menyimpan daftar laporan milik user
  const [reports, setReports] = useState([]);

  // state loading saat data sedang diambil
  const [loading, setLoading] = useState(true);

  // state untuk menyimpan pesan error
  const [error, setError] = useState("");

  // state untuk menyimpan id card yang sedang dihover
  const [hoveredId, setHoveredId] = useState(null);

  // mengambil seluruh laporan milik user dari backend
  const fetchReports = async () => {
    try {

      // mengaktifkan loading
      setLoading(true);

      // mengambil token login dari localStorage
      const token = localStorage.getItem("token");

      // jika token tidak ada maka redirect ke login
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // request data laporan milik user
      const res = await fetch(`${API}/reports/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // jika request gagal
      if (!res.ok) {
        throw new Error("Gagal mengambil data laporan");
      }

      // mengubah response menjadi json
      const data = await res.json();

      // menyimpan data laporan ke state
      setReports(Array.isArray(data) ? data : []);

    } catch (err) {

      // menyimpan pesan error
      setError(err.message);

    } finally {

      // mematikan loading
      setLoading(false);

    }
  };

  // menjalankan fetchReports saat halaman pertama kali dibuka
  useEffect(() => {
    fetchReports();
  }, []);

  // menentukan warna dan label berdasarkan status laporan
  const getStatusStyle = (status) => {
    const map = {
      pending: {
        bg: "#FEF3C7",
        color: "#D97706",
        label: "pending",
      },

      diproses: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "diproses",
      },

      diverifikasi: {
        bg: "#E0E7FF",
        color: "#4F46E5",
        label: "diverifikasi",
      },

      tindak_lanjut: {
        bg: "#E0E7FF",
        color: "#4F46E5",
        label: "tindak_lanjut",
      },

      selesai: {
        bg: "#D1FAE5",
        color: "#059669",
        label: "selesai",
      },

      rejected: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "rejected",
      },

      ditolak: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "ditolak",
      },
    };

    // mengembalikan style sesuai status
    return map[status] || {
      bg: "#F3F4F6",
      color: "#6B7280",
      label: status,
    };
  };

  // menentukan warna dan label berdasarkan prioritas laporan
  const getPriorityStyle = (priority) => {
    const map = {
      emergency: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "emergency",
      },

      high: {
        bg: "#FEF3C7",
        color: "#D97706",
        label: "high",
      },

      medium: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "medium",
      },

      low: {
        bg: "#F3F4F6",
        color: "#6B7280",
        label: "low",
      },
    };

    // mengembalikan style prioritas
    return map[priority] || map.low;
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Riwayat Laporan Saya</h1>
          <p style={styles.subtitle}>Semua laporan yang pernah Anda buat</p>
        </div>
        <div style={styles.statsBadge}>
          <FileText size={16} />
          Total: {reports.length}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingWrap}>
          <div style={styles.loadingCard}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Memuat laporan...</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} color="#DC2626" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && !error && (
        <div style={styles.emptyState}>
          <FileQuestion size={64} color="#D1D5DB" />
          <p style={styles.emptyText}>Belum ada laporan</p>
          <p style={styles.emptySubtext}>Mulai buat laporan pertama Anda</p>
          <Link href="/users/report/new" style={styles.createBtn}>
            Buat Laporan Baru
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Report List */}
      {!loading && reports.length > 0 && (
        <div style={styles.reportList}>
          {reports.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            const priorityStyle = getPriorityStyle(item.priority);
            const isHovered = hoveredId === item.id;
            
            return (
              <Link
                key={item.id}
                href={`/users/report/${item.id}`}
                style={styles.reportLink}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={{
                  ...styles.reportCard,
                  borderColor: isHovered ? "#2563EB" : "#E5E7EB",
                  boxShadow: isHovered ? "0 8px 24px rgba(37, 99, 235, 0.1)" : "none",
                  transform: isHovered ? "translateX(4px)" : "translateX(0)",
                }}>
                  {/* Left Section - Icon & Info */}
                  <div style={styles.reportLeft}>
                    <div style={styles.reportIcon}>
                      <FileText size={20} color="#6B7280" />
                    </div>
                    <div style={styles.reportInfo}>
                      <h2 style={styles.reportTitle}>{item.title}</h2>
                      <div style={styles.reportMeta}>
                        <span style={styles.metaItem}>
                          <User size={12} />
                          {item.category_name || "Kategori"}
                        </span>
                        <span style={styles.metaSeparator}>•</span>
                        <span style={styles.metaItem}>
                          <Calendar size={12} />
                          {new Date(item.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Badges */}
                  <div style={styles.reportRight}>
                    <span style={{ ...styles.priorityBadge, backgroundColor: priorityStyle.bg, color: priorityStyle.color }}>
                      {priorityStyle.label}
                    </span>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "80px 0",
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
    marginTop: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  errorBox: {
    background: "#FEE2E2",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#FCA5A5",
    borderRadius: 12,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 600,
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
  reportList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  reportLink: {
    textDecoration: "none",
  },
  reportCard: {
    width: "100%",
    boxSizing: "border-box",
    background: "#fff",
    padding: "16px 20px",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
  },
  reportLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reportInfo: {
    flex: 1,
    minWidth: 0,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 6,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  reportMeta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  metaSeparator: {
    fontSize: 12,
    color: "#D1D5DB",
  },
  reportRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  priorityBadge: {
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  statusBadge: {
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  arrowIcon: {
    transition: "all 0.2s",
    flexShrink: 0,
  },
};