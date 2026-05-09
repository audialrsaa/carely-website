"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // =========================
  // SAFE FETCH (anti HTML error)
  // =========================
  const safeFetch = async (url, options = {}) => {
    const res = await fetch(url, options);

    const text = await res.text(); // ambil raw dulu

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.log("❌ BUKAN JSON RESPONSE:", text);
      throw new Error("Server tidak mengembalikan JSON (cek backend route)");
    }

    if (!res.ok) {
      throw new Error(data.message || "Request gagal");
    }

    return data;
  };

  // =========================
  // GET PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const data = await safeFetch(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await safeFetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          address: form.address,
        }),
      });

      setMessage("✅ Profil berhasil diupdate");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await safeFetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(password),
        }
      );

      setMessage("✅ Password berhasil diubah");

      setPassword({
        old_password: "",
        new_password: "",
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profile & Settings</h1>

      {message && (
        <div className="p-3 bg-gray-100 rounded text-sm">{message}</div>
      )}

      {/* ================= PROFILE FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Edit Profil</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full border p-2 rounded"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />

          <input
            type="email"
            disabled
            className="w-full border p-2 rounded bg-gray-100"
            value={form.email}
          />

          <input
            type="text"
            placeholder="No HP"
            className="w-full border p-2 rounded"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            placeholder="Alamat"
            className="w-full border p-2 rounded"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>

      {/* ================= PASSWORD FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Ganti Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Password Lama"
            className="w-full border p-2 rounded"
            value={password.old_password}
            onChange={(e) =>
              setPassword({
                ...password,
                old_password: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password Baru"
            className="w-full border p-2 rounded"
            value={password.new_password}
            onChange={(e) =>
              setPassword({
                ...password,
                new_password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Memproses..." : "Ganti Password"}
          </button>
        </form>
      </div>
    </div>
  );
}