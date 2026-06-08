"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, User, Mail, Phone, Lock, Calendar, AlertCircle, X } from "lucide-react";
import Swal from "sweetalert2";

const API = "http://localhost:5000/api";

export default function SuperAdminAdminsPage() {

  // menyimpan daftar admin
  const [admins, setAdmins] = useState([]);

  // menyimpan status loading saat mengambil data admin
  const [loading, setLoading] = useState(true);

  // menyimpan status loading saat proses tambah admin
  const [submitting, setSubmitting] = useState(false);

  // menyimpan status tampil/sembunyi modal
  const [showModal, setShowModal] = useState(false);

  // menyimpan data form admin baru
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });

  // fetch admins
  const fetchAdmins = async () => {
    try {

      // mengambil token login
      const token = localStorage.getItem("token");

      // request data admin ke backend
      const res = await fetch(`${API}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // mengubah response menjadi json
      const data = await res.json();

      // menyimpan data admin ke state
      setAdmins(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      // menampilkan error di console
      console.error(err);

      // menampilkan alert gagal
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data admin",
      });

    } finally {

      // menghentikan loading
      setLoading(false);
    }
  };
  
  // reset form
  // mengosongkan seluruh field form admin
  
  const resetForm = () => {

    setForm({
      full_name: "",
      email: "",
      password: "",
      phone: "",
    });
  };

  // handle open modal
  // membuka modal tambah admin
  const handleOpenModal = () => {

    // reset form terlebih dahulu
    resetForm();

    // tampilkan modal
    setShowModal(true);
  };

  // handle close modal
  // menutup modal tambah admin
  const handleCloseModal = () => {

    // sembunyikan modal
    setShowModal(false);

    // kosongkan form
    resetForm();
  };

  // create admin
  const createAdmin = async () => {

    // validasi seluruh field wajib diisi
    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phone.trim()
    ) {

      Swal.fire({
        icon: "warning",
        title: "Field wajib diisi",
        text: "Semua field harus diisi",
      });

      return;
    }

    // aktifkan loading submit
    setSubmitting(true);

    try {

      // mengambil token login
      const token = localStorage.getItem("token");

      // mengirim data admin ke backend
      const res = await fetch(`${API}/admin/admins`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      // mengubah response menjadi json
      const data = await res.json();

      // jika request gagal
      if (!res.ok) {

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            data.message ||
            "Gagal membuat admin",
        });

        return;
      }

      // notifikasi berhasil
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Admin berhasil dibuat",
        timer: 1800,
        showConfirmButton: false,
      });

      // tutup modal
      handleCloseModal();

      // refresh data admin
      fetchAdmins();

    } catch (err) {

      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Terjadi kesalahan",
      });

    } finally {

      // matikan loading submit
      setSubmitting(false);
    }
  };

  // delete admin
  const deleteAdmin = async (
    id,
    name
  ) => {

    // konfirmasi hapus admin
    const result = await Swal.fire({
      title: "Hapus admin?",
      html: `Admin <strong>${name}</strong> akan dihapus permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    // jika batal
    if (!result.isConfirmed) return;

    try {

      // mengambil token login
      const token = localStorage.getItem("token");

      // request hapus admin ke backend
      const res = await fetch(
        `${API}/admin/admins/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // mengubah response menjadi json
      const data = await res.json();

      // jika gagal
      if (!res.ok) {

        return Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            data.message ||
            "Gagal menghapus admin",
        });
      }

      // notifikasi berhasil
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Admin berhasil dihapus",
        timer: 1800,
        showConfirmButton: false,
      });

      // refresh data admin
      fetchAdmins();

    } catch (err) {

      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Terjadi kesalahan",
      });
    }
  };

  // mengambil data admin saat halaman pertama dibuka
  useEffect(() => {

    fetchAdmins();

  }, []);

  // loading state
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <p style={styles.loadingText}>
            memuat data admin...
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
          <h1 style={styles.title}>Manajemen Admin</h1>
          <p style={styles.subtitle}>Kelola akun admin yang memiliki akses ke sistem</p>
        </div>
        <button onClick={handleOpenModal} style={styles.addButton}>
          <Plus size={18} />
          Tambah Admin
        </button>
      </div>

      {/* Stats Card */}
      <div style={styles.statsCard}>
        <div style={styles.statsIcon}>
          <User size={24} color="#2563EB" />
        </div>
        <div>
          <p style={styles.statsLabel}>Total Admin</p>
          <h2 style={styles.statsValue}>{admins.length}</h2>
        </div>
      </div>

      {/* Table Card */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>Daftar Admin</h3>
          <p style={styles.tableSubtitle}>Menampilkan {admins.length} admin terdaftar</p>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Nomor HP</th>
                <th style={styles.th}>Tanggal Dibuat</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <tr key={admin.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>
                      <div style={styles.adminName}>
                        <div style={styles.avatar}>
                          {admin.full_name?.charAt(0) || "A"}
                        </div>
                        <span>{admin.full_name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{admin.email}</td>
                    <td style={styles.td}>{admin.phone || "-"}</td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>
                        <Calendar size={14} color="#9CA3AF" />
                        {new Date(admin.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => deleteAdmin(admin.id, admin.full_name)}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={styles.emptyState}>
                    <AlertCircle size={48} color="#D1D5DB" />
                    <p style={styles.emptyText}>Belum ada admin</p>
                    <p style={styles.emptySubtext}>Klik tombol "Tambah Admin" untuk menambahkan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Tambah Admin Baru</h2>
              <button onClick={handleCloseModal} style={styles.modalClose}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <div style={styles.inputWrapper}>
                  <User size={18} color="#9CA3AF" />
                  <input
                    placeholder="Masukkan nama lengkap"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="#9CA3AF" />
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#9CA3AF" />
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Nomor HP</label>
                <div style={styles.inputWrapper}>
                  <Phone size={18} color="#9CA3AF" />
                  <input
                    placeholder="Masukkan nomor HP"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={handleCloseModal} style={styles.cancelBtn}>
                Batal
              </button>
              <button onClick={createAdmin} disabled={submitting} style={styles.saveBtn}>
                {submitting ? (
                  <>
                    <div style={styles.btnSpinner}></div>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Admin"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "20px 24px",
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statsLabel: {
    fontSize: 13,
    color: "#6B7280",
    margin: 0,
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 800,
    color: "#111827",
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
    minWidth: 600,
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
  adminName: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
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
    padding: "8px 12px",
    background: "#FEE2E2",
    color: "#DC2626",
    border: "none",
    borderRadius: 8,
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
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#fff",
    borderRadius: 24,
    width: "90%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  modalClose: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "transparent",
    border: "none",
    color: "#6B7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  modalBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    background: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    transition: "all 0.2s",
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 14,
    fontFamily: "'Inter', system-ui",
  },
  modalFooter: {
    display: "flex",
    gap: 12,
    padding: "20px 24px",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#E5E7EB",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px 16px",
    background: "#F3F4F6",
    color: "#6B7280",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  saveBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnSpinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};