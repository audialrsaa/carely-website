"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  ArrowLeft, CheckCircle, Clock, AlertTriangle,
  MapPin, Calendar, User, Mail, Phone,
  FileText, Activity, Send, MessageCircle,
  Tag, Edit2, Save, X, Navigation,
} from "lucide-react"; // import semua icon yang dipakai

const API = "http://localhost:5000/api"; // base URL backend

// load komponen peta tanpa SSR karena Leaflet butuh browser
const MapView = dynamic(() => import("../../../users/report/new/MapPicker"), { ssr: false });

export default function AdminReportDetailPage() {
  const { id } = useParams();  // ambil ID laporan dari URL
  const router = useRouter();  // untuk redirect programatis

  const [report, setReport] = useState(null);          // data detail laporan
  const [timeline, setTimeline] = useState([]);        // riwayat perubahan status
  const [comments, setComments] = useState([]);        // daftar komentar
  const [categories, setCategories] = useState([]);    // daftar kategori

  const [newStatus, setNewStatus] = useState("");            // status baru yang dipilih admin
  const [notes, setNotes] = useState("");                    // catatan perubahan status
  const [newComment, setNewComment] = useState("");          // isi komentar baru
  const [originalStatus, setOriginalStatus] = useState(""); // status asli sebelum diedit
  const [originalCategoryId, setOriginalCategoryId] = useState(""); // kategori asli sebelum diedit
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // kategori yang dipilih saat edit

  const [loading, setLoading] = useState(true);          // status loading halaman
  const [updating, setUpdating] = useState(false);       // status loading saat update status
  const [sendingComment, setSendingComment] = useState(false); // status loading kirim komentar
  const [isEditingStatus, setIsEditingStatus] = useState(false); // mode edit status aktif/tidak
  const [showMap, setShowMap] = useState(false);          // tampilkan/sembunyikan peta

  // ambil detail laporan + timeline dari API
  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; } // belum login, redirect

      const res = await fetch(`${API}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          router.push("/login"); // token invalid/expired, logout
        }
        return;
      }

      const data = await res.json();

      if (data.waiting_priority) { // laporan belum diprioritaskan superadmin
        setReport({ _waiting: true });
        setLoading(false);
        return;
      }

      setReport(data.report);                              // simpan data laporan
      setTimeline(data.timeline || []);                    // simpan timeline perubahan
      setNewStatus(data.report.status);                    // set status awal untuk form edit
      setOriginalStatus(data.report.status);               // simpan status asli sebagai referensi
      setSelectedCategoryId(data.report.category_id || ""); // set kategori awal
      setOriginalCategoryId(data.report.category_id || ""); // simpan kategori asli
    } catch (err) {
      console.error(err);
    }
  };

  // ambil daftar komentar laporan dari API
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/comments/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []); // pastikan selalu array
    } catch (err) {
      console.error(err);
    }
  };

  // ambil daftar kategori dari API
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/reports/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch semua data secara paralel saat halaman pertama dimuat
  useEffect(() => {
    if (!id) return;
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDetail(), fetchComments(), fetchCategories()]); // fetch bersamaan
      setLoading(false);
    };
    init();
  }, [id]);

  // batalkan edit: kembalikan semua nilai ke kondisi semula
  const handleCancelEdit = () => {
    setNewStatus(originalStatus);          // reset ke status asli
    setSelectedCategoryId(originalCategoryId); // reset ke kategori asli
    setNotes("");                          // kosongkan catatan
    setIsEditingStatus(false);             // tutup mode edit
  };

  // kirim perubahan status & kategori ke API
  const updateStatus = async () => {
    // cek apakah ada perubahan yang perlu disimpan
    const hasChanges =
      newStatus !== originalStatus ||
      selectedCategoryId !== originalCategoryId ||
      notes.trim() !== "";

    if (!hasChanges) { setIsEditingStatus(false); return; } // tidak ada perubahan, tutup saja

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const isInitialSetup = !originalCategoryId && selectedCategoryId; // kategori baru pertama kali diset

      const res = await fetch(`${API}/reports/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          new_status: newStatus,
          category_id: selectedCategoryId || null,
          // gunakan catatan manual, atau generate otomatis jika tidak diisi
          notes: notes || (isInitialSetup
            ? `Kategori ditetapkan: ${categories.find((c) => c.id === parseInt(selectedCategoryId))?.category_name || ""}`
            : `Status diubah menjadi ${newStatus}`),
        }),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.message || "Gagal update status"); return; }

      alert("Perubahan berhasil disimpan");
      setNotes("");                              // kosongkan catatan
      setOriginalStatus(newStatus);             // update referensi status asli
      setOriginalCategoryId(selectedCategoryId); // update referensi kategori asli
      setIsEditingStatus(false);                // tutup mode edit
      await fetchDetail();                      // refresh data laporan
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setUpdating(false); // matikan loading update
    }
  };

  // kirim komentar baru ke API
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // jangan kirim jika kosong
    try {
      setSendingComment(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/comments/report/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comment: newComment }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Gagal mengirim komentar"); return; }
      setNewComment("");   // kosongkan input setelah berhasil
      fetchComments();     // refresh daftar komentar
    } catch (err) {
      console.error(err);
    } finally {
      setSendingComment(false);
    }
  };

  // kembalikan style badge berdasarkan nilai status
  const getStatusStyle = (status) => {
    const map = {
      pending:       { bg: "#FEF3C7", color: "#D97706", label: "Menunggu",      icon: Clock },
      diproses:      { bg: "#DBEAFE", color: "#2563EB", label: "Diproses",      icon: Activity },
      diperiksa:     { bg: "#DBEAFE", color: "#2563EB", label: "Diperiksa",     icon: Activity },
      diverifikasi:  { bg: "#E0E7FF", color: "#4F46E5", label: "Diverifikasi",  icon: CheckCircle },
      tindak_lanjut: { bg: "#E0E7FF", color: "#4F46E5", label: "Tindak Lanjut", icon: Activity },
      selesai:       { bg: "#D1FAE5", color: "#059669", label: "Selesai",       icon: CheckCircle },
      rejected:      { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak",       icon: AlertTriangle },
      ditolak:       { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak",       icon: AlertTriangle },
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status, icon: FileText }; // fallback
  };

  // kembalikan style badge berdasarkan nilai prioritas
  const getPriorityStyle = (priority) => {
    const map = {
      low:       { bg: "#D1FAE5", color: "#059669", label: "Rendah" },
      medium:    { bg: "#FEF3C7", color: "#D97706", label: "Sedang" },
      high:      { bg: "#FFEDD5", color: "#EA580C", label: "Tinggi" },
      emergency: { bg: "#FEE2E2", color: "#DC2626", label: "Darurat" },
    };
    return map[priority] || { bg: "#F3F4F6", color: "#6B7280", label: "Belum Diset" }; // fallback
  };

  // kembalikan nama kategori berdasarkan ID-nya
  const getCategoryName = (categoryId) => {
    if (!categoryId || categoryId === "null" || categoryId === null)
      return "Belum ditentukan"; // kategori belum diset
    const category = categories.find((c) => c.id === parseInt(categoryId));
    return category ? category.category_name : `Kategori ${categoryId}`; // fallback ke ID jika tidak ditemukan
  };

  // ubah catatan timeline yang berisi ID kategori menjadi nama kategori
  const formatTimelineNotes = (notes) => {
    if (!notes) return null;
    const parts = notes.split("|"); // pisahkan berdasarkan separator "|"
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i].trim();

      // ganti "kategori berubah dari X → Y" dengan nama kategori
      const match = part.match(/kategori berubah dari (null|\d+)\s*→\s*(\d+|null)/i);
      if (match) {
        parts[i] = part.replace(
          match[0],
          `kategori berubah dari ${getCategoryName(match[1])} → ${getCategoryName(match[2])}`
        );
      }

      // ganti "Kategori ditetapkan: <angka>" dengan nama kategori
      const setMatch = part.match(/Kategori ditetapkan:\s*(.*)/i);
      if (setMatch && setMatch[1].trim().match(/^\d+$/)) {
        parts[i] = `Kategori ditetapkan: ${getCategoryName(setMatch[1].trim())}`;
      }
    }
    return parts.join(" | "); // gabungkan kembali
  };

  // format tanggal + jam ke format Indonesia
  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // format hanya tanggal ke format Indonesia
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const hasCoordinates = report?.latitude && report?.longitude; // cek apakah laporan punya koordinat peta

  // tampilan loading
  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.loadingCard}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Memuat detail laporan...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // tampilan jika laporan menunggu prioritas dari superadmin
  if (report?._waiting) {
    return (
      <div style={s.container}>
        <Link href="/admin/reports" style={s.backBtn}><ArrowLeft size={18} /> Kembali ke Daftar</Link>
        <div style={{ ...s.card, textAlign: "center", padding: "60px 24px" }}>
          <Clock size={48} color="#D97706" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
            Menunggu Prioritas
          </h2>
          <p style={{ color: "#6B7280", fontSize: 14 }}>
            Laporan ini belum diprioritaskan oleh superadmin. Harap tunggu sebelum memproses lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  // tampilan jika laporan tidak ditemukan
  if (!report) {
    return (
      <div style={s.notFound}>
        <AlertTriangle size={48} color="#DC2626" />
        <h2 style={s.notFoundTitle}>Laporan tidak ditemukan</h2>
        <Link href="/admin/reports" style={s.backLink}>Kembali ke daftar</Link>
      </div>
    );
  }

  const status = getStatusStyle(report.status);
  const priority = getPriorityStyle(report.priority);
  const StatusIcon = status.icon;                  

  return (
    <div style={s.container}>
      <Link href="/admin/reports" style={s.backBtn}>
        <ArrowLeft size={18} /> Kembali ke Daftar
      </Link>

      {/* Header */}
      <div style={s.headerCard}>
        <div style={s.badgeGroup}>
          <span style={{ ...s.badge, backgroundColor: status.bg, color: status.color }}>
            <StatusIcon size={12} style={{ marginRight: 6 }} /> {status.label}
          </span>
          <span style={{ ...s.badge, backgroundColor: priority.bg, color: priority.color }}>
            Prioritas: {priority.label}
          </span>
        </div>
        <h1 style={s.title}>{report.title}</h1>
        <p style={s.id}>ID: #{report.id}</p>
      </div>

      {/* Description */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Deskripsi Laporan</h2>
        <p style={s.description}>{report.description}</p>
      </div>

      {/* Info Grid */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Informasi Pelapor</h2>
        <div style={s.infoGrid}>
          {[
            { icon: User, label: "Nama", value: report.reporter_name },
            { icon: Mail, label: "Email", value: report.reporter_email },
            { icon: Phone, label: "Telepon", value: report.reporter_phone },
            { icon: Tag, label: "Kategori", value: report.category_name || "Belum ditentukan" },
            { icon: Calendar, label: "Tanggal Kejadian", value: formatDate(report.incident_date) },
            { icon: Clock, label: "Dibuat Pada", value: formatDateTime(report.created_at) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={s.infoItem}>
              <div style={s.infoIcon}><Icon size={16} /></div>
              <div>
                <p style={s.infoLabel}>{label}</p>
                <p style={s.infoValue}>{value || "-"}</p>
              </div>
            </div>
          ))}

          {/* Lokasi + tombol buka peta */}
          <div style={s.infoItem}>
            <div style={s.infoIcon}><MapPin size={16} /></div>
            <div style={{ flex: 1 }}>
              <p style={s.infoLabel}>Lokasi Kejadian</p>
              <p style={s.infoValue}>{report.incident_location || "-"}</p>
              {hasCoordinates && (
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                  {Number(report.latitude).toFixed(6)}, {Number(report.longitude).toFixed(6)}
                </p>
              )}
            </div>
            {hasCoordinates && (
              <button
                onClick={() => setShowMap((v) => !v)}
                style={{
                  marginLeft: 8, flexShrink: 0, padding: "5px 10px",
                  background: showMap ? "#003d6e" : "#004b8d", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <Navigation size={12} /> {showMap ? "Tutup" : "Lihat Peta"}
              </button>
            )}
          </div>
        </div>

        {/* Map panel */}
        {showMap && hasCoordinates && (
          <div style={{ marginTop: 20, borderRadius: 16, overflow: "hidden", border: "1.5px solid #E5E7EB" }}>
            <div style={{ background: "#004b8d", color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} /> Lokasi kejadian (read-only)
            </div>
            <div style={{ height: 340 }}>
              <MapView lat={report.latitude} lng={report.longitude} onSelect={() => {}} />
            </div>
          </div>
        )}
      </div>

      {/* Bukti Foto */}
      {report.bukti_foto && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>Bukti Foto</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={report.bukti_foto} alt="Bukti" style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 12 }} />
          </div>
        </div>
      )}

      {/* Update Status */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={s.cardTitle}>Update Status</h2>
          {!isEditingStatus && (
            <button onClick={() => setIsEditingStatus(true)} style={s.editBtn}>
              <Edit2 size={14} /> {!originalCategoryId ? "Set Status & Kategori" : "Edit Status & Kategori"}
            </button>
          )}
        </div>

        {isEditingStatus ? (
          <div>
            <div style={s.formGroup}>
              <label style={s.label}>Status Laporan</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={s.select} disabled={updating}>
                <option value="pending">Menunggu</option>
                <option value="diperiksa">Diperiksa</option>
                <option value="diverifikasi">Diverifikasi</option>
                <option value="tindak_lanjut">Tindak Lanjut</option>
                <option value="selesai">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Kategori</label>
              <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} style={s.select} disabled={updating}>
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                ))}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Catatan Admin (Opsional)</label>
              <textarea
                placeholder="Tulis catatan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={s.textarea}
                disabled={updating}
              />
            </div>
            <div style={s.editActions}>
              <button onClick={handleCancelEdit} style={s.cancelBtn} disabled={updating}>
                <X size={14} /> Batal
              </button>
              <button onClick={updateStatus} style={s.saveBtn} disabled={updating}>
                {updating ? <><div style={s.btnSpinner} /> Menyimpan...</> : <><Save size={14} /> Simpan Perubahan</>}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: "16px", background: "#F9FAFB", borderRadius: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Status Saat Ini:</span>
                <span style={{ ...s.badge, backgroundColor: status.bg, color: status.color }}>{status.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Kategori:</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: report.category_name ? "#111827" : "#F97316" }}>
                  {report.category_name || "Belum ditentukan"}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12, marginBottom: 0 }}>
              {!originalCategoryId ? "Klik 'Set Status & Kategori' untuk menetapkan kategori" : "Klik 'Edit Status & Kategori' untuk mengubah"}
            </p>
          </div>
        )}
      </div>

      {/* Diskusi */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <MessageCircle size={20} color="#2563EB" />
          <h2 style={s.cardTitle}>Diskusi</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 380, overflowY: "auto", marginBottom: 20 }}>
          {comments.length > 0 ? comments.map((item) => (
            <div key={item.id} style={s.commentItem}>
              <div style={s.commentAvatar}>{item.full_name?.charAt(0) || "U"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.full_name || "User"}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 500,
                    background: item.role === "admin" ? "#DBEAFE" : "#F3F4F6",
                    color: item.role === "admin" ? "#2563EB" : "#6B7280",
                  }}>
                    {item.role === "admin" ? "Admin" : "User"}
                  </span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDateTime(item.created_at)}</span>
                </div>
                <p style={{ fontSize: 13, color: "#4B5563", margin: 0, lineHeight: 1.5 }}>{item.comment}</p>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: "center", padding: "40px 24px", color: "#9CA3AF" }}>
              <MessageCircle size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <p style={{ margin: 0 }}>Belum ada diskusi</p>
            </div>
          )}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar atau balasan..."
          style={{ ...s.textarea, marginBottom: 12 }}
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={sendingComment || !newComment.trim()}
          style={{ ...s.saveBtn, width: "100%", opacity: !newComment.trim() ? 0.6 : 1 }}
        >
          {sendingComment ? <div style={s.btnSpinner} /> : <Send size={16} />}
          Kirim Komentar
        </button>
      </div>

      {/* Timeline */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Riwayat Status</h2>
        {timeline.length > 0 ? (
          <div>
            {timeline.map((log, index) => {
              const isLast = index === timeline.length - 1;
              const logStatus = getStatusStyle(log.new_status);
              return (
                <div key={log.id} style={{ display: "flex", gap: 16 }}>
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB", border: "2px solid #BFDBFE" }} />
                    {!isLast && <div style={{ position: "absolute", top: 12, width: 2, height: "calc(100% + 24px)", background: "#E5E7EB" }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ ...s.badge, backgroundColor: logStatus.bg, color: logStatus.color, fontSize: 11 }}>{logStatus.label}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDateTime(log.created_at)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px" }}>
                      {log.changed_by_name || "System"}{log.changer_role && ` · ${log.changer_role === "admin" ? "Admin" : log.changer_role}`}
                    </p>
                    {log.notes && (
                      <p style={{ fontSize: 13, color: "#4B5563", fontStyle: "italic", margin: 0, padding: "8px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                        {formatTimelineNotes(log.notes)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: 14, padding: "32px 0" }}>Belum ada riwayat status</p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  container: { maxWidth: 900, margin: "0 auto", padding: "32px 24px", background: "#F9FAFB", minHeight: "100vh" },
  loadingWrap: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#F9FAFB" },
  loadingCard: { textAlign: "center", background: "#fff", padding: "48px", borderRadius: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  spinner: { width: 40, height: 40, borderWidth: 4, borderStyle: "solid", borderColor: "#E5E7EB", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" },
  loadingText: { marginTop: 16, color: "#6B7280", fontSize: 14 },
  notFound: { textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 16, maxWidth: 500, margin: "100px auto" },
  notFoundTitle: { fontSize: 20, fontWeight: 600, color: "#111827", marginTop: 16, marginBottom: 24 },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 8, color: "#2563EB", textDecoration: "none", fontSize: 14, fontWeight: 500, marginBottom: 24 },
  backLink: { display: "inline-block", padding: "8px 20px", background: "#2563EB", color: "#fff", textDecoration: "none", borderRadius: 8, fontSize: 14, fontWeight: 500 },
  headerCard: { background: "#fff", borderRadius: 20, padding: "28px", marginBottom: 20, border: "1px solid #E5E7EB" },
  badgeGroup: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" },
  badge: { display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  title: { fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 8px" },
  id: { fontSize: 12, color: "#6B7280", margin: 0 },
  card: { background: "#fff", borderRadius: 20, padding: "28px", marginBottom: 20, border: "1px solid #E5E7EB" },
  cardTitle: { fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 20px" },
  description: { fontSize: 14, lineHeight: 1.6, color: "#4B5563", margin: 0 },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  infoItem: { display: "flex", gap: 12, alignItems: "flex-start" },
  infoIcon: { width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", flexShrink: 0 },
  infoLabel: { fontSize: 11, color: "#6B7280", margin: "0 0 2px" },
  infoValue: { fontSize: 14, fontWeight: 500, color: "#111827", margin: 0 },
  formGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  select: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, outline: "none" },
  textarea: { width: "100%", minHeight: 100, padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  editBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#F3F4F6", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, color: "#4B5563", cursor: "pointer" },
  editActions: { display: "flex", gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "#F3F4F6", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#6B7280", cursor: "pointer" },
  saveBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "#2563EB", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer" },
  btnSpinner: { width: 14, height: 14, borderWidth: 2, borderStyle: "solid", borderColor: "#fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" },
  commentItem: { display: "flex", gap: 12, padding: "14px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #E5E7EB" },
  commentAvatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600, flexShrink: 0 },
};