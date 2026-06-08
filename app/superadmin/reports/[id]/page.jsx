// app/superadmin/reports/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Flag,
  Edit2,
  Save,
  X,
  MessageCircle,
  Send,
  Navigation,
  Tag,
} from "lucide-react";

const API = "http://localhost:5000/api";

// Leaflet map (no SSR)
const MapView = dynamic(() => import("../../../users/report/new/MapPicker"), { ssr: false });

// ======================================================
// superadmin report detail page
// halaman detail laporan untuk superadmin
// melihat detail laporan, timeline,
// komentar, lokasi, dan mengatur prioritas
// ======================================================
export default function SuperAdminReportDetailPage() {

  // mengambil id laporan dari url
  const { id } = useParams();

  // menyimpan detail laporan
  const [report, setReport] = useState(null);

  // menyimpan riwayat perubahan status laporan
  const [timeline, setTimeline] = useState([]);

  // menyimpan daftar komentar laporan
  const [comments, setComments] = useState([]);

  // menyimpan daftar kategori laporan
  const [categories, setCategories] = useState([]);

  // menyimpan prioritas yang sedang dipilih
  const [priority, setPriority] = useState("");

  // menyimpan prioritas asli sebelum diedit
  const [originalPriority, setOriginalPriority] = useState("");

  // menentukan apakah mode edit prioritas aktif
  const [isEditingPriority, setIsEditingPriority] = useState(false);

  // loading saat menyimpan prioritas
  const [savingPriority, setSavingPriority] = useState(false);

  // menyimpan isi komentar baru
  const [newComment, setNewComment] = useState("");

  // loading saat mengirim komentar
  const [sendingComment, setSendingComment] = useState(false);

  // loading halaman
  const [loading, setLoading] = useState(true);

  // menentukan apakah peta ditampilkan
  const [showMap, setShowMap] = useState(false);

  // ======================================================
  // fetch detail
  // mengambil detail laporan, komentar,
  // timeline, dan kategori
  // ======================================================
  const fetchDetail = async () => {

    const token = localStorage.getItem("token");

    // jika belum login
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // mengambil data secara bersamaan
    const [
      reportRes,
      commentsRes,
      categoriesRes,
    ] = await Promise.all([

      fetch(
        `${API}/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),

      fetch(
        `${API}/comments/report/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).catch(() => null),

      fetch(
        `${API}/reports/categories`
      ).catch(() => null),
    ]);

    // jika gagal mengambil laporan
    if (!reportRes.ok) {

      if (reportRes.status === 401) {

        localStorage.clear();
        window.location.href = "/login";
      }

      return;
    }

    // mengambil data laporan
    const reportData =
      await reportRes.json();

    // menyimpan detail laporan
    setReport(reportData.report);

    // menyimpan timeline laporan
    setTimeline(
      reportData.timeline || []
    );

    // menyimpan prioritas laporan
    const reportPriority =
      reportData.report?.priority;

    const prioritySet =
      reportData.report?.priority_set;

    if (prioritySet) {

      setPriority(reportPriority);

      setOriginalPriority(
        reportPriority
      );

    } else {

      setPriority("");
      setOriginalPriority("");
    }

    // menyimpan komentar
    if (commentsRes?.ok) {

      const commentsData =
        await commentsRes.json();

      setComments(
        Array.isArray(commentsData)
          ? commentsData
          : []
      );
    }

    // menyimpan kategori
    if (categoriesRes?.ok) {

      const categoriesData =
        await categoriesRes.json();

      setCategories(categoriesData);
    }
  };

  // ======================================================
  // initial load
  // mengambil data saat halaman dibuka
  // ======================================================
  useEffect(() => {

    if (!id) return;

    const init = async () => {

      setLoading(true);

      await fetchDetail();

      setLoading(false);
    };

    init();

  }, [id]);

  // ======================================================
  // update priority
  // mengubah prioritas laporan
  // ======================================================
  const handleUpdatePriority = async () => {

    // jika tidak ada perubahan
    if (priority === originalPriority) {

      setIsEditingPriority(false);

      return;
    }

    try {

      setSavingPriority(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API}/reports/${id}/priority`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            priority,
          }),
        }
      );

      const data =
        await res.json();

      // jika gagal update
      if (!res.ok) {

        alert(
          data.message ||
          "Gagal update prioritas"
        );

        return;
      }

      alert(
        "Prioritas berhasil diperbarui"
      );

      // update state
      setOriginalPriority(priority);

      setReport((prev) => ({
        ...prev,
        priority,
        priority_set: true,
      }));

      setIsEditingPriority(false);

    } catch (err) {

      console.error(err);

      alert("Terjadi kesalahan");

    } finally {

      setSavingPriority(false);
    }
  };

  // ======================================================
  // add comment
  // menambahkan komentar baru ke laporan
  // ======================================================
  const handleAddComment = async () => {

    // jika komentar kosong
    if (!newComment.trim()) return;

    try {

      setSendingComment(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API}/comments/report/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            comment: newComment,
          }),
        }
      );

      const data =
        await res.json();

      // jika gagal kirim komentar
      if (!res.ok) {

        alert(
          data.message ||
          "Gagal mengirim komentar"
        );

        return;
      }

      // kosongkan form komentar
      setNewComment("");

      // refresh data
      await fetchDetail();

    } catch (err) {

      console.error(err);

    } finally {

      setSendingComment(false);
    }
  };

  // ======================================================
  // get status style
  // menentukan warna, label,
  // dan icon status laporan
  // ======================================================
  const getStatusStyle = (status) => {

    const map = {

      pending: {
        bg: "#FEF3C7",
        color: "#D97706",
        label: "Menunggu",
        icon: Clock,
      },

      diproses: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "Diproses",
        icon: Activity,
      },

      diperiksa: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "Diperiksa",
        icon: Activity,
      },

      investigasi: {
        bg: "#E0E7FF",
        color: "#4F46E5",
        label: "Investigasi",
        icon: Activity,
      },

      diverifikasi: {
        bg: "#E0E7FF",
        color: "#4F46E5",
        label: "Diverifikasi",
        icon: CheckCircle,
      },

      tindak_lanjut: {
        bg: "#E0E7FF",
        color: "#4F46E5",
        label: "Tindak Lanjut",
        icon: Activity,
      },

      selesai: {
        bg: "#D1FAE5",
        color: "#059669",
        label: "Selesai",
        icon: CheckCircle,
      },

      ditolak: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "Ditolak",
        icon: AlertTriangle,
      },

      rejected: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "Ditolak",
        icon: AlertTriangle,
      },
    };

    return (
      map[status] || {
        bg: "#F3F4F6",
        color: "#6B7280",
        label: status || "-",
        icon: FileText,
      }
    );
  };

  // ======================================================
  // get priority style
  // menentukan warna dan label prioritas
  // ======================================================
  const getPriorityStyle = (p) => {

    if (!p) {
      return {
        bg: "#F3F4F6",
        color: "#6B7280",
        label: "Belum Diset",
      };
    }

    const map = {

      emergency: {
        bg: "#FEE2E2",
        color: "#DC2626",
        label: "Darurat",
      },

      high: {
        bg: "#FEF3C7",
        color: "#D97706",
        label: "Tinggi",
      },

      medium: {
        bg: "#DBEAFE",
        color: "#2563EB",
        label: "Sedang",
      },

      low: {
        bg: "#F3F4F6",
        color: "#6B7280",
        label: "Rendah",
      },
    };

    return map[p] || {
      bg: "#F3F4F6",
      color: "#6B7280",
      label: p,
    };
  };

  // ======================================================
  // format datetime
  // mengubah tanggal menjadi format indonesia
  // lengkap dengan jam
  // ======================================================
  const formatDateTime = (date) => {

    if (!date) return "-";

    return new Date(date)
      .toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  // ======================================================
  // format date
  // mengubah tanggal menjadi format indonesia
  // ======================================================
  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date)
      .toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  };

  // mengecek apakah laporan memiliki koordinat lokasi
  const hasCoordinates =
    report?.latitude &&
    report?.longitude;

  // ======================================================
  // loading state
  // ======================================================
  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.loadingCard}>
          <div style={s.spinner} />

          <p style={s.loadingText}>
            Memuat detail laporan...
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

  // ======================================================
  // not found state
  // ======================================================
  if (!report) {
    return (
      <div style={s.notFound}>

        <AlertTriangle
          size={48}
          color="#DC2626"
        />

        <h2 style={s.notFoundTitle}>
          Laporan tidak ditemukan
        </h2>

        <Link
          href="/superadmin/reports"
          style={s.backLink}
        >
          Kembali ke daftar
        </Link>

      </div>
    );
  }

  // mengambil style status laporan
  const status =
    getStatusStyle(report.status);

  // mengambil style prioritas laporan
  const priorityStyle =
    getPriorityStyle(
      report.priority_set
        ? priority
        : null
    );

  // mengambil icon status laporan
  const StatusIcon =
    status.icon;


  return (
    <div style={s.container}>
      <Link href="/superadmin/reports" style={s.backBtn}>
        <ArrowLeft size={18} /> Kembali ke Daftar
      </Link>

      {/* Header */}
      <div style={s.headerCard}>
        <div style={s.badgeGroup}>
          <span style={{ ...s.badge, backgroundColor: status.bg, color: status.color }}>
            <StatusIcon size={12} style={{ marginRight: 6 }} /> {status.label}
          </span>
          <span style={{ ...s.badge, backgroundColor: priorityStyle.bg, color: priorityStyle.color }}>
            Prioritas: {priorityStyle.label}
          </span>
        </div>
        <h1 style={s.title}>{report.title}</h1>
        <p style={s.id}>ID: #{report.id}</p>
      </div>

      {/* Description */}
      <div style={s.card}>
        <h2 style={s.cardTitle}>Deskripsi</h2>
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

          {/* Lokasi + peta */}
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
                  background: showMap ? "#1d4ed8" : "#2563EB", color: "#fff",
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
            <div style={{ background: "#2563EB", color: "#fff", padding: "8px 16px", fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={13} /> Lokasi kejadian (read-only)
            </div>
            <div style={{ height: 340 }}>
              <MapView lat={report.latitude} lng={report.longitude} onSelect={() => {}} />
            </div>
          </div>
        )}
      </div>

      {/* Prioritas */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={s.cardTitle}>Prioritas Laporan</h2>
          {!isEditingPriority && (
            <button onClick={() => setIsEditingPriority(true)} style={s.editBtn}>
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditingPriority ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB", marginBottom: 16 }}>
              <Flag size={16} color="#6B7280" />
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, outline: "none" }} disabled={savingPriority}>
                <option value="">-- Pilih Prioritas --</option>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
                <option value="emergency">Darurat</option>
              </select>
            </div>
            <div style={s.editActions}>
              <button onClick={() => { setPriority(originalPriority); setIsEditingPriority(false); }} style={s.cancelBtn} disabled={savingPriority}>
                <X size={14} /> Batal
              </button>
              <button onClick={handleUpdatePriority} style={s.saveBtn} disabled={savingPriority}>
                {savingPriority ? <><div style={s.btnSpinner} /> Menyimpan...</> : <><Save size={14} /> Simpan</>}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: "16px", background: "#F9FAFB", borderRadius: 12 }}>
            <span style={{ ...s.badge, backgroundColor: priorityStyle.bg, color: priorityStyle.color, fontSize: 13 }}>
              {priorityStyle.label}
            </span>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12, marginBottom: 0 }}>
              Klik tombol Edit untuk mengubah prioritas laporan
            </p>
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

      {/* Diskusi */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <MessageCircle size={20} color="#2563EB" />
          <h2 style={s.cardTitle}>Diskusi</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 380, overflowY: "auto", marginBottom: 20 }}>
          {comments.length > 0 ? comments.map((comment) => (
            <div key={comment.id} style={s.commentItem}>
              <div style={s.commentAvatar}>{comment.full_name?.charAt(0) || "U"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{comment.full_name || "Unknown"}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 500,
                    background: comment.role === "superadmin" ? "#EFF6FF" : comment.role === "admin" ? "#F3E8FF" : "#F3F4F6",
                    color: comment.role === "superadmin" ? "#2563EB" : comment.role === "admin" ? "#9333EA" : "#6B7280",
                  }}>
                    {comment.role === "superadmin" ? "Super Admin" : comment.role === "admin" ? "Admin" : "User"}
                  </span>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDateTime(comment.created_at)}</span>
                </div>
                <p style={{ fontSize: 14, color: "#4B5563", margin: 0, lineHeight: 1.5 }}>{comment.comment}</p>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: "center", padding: "40px 24px", color: "#9CA3AF" }}>
              <MessageCircle size={40} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
              <p style={{ margin: 0 }}>Belum ada diskusi</p>
            </div>
          )}
        </div>

        {/* Input komentar — superadmin juga bisa balas */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar atau instruksi..."
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
                      {log.changed_by_name || "System"}
                      {log.changer_role && ` · ${log.changer_role === "superadmin" ? "Super Admin" : log.changer_role === "admin" ? "Admin" : log.changer_role}`}
                    </p>
                    {log.notes && (
                      <p style={{ fontSize: 13, color: "#4B5563", fontStyle: "italic", margin: 0, padding: "8px 12px", background: "#F9FAFB", borderRadius: 10 }}>
                        {log.notes}
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
  editBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#F3F4F6", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500, color: "#4B5563", cursor: "pointer" },
  editActions: { display: "flex", gap: 12 },
  cancelBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "#F3F4F6", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#6B7280", cursor: "pointer" },
  saveBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "#2563EB", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer" },
  btnSpinner: { width: 14, height: 14, borderWidth: 2, borderStyle: "solid", borderColor: "#fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" },
  textarea: { width: "100%", minHeight: 100, padding: "10px 14px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  commentItem: { display: "flex", gap: 12, padding: "14px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #E5E7EB" },
  commentAvatar: { width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600, flexShrink: 0 },
};