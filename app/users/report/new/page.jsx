"use client";

import { useEffect, useState } from "react";
import { Upload, ArrowLeft, Send, Image, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";

export default function CreateReportPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incident_location: "",
    incident_date: "",
    bukti_foto: null,
  });

  const [previewName, setPreviewName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

const handleChange = (e) => {
  const { name, value, files } = e.target;

  // Input file
  if (files && files.length > 0) {
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setUploadStatus({
        type: "error",
        message: "File harus berupa gambar",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "Ukuran file maksimal 5MB",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    setPreviewName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadStatus({ type: "", message: "" });

    return;
  }

  // Input text, textarea, date
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setSubmitting(true);
    setUploadStatus({ type: "", message: "" });

    try {
      const body = new FormData();

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

      setUploadStatus({ type: "success", message: "Laporan berhasil dikirim" });
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    } catch (err) {
      setUploadStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={40} style={{ color: "#004b8d", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 12, color: "#3a5068" }}>Memuat kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Link
          href="/users"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#004b8d",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: 20,
            transition: "gap 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.gap = "12px"}
          onMouseLeave={(e) => e.currentTarget.style.gap = "8px"}
        >
          <ArrowLeft size={18} />
          Kembali ke Dashboard
        </Link>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#001f3d",
            marginBottom: 10,
            fontFamily: "'Plus Jakarta Sans', system-ui",
          }}
        >
          Buat Laporan Baru
        </h1>

        <p style={{ color: "#3a5068", fontSize: 14, lineHeight: 1.5 }}>
          Isi detail laporan secara lengkap. Data Anda dijaga aman dan rahasia.
        </p>
      </div>

      {/* Status Message */}
      {uploadStatus.message && (
        <div style={{ 
          padding: "12px 18px", 
          borderRadius: 12, 
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: uploadStatus.type === "success" ? "#e6f9f4" : "#fde8e8",
          border: `1px solid ${uploadStatus.type === "success" ? "rgba(10,124,92,0.3)" : "rgba(192,57,43,0.2)"}`,
          color: uploadStatus.type === "success" ? "#0a7c5c" : "#c0392b"
        }}>
          {uploadStatus.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {uploadStatus.message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 4px 20px rgba(0,75,141,0.08)",
            border: "1px solid rgba(0,75,141,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >

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
                fontFamily: "'Inter', system-ui",
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

            <div
              style={{
                border: "2px dashed #c8d6e5",
                borderRadius: 16,
                padding: previewUrl ? 16 : 32,
                textAlign: "center",
                background: "#fafcff",
                transition: "border-color 0.2s",
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#004b8d"; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = "#c8d6e5"; }}
            >
              {previewUrl ? (
                <div>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: 200, 
                      objectFit: "contain",
                      borderRadius: 12,
                      marginBottom: 12
                    }} 
                  />
                  <p style={{ fontSize: 13, color: "#3a5068", marginBottom: 12 }}>
                    {previewName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, bukti_foto: null }));
                      setPreviewName("");
                      setPreviewUrl("");
                    }}
                    style={{
                      background: "#fde8e8",
                      border: "none",
                      padding: "6px 16px",
                      borderRadius: 20,
                      fontSize: 12,
                      color: "#c0392b",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label style={{ cursor: "pointer", display: "block" }}>
                  <Upload size={32} color="#004b8d" style={{ margin: "0 auto 12px" }} />
                  <span style={{ color: "#004b8d", fontWeight: 600, display: "block", marginBottom: 6 }}>
                    Upload Bukti
                  </span>
                  <span style={{ fontSize: 12, color: "#3a5068" }}>
                    Klik atau drag & drop file gambar
                  </span>
                  <span style={{ fontSize: 11, color: "#8a9bb0", display: "block", marginTop: 6 }}>
                    Maksimal 5MB (JPG, PNG)
                  </span>
                  <input
                    type="file"
                    name="bukti_foto"
                    accept="image/*"
                    onChange={handleChange}
                    hidden
                  />
                </label>
              )}
            </div>
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
              padding: "14px 28px",
              fontWeight: 700,
              fontSize: 15,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              transition: "all 0.2s",
              marginTop: 8,
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#003d6e"; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = "#004b8d"; }}
          >
            {submitting ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} />}
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
  fontWeight: 600,
  color: "#001f3d",
  fontFamily: "'Inter', system-ui",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  outline: "none",
  background: "#fff",
  fontFamily: "'Inter', system-ui",
  transition: "border-color 0.2s, box-shadow 0.2s",
};