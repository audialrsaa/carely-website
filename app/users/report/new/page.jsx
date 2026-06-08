"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Upload, ArrowLeft, Send, AlertCircle, CheckCircle, Loader2, MapPin, Navigation, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";

const API = "http://localhost:5000/api";

// komponen map leaflet dimuat secara dinamis agar tidak terjadi error ssr
const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
});

// halaman utama pembuatan laporan
export default function CreateReportPage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({
    type: "",
    message: "",
  });

  const [showMap, setShowMap] = useState(false);
  const [geocodingAddress, setGeocodingAddress] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incident_location: "",
    incident_date: "",
    latitude: "",
    longitude: "",
    bukti_foto: null,
  });

  const [previewName, setPreviewName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  // mengambil alamat otomatis berdasarkan koordinat latitude dan longitude
  const reverseGeocode = useCallback(async (lat, lng) => {
    setGeocodingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`
      );

      const data = await res.json();

      if (data && data.display_name) {
        const addr = data.address || {};

        // menyusun alamat singkat dari hasil geocoding
        const parts = [
          addr.village || addr.suburb || addr.neighbourhood,
          addr.city_district || addr.district,
          addr.city || addr.county || addr.state,
        ].filter(Boolean);

        const shortAddress =
          parts.length > 0
            ? parts.join(", ")
            : data.display_name;

        setFormData((prev) => ({
          ...prev,
          incident_location: shortAddress,
        }));
      }
    } catch {
      // jika gagal mengambil alamat maka user dapat mengisi manual
    } finally {
      setGeocodingAddress(false);
    }
  }, []);

  // menangani perubahan posisi pin pada peta
  const handleMapSelect = useCallback(
    (lat, lng) => {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));

      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  // mengambil lokasi pengguna melalui gps perangkat
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "GPS Tidak Didukung",
        confirmButtonColor: "#004b8d",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        reverseGeocode(lat, lng);

        // menampilkan peta setelah lokasi berhasil diperoleh
        setShowMap(true);

        Swal.fire({
          icon: "success",
          title: "Lokasi Ditemukan",
          timer: 1200,
          showConfirmButton: false,
        });
      },
      () => {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengambil Lokasi",
          confirmButtonColor: "#004b8d",
        });
      }
    );
  };

  // menangani perubahan input form dan upload file
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // validasi file gambar yang diunggah
    if (files && files.length > 0) {
      const file = files[0];

      // memastikan file berupa gambar
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Upload Gagal",
          text: "File harus berupa gambar",
          confirmButtonColor: "#004b8d",
        });
        return;
      }

      // membatasi ukuran file maksimal 5 mb
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Upload Gagal",
          text: "Ukuran file maksimal 5MB",
          confirmButtonColor: "#004b8d",
        });
        return;
      }

      // menyimpan file ke state
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setPreviewName(file.name);

      // membuat preview gambar sebelum dikirim
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };

      reader.readAsDataURL(file);

      setUploadStatus({
        type: "",
        message: "",
      });

      return;
    }

    // memperbarui nilai input biasa
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // mengirim laporan ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // memastikan user sudah login
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Silakan login terlebih dahulu",
        confirmButtonColor: "#004b8d",
      }).then(() => {
        window.location.href = "/login";
      });

      return;
    }

    setSubmitting(true);

    setUploadStatus({
      type: "",
      message: "",
    });

    try {
      // membuat form data untuk upload file dan data laporan
      const body = new FormData();

      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append(
        "incident_location",
        formData.incident_location
      );
      body.append(
        "incident_date",
        formData.incident_date
      );
      body.append("latitude", formData.latitude);
      body.append("longitude", formData.longitude);

      if (formData.bukti_foto) {
        body.append(
          "bukti_foto",
          formData.bukti_foto
        );
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
        throw new Error(
          data.message || "Gagal membuat laporan"
        );
      }

      // menampilkan notifikasi berhasil
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Laporan berhasil dikirim",
        confirmButtonColor: "#004b8d",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      // mengarahkan user ke dashboard setelah laporan berhasil dibuat
      router.push("/users");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Laporan",
        text: err.message,
        confirmButtonColor: "#004b8d",
        confirmButtonText: "Coba Lagi",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 40px" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <Link
          href="/users"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#004b8d", textDecoration: "none", fontWeight: 600, marginBottom: 20, fontSize: 14 }}
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#001f3d", marginBottom: 6 }}>
          Buat Laporan Baru
        </h1>
        <p style={{ color: "#3a5068", fontSize: 14, lineHeight: 1.6 }}>
          Isi detail laporan secara lengkap. Data Anda dijaga aman dan rahasia.
        </p>
      </div>

      {/* ── Status Message ── */}
      {uploadStatus.message && (
        <div style={{
          padding: "12px 18px", borderRadius: 12, marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
          background: uploadStatus.type === "success" ? "#e6f9f4" : "#fde8e8",
          border: `1px solid ${uploadStatus.type === "success" ? "rgba(10,124,92,0.3)" : "rgba(192,57,43,0.2)"}`,
          color: uploadStatus.type === "success" ? "#0a7c5c" : "#c0392b",
        }}>
          {uploadStatus.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {uploadStatus.message}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: 28,
          boxShadow: "0 4px 20px rgba(0,75,141,0.08)", border: "1px solid rgba(0,75,141,0.08)",
          display: "flex", flexDirection: "column", gap: 22,
        }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Judul Laporan</label>
            <input type="text" name="title" placeholder="Masukkan judul laporan" value={formData.title} onChange={handleChange} required style={inputStyle} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Deskripsi Kejadian</label>
            <textarea name="description" placeholder="Jelaskan kejadian secara detail" value={formData.description} onChange={handleChange} required rows={5}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
          </div>

          {/* ── Lokasi + Map ───────────────────────────────────────── */}
          <div>
            <label style={labelStyle}>Lokasi Kejadian</label>

            {/* Field + tombol GPS */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text"
                  name="incident_location"
                  placeholder="Isi otomatis dari peta atau ketik manual"
                  value={geocodingAddress ? "Mencari alamat..." : formData.incident_location}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, paddingLeft: 38, width: "100%", boxSizing: "border-box" }}
                />
                <MapPin size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#004b8d", pointerEvents: "none" }} />
              </div>
              <button type="button" onClick={getCurrentLocation} title="Gunakan lokasi saya"
                style={{ flexShrink: 0, padding: "0 14px", border: "1.5px solid #004b8d", borderRadius: 12, background: "#fff", color: "#004b8d", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                <Navigation size={15} /> GPS
              </button>
              <button type="button" onClick={() => setShowMap((v) => !v)}
                style={{ flexShrink: 0, padding: "0 14px", border: "none", borderRadius: 12, background: showMap ? "#003d6e" : "#004b8d", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>
                <MapPin size={15} /> {showMap ? "Tutup Peta" : "Buka Peta"}
              </button>
            </div>

            {/* Koordinat pill */}
            {formData.latitude && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eef4fb", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#004b8d", fontWeight: 500, marginBottom: 10 }}>
                <MapPin size={12} />
                {Number(formData.latitude).toFixed(6)}, {Number(formData.longitude).toFixed(6)}
                <button type="button" onClick={() => setFormData((p) => ({ ...p, latitude: "", longitude: "" }))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#004b8d", padding: 0, display: "flex" }}>
                  <X size={12} />
                </button>
              </div>
            )}

            {/* ── Leaflet Map Panel ── */}
            {showMap && (
              <div style={{
                borderRadius: 16, overflow: "hidden", border: "1.5px solid #c8d6e5",
                boxShadow: "0 4px 20px rgba(0,75,141,0.1)", position: "relative",
              }}>
                {/* Hint banner */}
                <div style={{
                  background: "#004b8d", color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <MapPin size={13} />
                  Klik pada peta untuk menentukan lokasi kejadian. Pin bisa digeser.
                </div>

                {/* Map */}
                <div style={{ height: 380 }}>
                  <MapPicker
                    lat={formData.latitude || null}
                    lng={formData.longitude || null}
                    onSelect={handleMapSelect}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Tanggal Kejadian</label>
            <input type="date" name="incident_date" value={formData.incident_date} onChange={handleChange} required style={inputStyle} />
          </div>

          {/* Upload */}
          <div>
            <label style={labelStyle}>Bukti Foto <span style={{ fontWeight: 400, color: "#8a9bb0" }}>(Opsional)</span></label>
            <div
              style={{ border: "2px dashed #c8d6e5", borderRadius: 16, padding: previewUrl ? 16 : 32, textAlign: "center", background: "#fafcff" }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#004b8d"; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = "#c8d6e5"; }}
            >
              {previewUrl ? (
                <div>
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 12, marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: "#3a5068", marginBottom: 12 }}>{previewName}</p>
                  <button type="button"
                    onClick={() => { setFormData((p) => ({ ...p, bukti_foto: null })); setPreviewName(""); setPreviewUrl(""); }}
                    style={{ background: "#fde8e8", border: "none", padding: "6px 16px", borderRadius: 20, fontSize: 12, color: "#c0392b", cursor: "pointer" }}>
                    Hapus
                  </button>
                </div>
              ) : (
                <label style={{ cursor: "pointer", display: "block" }}>
                  <Upload size={28} color="#004b8d" style={{ margin: "0 auto 10px" }} />
                  <span style={{ color: "#004b8d", fontWeight: 600, display: "block", marginBottom: 4 }}>Upload Bukti</span>
                  <span style={{ fontSize: 12, color: "#3a5068" }}>Klik atau drag & drop file gambar</span>
                  <span style={{ fontSize: 11, color: "#8a9bb0", display: "block", marginTop: 4 }}>Maksimal 5MB (JPG, PNG)</span>
                  <input type="file" name="bukti_foto" accept="image/*" onChange={handleChange} hidden />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            style={{
              background: submitting ? "#9bbbd7" : "#004b8d", color: "#fff", border: "none", borderRadius: 40,
              padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
              display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 4,
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#003d6e"; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = "#004b8d"; }}
          >
            {submitting ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} />}
            {submitting ? "Mengirim..." : "Kirim Laporan"}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#001f3d",
};

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0",
  fontSize: 14, outline: "none", background: "#fff", fontFamily: "inherit",
  transition: "border-color 0.2s", boxSizing: "border-box",
};