// app/superadmin/audit/page.jsx
"use client";

import { useEffect, useState } from "react";
import { 
  ClipboardList, 
  History, 
  UserCheck, 
  Clock, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  Filter,
  Calendar,
  ArrowUpDown
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function SuperAdminAuditPage() {

  // menyimpan seluruh data audit log
  const [logs, setLogs] = useState([]);

  // menyimpan status loading halaman
  const [loading, setLoading] = useState(true);

  // menyimpan keyword pencarian
  const [search, setSearch] = useState("");

  // menyimpan filter role
  const [filterRole, setFilterRole] = useState("all");

  // mengambil data audit log saat halaman dibuka
  useEffect(() => {

    const fetchLogs = async () => {
      try {

        // mengambil token login
        const token = localStorage.getItem("token");

        // request audit log ke backend
        const res = await fetch(
          `${API}/admin/audit-logs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // mengubah response menjadi json
        const data = await res.json();

        // menyimpan audit log ke state
        setLogs(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        // menampilkan error di console
        console.error(err);

      } finally {

        // menghentikan loading
        setLoading(false);
      }
    };

    fetchLogs();

  }, []);

  // get status style
  const getStatusStyle = (status) => {

    const map = {

      pending: {
        bg: "#FEF3C7",
        color: "#D97706",
      },

      diproses: {
        bg: "#DBEAFE",
        color: "#2563EB",
      },

      investigasi: {
        bg: "#E0E7FF",
        color: "#4F46E5",
      },

      ditindak: {
        bg: "#E0E7FF",
        color: "#4F46E5",
      },

      diverifikasi: {
        bg: "#DBEAFE",
        color: "#2563EB",
      },

      selesai: {
        bg: "#D1FAE5",
        color: "#059669",
      },

      ditolak: {
        bg: "#FEE2E2",
        color: "#DC2626",
      },

      rejected: {
        bg: "#FEE2E2",
        color: "#DC2626",
      },
    };

    // mengembalikan warna sesuai status
    return (
      map[status] || {
        bg: "#F3F4F6",
        color: "#6B7280",
      }
    );
  };

  // filtered logs
  // melakukan pencarian dan filter data audit log
  const filteredLogs = logs.filter((log) => {

    // filter berdasarkan keyword pencarian
    const matchesSearch =
      log.report_title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      log.changed_by_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      log.notes
        ?.toLowerCase()
        .includes(search.toLowerCase());

    // filter berdasarkan role
    const matchesRole =
      filterRole === "all" ||
      log.changer_role === filterRole;

    // hanya tampilkan data yang sesuai filter
    return (
      matchesSearch &&
      matchesRole
    );
  });

  // ======================================================
  // unique roles
  // mengambil daftar role unik dari audit log
  // untuk kebutuhan dropdown filter
  // ======================================================
  const uniqueRoles = [
    ...new Set(
      logs
        .map(
          (log) => log.changer_role
        )
        .filter(Boolean)
    ),
  ];

  // ======================================================
  // loading state
  // menampilkan loading saat data belum selesai dimuat
  // ======================================================
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <p style={styles.loadingText}>
            memuat audit log...
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
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerBadge}>Super Admin Dashboard</div>
          <h1 style={styles.title}>Audit Log</h1>
          <p style={styles.subtitle}>Riwayat perubahan status laporan oleh admin dan superadmin</p>
        </div>
        <div style={styles.statsBadge}>
          <History size={16} />
          Total: {logs.length}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#EFF6FF", color: "#2563EB" }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Total Perubahan</p>
            <h3 style={styles.statValue}>{logs.length}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#F3E8FF", color: "#9333EA" }}>
            <UserCheck size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Pelaku Perubahan</p>
            <h3 style={styles.statValue}>{uniqueRoles.length} Role</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#D1FAE5", color: "#059669" }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Perubahan Terakhir</p>
            <h3 style={styles.statValue}>
              {logs.length > 0 ? 
                new Date(logs[0]?.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : 
                "-"}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Cari berdasarkan laporan, pelaku, atau catatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterTabs}>
          <button
            onClick={() => setFilterRole("all")}
            style={{
              ...styles.filterTab,
              ...(filterRole === "all" ? styles.filterTabActive : {}),
            }}
          >
            Semua
          </button>
          {uniqueRoles.map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              style={{
                ...styles.filterTab,
                ...(filterRole === role ? styles.filterTabActive : {}),
              }}
            >
              {role === "superadmin" ? "Super Admin" : role}
            </button>
          ))}
        </div>

        <p style={styles.filterResult}>
          Menampilkan {filteredLogs.length} dari {logs.length} log
        </p>
      </div>

      {/* Table Card */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Riwayat Perubahan Status</h3>
          <p style={styles.tableSubtitle}>Semua perubahan status laporan tercatat di sini</p>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Laporan</th>
                <th style={styles.th}>Status Lama</th>
                <th style={styles.th}>Status Baru</th>
                <th style={styles.th}>Diubah Oleh</th>
                <th style={styles.th}>Catatan</th>
                <th style={styles.th}>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => {
                  const oldStatusStyle = getStatusStyle(log.old_status);
                  const newStatusStyle = getStatusStyle(log.new_status);
                  
                  return (
                    <tr key={log.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>
                        <div style={styles.reportTitle}>
                          <ClipboardList size={14} color="#9CA3AF" />
                          <span>{log.report_title || "-"}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {log.old_status ? (
                          <span style={{ ...styles.statusBadge, backgroundColor: oldStatusStyle.bg, color: oldStatusStyle.color }}>
                            {log.old_status}
                          </span>
                        ) : (
                          <span style={styles.noStatus}>-</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, backgroundColor: newStatusStyle.bg, color: newStatusStyle.color }}>
                          {log.new_status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.userInfo}>
                          <div style={styles.userAvatar}>
                            {log.changed_by_name?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p style={styles.userName}>{log.changed_by_name || "System"}</p>
                            <p style={styles.userRole}>{log.changer_role || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {log.notes ? (
                          <div style={styles.notesCell}>
                            <span>{log.notes}</span>
                          </div>
                        ) : (
                          <span style={styles.noNotes}>-</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          <Calendar size={14} color="#9CA3AF" />
                          <span>{new Date(log.created_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={styles.emptyState}>
                    <AlertCircle size={48} color="#D1D5DB" />
                    <p style={styles.emptyText}>Tidak ada audit log</p>
                    <p style={styles.emptySubtext}>
                      {search || filterRole !== "all" 
                        ? "Coba dengan filter yang berbeda" 
                        : "Belum ada perubahan status laporan"}
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
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
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
    fontSize: 24,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  filterSection: {
    marginBottom: 24,
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    fontFamily: "'Inter', system-ui",
    background: "transparent",
  },
  filterTabs: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  filterTab: {
    padding: "6px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    background: "#fff",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    color: "#6B7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterTabActive: {
    background: "#2563EB",
    color: "#fff",
    borderColor: "#2563EB",
  },
  filterResult: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
  },
  tableCard: {
    background: "#fff",
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 4,
  },
  tableSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
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
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  noStatus: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  userRole: {
    fontSize: 11,
    color: "#6B7280",
    margin: 0,
  },
  notesCell: {
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noNotes: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#6B7280",
    whiteSpace: "nowrap",
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