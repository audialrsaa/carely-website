// app/users/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Lock, Edit2, Save, X, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp, Key } from "lucide-react";
import Swal from "sweetalert2";

const API = "http://localhost:5000/api";

export default function ProfilePage() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "" });
  const [password, setPassword] = useState({ old_password: "", new_password: "" });
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", address: "" });
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
        throw new Error("Gagal mengambil data profil");
      }

      const data = await res.json();
      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
      setEditForm({
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: editForm.full_name,
          phone: editForm.phone,
          address: editForm.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal update profil");
      }

      setForm({ ...form, full_name: editForm.full_name, phone: editForm.phone, address: editForm.address });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil berhasil diupdate",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsEditMode(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password.old_password || !password.new_password) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Password lama dan baru harus diisi",
      });
      return;
    }

    if (password.new_password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Password baru minimal 6 karakter",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(password),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengubah password");
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Password berhasil diubah",
        timer: 1500,
        showConfirmButton: false,
      });
      setPassword({ old_password: "", new_password: "" });
      setShowPasswordForm(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: form.full_name,
      phone: form.phone,
      address: form.address,
    });
    setIsEditMode(false);
  };

  if (fetchLoading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat profil...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Profil Saya</h1>
          <p style={styles.subtitle}>Kelola informasi profil dan keamanan akun Anda</p>
        </div>
      </div>

      {/* Profile Card */}
      <div style={styles.card}>
        {/* Cover with Avatar */}
        <div style={styles.coverSection}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {form.full_name ? form.full_name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div style={styles.avatarInfo}>
              <h2 style={styles.avatarName}>{form.full_name || "Pengguna"}</h2>
              <p style={styles.avatarEmail}>{form.email || "Email belum diisi"}</p>
            </div>
          </div>
          {!isEditMode && (
            <button onClick={() => setIsEditMode(true)} style={styles.editBtn}>
              <Edit2 size={16} />
              Edit Profil
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div style={styles.infoSection}>
          {!isEditMode ? (
            // View Mode
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><User size={18} /></div>
                <div>
                  <p style={styles.infoLabel}>Nama Lengkap</p>
                  <p style={styles.infoValue}>{form.full_name || "-"}</p>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><Mail size={18} /></div>
                <div>
                  <p style={styles.infoLabel}>Email</p>
                  <p style={styles.infoValue}>{form.email || "-"}</p>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><Phone size={18} /></div>
                <div>
                  <p style={styles.infoLabel}>No Handphone</p>
                  <p style={styles.infoValue}>{form.phone || "-"}</p>
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}><MapPin size={18} /></div>
                <div>
                  <p style={styles.infoLabel}>Alamat</p>
                  <p style={styles.infoValue}>{form.address || "-"}</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleUpdate} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <input
                  type="text"
                  style={styles.input}
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>No Handphone</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Masukkan nomor handphone"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Alamat</label>
                <textarea
                  style={styles.textarea}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                />
              </div>
              <div style={styles.formActions}>
                <button type="submit" disabled={loading} style={styles.saveBtn}>
                  {loading ? <div style={styles.btnSpinner}></div> : <Save size={16} />}
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button type="button" onClick={handleCancelEdit} style={styles.cancelBtn}>
                  <X size={16} />
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password Section - Toggle Button */}
      <div style={styles.card}>
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          style={styles.passwordToggle}
        >
          <div style={styles.passwordHeader}>
            <div style={styles.passwordIcon}>
              <Key size={20} color="#2563EB" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={styles.passwordTitle}>Ganti Password</h2>
              <p style={styles.passwordDesc}>Klik untuk mengganti password akun Anda</p>
            </div>
          </div>
          {showPasswordForm ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
        </button>

        {showPasswordForm && (
          <div style={styles.passwordFormContainer}>
            <form onSubmit={handleChangePassword} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password Lama</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Masukkan password lama"
                  value={password.old_password}
                  onChange={(e) => setPassword({ ...password, old_password: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password Baru</label>
                <input
                  type="password"
                  style={styles.input}
                  placeholder="Masukkan password baru (minimal 6 karakter)"
                  value={password.new_password}
                  onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                />
              </div>
              <button type="submit" disabled={loading} style={styles.updateBtn}>
                {loading ? <div style={styles.btnSpinner}></div> : <Lock size={16} />}
                {loading ? "Memproses..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
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
    marginBottom: 24,
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
  card: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 24,
  },
  coverSection: {
    background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)",
    padding: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 20,
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
  },
  avatar: {
    width: 80,
    height: 80,
    background: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 700,
    color: "#2563EB",
  },
  avatarInfo: {
    color: "#fff",
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    marginBottom: 4,
  },
  avatarEmail: {
    fontSize: 13,
    opacity: 0.8,
    margin: 0,
  },
  editBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#fff",
    color: "#2563EB",
    border: "none",
    borderRadius: 40,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  infoSection: {
    padding: "24px 32px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  infoItem: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563EB",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 14,
    resize: "vertical",
    outline: "none",
    fontFamily: "'Inter', system-ui",
  },
  formActions: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    background: "#F3F4F6",
    color: "#6B7280",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
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
  passwordToggle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  passwordHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  passwordIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  passwordDesc: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
    marginTop: 2,
  },
  passwordFormContainer: {
    padding: "0 24px 24px 24px",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#E5E7EB",
  },
  updateBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 24px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};