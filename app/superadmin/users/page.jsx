// app/superadmin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, Users, Loader2, UserCheck, Calendar, Mail, Phone, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

const API = "http://localhost:5000/api";

export default function SuperAdminUsersPage() {
  // state untuk menyimpan data semua user
  const [users, setUsers] = useState([]);

  // state untuk menyimpan keyword pencarian
  const [search, setSearch] = useState("");

  // state loading saat data sedang diambil
  const [loading, setLoading] = useState(true);

  // mengambil seluruh data user dari backend
  const fetchUsers = async () => {
    try {
      // mengambil token login dari localStorage
      const token = localStorage.getItem("token");

      // request data user ke endpoint backend
      const res = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // mengubah response menjadi json
      const data = await res.json();

      // menyimpan data user ke state
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      // menampilkan error di console
      console.error("Fetch Users Error:", err);

      // menampilkan popup jika gagal mengambil data
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data user",
      });
    } finally {
      // menghentikan loading
      setLoading(false);
    }
  };

  // menghapus user berdasarkan id
  const deleteUser = async (id, name) => {

    // popup konfirmasi sebelum user dihapus
    const result = await Swal.fire({
      title: "Hapus user?",
      html: `User <strong>${name}</strong> akan dihapus permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    // jika batal maka fungsi berhenti
    if (!result.isConfirmed) return;

    try {
      // mengambil token login
      const token = localStorage.getItem("token");

      // request delete user ke backend
      const res = await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // mengambil response json
      const data = await res.json();

      // jika gagal hapus
      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal menghapus user",
        });
      }

      // popup berhasil hapus user
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "User berhasil dihapus",
        timer: 1800,
        showConfirmButton: false,
      });

      // refresh data user setelah penghapusan
      fetchUsers();
    } catch (err) {
      // menampilkan error di console
      console.error("Delete User Error:", err);

      // popup jika terjadi error server
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Terjadi kesalahan",
      });
    }
  };

  // menjalankan fetchUsers saat halaman pertama kali dibuka
  useEffect(() => {
    fetchUsers();
  }, []);

  // filter user berdasarkan nama atau email
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  // tampilan loading saat data masih dimuat
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          {/* teks loading */}
          <p style={styles.loadingText}>
            Memuat data user...
          </p>
        </div>

        {/* animasi spinner */}
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
          <div style={styles.headerBadge}>Super Admin Dashboard</div>
          <h1 style={styles.title}>Manajemen User</h1>
          <p style={styles.subtitle}>Kelola seluruh akun user yang terdaftar di Carely</p>
        </div>
        <div style={styles.statsBadge}>
          <Users size={16} />
          Total: {users.length}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#EFF6FF", color: "#2563EB" }}>
            <Users size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>Total User</p>
            <h3 style={styles.statValue}>{users.length}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#D1FAE5", color: "#059669" }}>
            <UserCheck size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>User Aktif</p>
            <h3 style={styles.statValue}>{users.filter(u => u.is_active !== false).length}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#FEF3C7", color: "#D97706" }}>
            <Calendar size={24} />
          </div>
          <div>
            <p style={styles.statLabel}>User Baru (Bulan Ini)</p>
            <h3 style={styles.statValue}>
              {users.filter(u => {
                const created = new Date(u.created_at);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div style={styles.searchSection}>
        <div style={styles.searchBox}>
          <Search size={20} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <p style={styles.searchResult}>
          Menampilkan {filteredUsers.length} dari {users.length} user
        </p>
      </div>

      {/* Table Card */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Daftar User</h3>
          <p style={styles.tableSubtitle}>Semua user yang terdaftar di platform Carely</p>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Nomor HP</th>
                <th style={styles.th}>Tanggal Daftar</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>
                      <div style={styles.userName}>
                        <div style={styles.avatar}>
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <span style={styles.name}>{user.full_name || "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.emailCell}>
                        <Mail size={14} color="#9CA3AF" />
                        {user.email}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.phoneCell}>
                        <Phone size={14} color="#9CA3AF" />
                        {user.phone || "-"}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>
                        <Calendar size={14} color="#9CA3AF" />
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => deleteUser(user.id, user.full_name || user.email)}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={16} />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={styles.emptyState}>
                    <AlertCircle size={48} color="#D1D5DB" />
                    <p style={styles.emptyText}>Tidak ada user ditemukan</p>
                    <p style={styles.emptySubtext}>
                      {search ? "Coba dengan kata kunci yang berbeda" : "Belum ada user yang terdaftar"}
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
    maxWidth: 1200,
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
  searchSection: {
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
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    fontFamily: "'Inter', system-ui",
    background: "transparent",
  },
  searchResult: {
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
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 700,
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
  userName: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 0,
  },
  name: {
    fontWeight: 500,
    color: "#111827",
  },
  emailCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#4B5563",
  },
  phoneCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#4B5563",
  },
  dateCell: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  deleteBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    background: "#FEE2E2",
    color: "#DC2626",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
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