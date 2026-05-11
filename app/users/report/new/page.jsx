// ============================================================
// app/users/report/new/page.jsx — CREATE REPORT USER
// TERHUBUNG API BACKEND POST /api/reports
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { Upload, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";

export default function CreateReportPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    incident_location: "",
    incident_date: "",
    bukti_foto: null,
  });

  const [previewName, setPreviewName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/reports/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      setPreviewName(files[0]?.name || "");
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);

    try {
      const body = new FormData();

      body.append("category_id", formData.category_id);
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("incident_location", formData.incident_location);
      body.append("incident_date", formData.incident_date);

      if (formData.bukti_foto) {
        body.append("bukti_foto", formData.bukti_foto);
      }

      const res = await fetch(`${API}/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat laporan");
      }

      alert("Laporan berhasil dikirim");
      router.push("/users");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/users"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#004b8d",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={18} />
          Kembali ke Dashboard
        </Link>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#001f3d",
            marginBottom: 8,
          }}
        >
          Buat Laporan Baru
        </h1>

        <p style={{ color: "#3a5068", fontSize: 14 }}>
          Isi detail laporan secara lengkap. Data Anda dijaga aman dan rahasia.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,75,141,0.06)",
            border: "1px solid rgba(0,75,141,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Category */}
          <div>
            <label style={labelStyle}>Kategori Laporan</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Judul Laporan</label>
            <input
              type="text"
              name="title"
              placeholder="Masukkan judul laporan"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Deskripsi Kejadian</label>
            <textarea
              name="description"
              placeholder="Jelaskan kejadian secara detail"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              style={{
                ...inputStyle,
                resize: "vertical",
                borderRadius: 16,
              }}
            />
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Lokasi Kejadian</label>
            <input
              type="text"
              name="incident_location"
              placeholder="Contoh: Jakarta Timur"
              value={formData.incident_location}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Tanggal Kejadian</label>
            <input
              type="date"
              name="incident_date"
              value={formData.incident_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Upload */}
          <div>
            <label style={labelStyle}>Bukti Foto (Opsional)</label>

            <label
              style={{
                border: "2px dashed #c8d6e5",
                borderRadius: 16,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                background: "#f8fbff",
              }}
            >
              <Upload size={28} color="#004b8d" />
              <span style={{ color: "#004b8d", fontWeight: 600 }}>
                Upload Bukti
              </span>
              <span style={{ fontSize: 12, color: "#3a5068" }}>
                {previewName || "Klik untuk memilih file"}
              </span>

              <input
                type="file"
                name="bukti_foto"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? "#9bbbd7" : "#004b8d",
              color: "#fff",
              border: "none",
              borderRadius: 40,
              padding: "14px 24px",
              fontWeight: 700,
              fontSize: 15,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Send size={18} />
            {submitting ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 700,
  color: "#001f3d",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d9e2ec",
  fontSize: 14,
  outline: "none",
  background: "#fff",
};