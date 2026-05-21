"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";

const API = "http://localhost:5000/api";

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });

  // =====================================================
  // FETCH ADMINS
  // =====================================================
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data admin",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE ADMIN
  // =====================================================
  const createAdmin = async () => {
    // VALIDASI
    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.phone.trim()
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Field wajib diisi",
        text: "Semua field harus diisi",
      });
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // ERROR BACKEND
      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal membuat admin",
        });
      }

      // SUCCESS
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Admin berhasil dibuat",
        timer: 1800,
        showConfirmButton: false,
      });

      // RESET FORM
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
      });

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

  // =====================================================
  // DELETE ADMIN
  // =====================================================
  const deleteAdmin = async (id) => {
    const result = await Swal.fire({
      title: "Hapus admin?",
      text: "Admin akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/admins/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Gagal",
          text: data.message || "Gagal menghapus admin",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Admin berhasil dihapus",
        timer: 1800,
        showConfirmButton: false,
      });

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

  // =====================================================
  // USE EFFECT
  // =====================================================
  useEffect(() => {
    fetchAdmins();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinner}></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* HEADER */}
      <div>
        <h1 style={titleStyle}>
          Manajemen Admin
        </h1>

        <p style={subtitleStyle}>
          Tambah dan kelola akun admin Carely
        </p>
      </div>

      {/* FORM */}
      <div style={formCard}>
        <input
          placeholder="Nama Lengkap"
          value={form.full_name}
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="Nomor HP"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          style={inputStyle}
        />

        <button
          onClick={createAdmin}
          style={createBtn}
        >
          <Plus size={18} />
          Tambah Admin
        </button>
      </div>

      {/* TABLE */}
      <div style={tableCard}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Tanggal Dibuat</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td style={tdStyle}>
                    {admin.full_name}
                  </td>

                  <td style={tdStyle}>
                    {admin.email}
                  </td>

                  <td style={tdStyle}>
                    {admin.phone || "-"}
                  </td>

                  <td style={tdStyle}>
                    {new Date(
                      admin.created_at
                    ).toLocaleDateString("id-ID")}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        deleteAdmin(admin.id)
                      }
                      style={deleteBtn}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  Belum ada admin
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const loadingStyle = {
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const spinner = {
  width: 40,
  height: 40,
  border: "4px solid #cbd5e1",
  borderTop: "4px solid #004b8d",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const titleStyle = {
  fontSize: 30,
  fontWeight: 800,
  color: "#001f3d",
};

const subtitleStyle = {
  color: "#64748b",
  marginTop: 6,
};

const formCard = {
  background: "#fff",
  padding: 24,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
};

const inputStyle = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: 14,
};

const createBtn = {
  gridColumn: "span 2",
  padding: 16,
  borderRadius: 14,
  border: "none",
  background: "#004b8d",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const tableCard = {
  background: "#fff",
  borderRadius: 24,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadStyle = {
  background: "#f8fafc",
};

const thStyle = {
  textAlign: "left",
  padding: 18,
  fontSize: 13,
  color: "#475569",
};

const tdStyle = {
  padding: 18,
  borderTop: "1px solid #f1f5f9",
};

const deleteBtn = {
  border: "none",
  background: "#fef2f2",
  color: "#dc2626",
  padding: 10,
  borderRadius: 10,
  cursor: "pointer",
};