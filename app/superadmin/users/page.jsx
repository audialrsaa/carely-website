"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, Users } from "lucide-react";

const API = "http://localhost:5000/api";

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (err) {
      console.error("Delete User Error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#001f3d" }}>
          Manajemen User
        </h1>
        <p style={{ color: "#64748b" }}>
          Kelola seluruh akun user Carely
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#fff",
          padding: "12px 16px",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
        }}
      >
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Cari user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
            fontSize: 14,
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Tanggal Daftar</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.full_name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.phone || "-"}</td>
                <td style={tdStyle}>
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={deleteBtn}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ padding: 30, textAlign: "center", color: "#64748b" }}>
            Tidak ada user ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: 16,
  fontSize: 13,
  color: "#475569",
};

const tdStyle = {
  padding: 16,
  borderTop: "1px solid #f1f5f9",
  fontSize: 14,
};

const deleteBtn = {
  border: "none",
  background: "#fef2f2",
  color: "#dc2626",
  padding: 8,
  borderRadius: 10,
  cursor: "pointer",
};