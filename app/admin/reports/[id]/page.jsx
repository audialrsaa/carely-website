// app/admin/reports/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Image as ImageIcon,
  Activity,
  Loader2,
  Send,
  MessageCircle,
  Tag,
  Edit2,
  Save,
  X,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comments, setComments] = useState([]);

  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [newComment, setNewComment] = useState("");
  const [originalStatus, setOriginalStatus] = useState("");
  const [originalCategory, setOriginalCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API}/reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch Detail Error:", text);

        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
          router.push("/login");
        }

        return;
      }

      const data = await res.json();

      setReport(data.report);
      setTimeline(data.timeline || []);
      setNewStatus(data.report.status);
      setOriginalStatus(data.report.status);
      setSelectedCategory(data.report.category_id || "");
      setOriginalCategory(data.report.category_id || "");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/comments/report/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch Comment Error:", text);
        return;
      }

      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Comments Error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/reports/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!id) return;

      setLoading(true);

      await Promise.all([
        fetchDetail(),
        fetchComments(),
        fetchCategories(),
      ]);

      setLoading(false);
    };

    init();
  }, [id]);

  const handleEditStatus = () => {
    setIsEditingStatus(true);
  };

  const handleCancelEdit = () => {
    setNewStatus(originalStatus);
    setSelectedCategory(originalCategory);
    setNotes("");
    setIsEditingStatus(false);
  };

  const updateStatus = async () => {
    if (newStatus === originalStatus && selectedCategory === originalCategory && !notes) {
      setIsEditingStatus(false);
      return;
    }

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/reports/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          new_status: newStatus,
          category_id: selectedCategory || null,
          notes: notes || `Status diubah menjadi ${newStatus}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal update status");
        return;
      }

      alert("Status berhasil diperbarui");
      setNotes("");
      setOriginalStatus(newStatus);
      setOriginalCategory(selectedCategory);
      setIsEditingStatus(false);

      await fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSendingComment(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/comments/report/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: newComment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal mengirim komentar");
        return;
      }

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Add Comment Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setSendingComment(false);
    }
  };

  const getStatusLabel = (status) => {
    const map = {
      pending: "Menunggu",
      diproses: "Diproses",
      diverifikasi: "Diverifikasi",
      tindak_lanjut: "Tindak Lanjut",
      selesai: "Selesai",
      rejected: "Ditolak",
      ditolak: "Ditolak",
    };
    return map[status] || status;
  };

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#FEF3C7", color: "#D97706", label: "Menunggu", icon: Clock },
      diproses: { bg: "#DBEAFE", color: "#2563EB", label: "Diproses", icon: Activity },
      diverifikasi: { bg: "#E0E7FF", color: "#4F46E5", label: "Diverifikasi", icon: CheckCircle },
      tindak_lanjut: { bg: "#E0E7FF", color: "#4F46E5", label: "Tindak Lanjut", icon: Activity },
      selesai: { bg: "#D1FAE5", color: "#059669", label: "Selesai", icon: CheckCircle },
      rejected: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak", icon: AlertTriangle },
      ditolak: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak", icon: AlertTriangle },
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status, icon: FileText };
  };

  const getPriorityStyle = (priority) => {
    const map = {
      low: { bg: "#D1FAE5", color: "#059669", label: "Rendah" },
      medium: { bg: "#FEF3C7", color: "#D97706", label: "Sedang" },
      high: { bg: "#FFEDD5", color: "#EA580C", label: "Tinggi" },
      emergency: { bg: "#FEE2E2", color: "#DC2626", label: "Darurat" },
    };
    return map[priority] || { bg: "#F3F4F6", color: "#6B7280", label: "-" };
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat detail laporan...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={styles.notFound}>
        <AlertTriangle size={48} color="#DC2626" />
        <h2 style={styles.notFoundTitle}>Laporan tidak ditemukan</h2>
        <p style={styles.notFoundText}>Laporan yang Anda cari mungkin telah dihapus</p>
        <Link href="/admin/reports" style={styles.backLink}>Kembali ke daftar</Link>
      </div>
    );
  }

  const status = getStatusStyle(report.status);
  const priority = getPriorityStyle(report.priority);
  const StatusIcon = status.icon;

  return (
    <div style={styles.container}>
      <Link href="/admin/reports" style={styles.backBtn}>
        <ArrowLeft size={18} />
        Kembali ke Daftar
      </Link>

      {/* Header Card */}
      <div style={styles.headerCard}>
        <div style={styles.badgeGroup}>
          <span style={{ ...styles.statusBadge, backgroundColor: status.bg, color: status.color }}>
            <StatusIcon size={12} style={{ marginRight: 6 }} />
            {status.label}
          </span>
          <span style={{ ...styles.priorityBadge, backgroundColor: priority.bg, color: priority.color }}>
            Prioritas: {priority.label}
          </span>
        </div>
        <h1 style={styles.title}>{report.title}</h1>
        <p style={styles.id}>ID: #{report.id}</p>
      </div>

      {/* Description Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Deskripsi Laporan</h2>
        <p style={styles.description}>{report.description}</p>
      </div>

      {/* Detail Information */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Informasi Pelapor</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><User size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Nama</p>
              <p style={styles.infoValue}>{report.reporter_name || "-"}</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><Mail size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Email</p>
              <p style={styles.infoValue}>{report.reporter_email || "-"}</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><Phone size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Telepon</p>
              <p style={styles.infoValue}>{report.reporter_phone || "-"}</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><Tag size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Kategori</p>
              <p style={styles.infoValue}>{report.category_name || "-"}</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><MapPin size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Lokasi Kejadian</p>
              <p style={styles.infoValue}>{report.incident_location || "-"}</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><Calendar size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Tanggal Kejadian</p>
              <p style={styles.infoValue}>{formatDate(report.incident_date)}</p>
            </div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><Clock size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Dibuat Pada</p>
              <p style={styles.infoValue}>{formatDateTime(report.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      {report.bukti_foto && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Bukti Foto</h2>
          <div style={styles.imageContainer}>
            <img src={report.bukti_foto} alt="Bukti" style={styles.image} />
          </div>
        </div>
      )}

      {/* Update Status Card */}
      <div style={styles.card}>
        <div style={styles.statusHeader}>
          <h2 style={styles.cardTitle}>Update Status</h2>
          {!isEditingStatus && (
            <button onClick={handleEditStatus} style={styles.editBtn}>
              <Edit2 size={14} />
              Edit Status
            </button>
          )}
        </div>

        {isEditingStatus ? (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status Laporan</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={styles.select}
                disabled={updating}
              >
                <option value="pending">Menunggu</option>
                <option value="diperiksa">Diperiksa</option>
                <option value="diverifikasi">Diverifikasi</option>
                <option value="tindak_lanjut">Tindak Lanjut</option>
                <option value="selesai">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.select}
                disabled={updating}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Catatan Admin (Opsional)</label>
              <textarea
                placeholder="Tulis catatan tentang perubahan status ini..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={styles.textarea}
                disabled={updating}
              />
            </div>

            <div style={styles.editActions}>
              <button onClick={handleCancelEdit} style={styles.cancelBtn} disabled={updating}>
                <X size={14} />
                Batal
              </button>
              <button onClick={updateStatus} disabled={updating} style={styles.saveBtn}>
                {updating ? (
                  <>
                    <div style={styles.btnSpinner}></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.currentStatus}>
            <div style={styles.statusInfoRow}>
              <div style={styles.statusInfo}>
                <span style={styles.statusLabel}>Status Saat Ini:</span>
                <span style={{ ...styles.currentStatusBadge, backgroundColor: status.bg, color: status.color }}>
                  {status.label}
                </span>
              </div>
              <div style={styles.statusInfo}>
                <span style={styles.statusLabel}>Kategori:</span>
                <span style={styles.currentCategory}>{report.category_name || "-"}</span>
              </div>
            </div>
            <p style={styles.statusHint}>Klik tombol Edit Status untuk mengubah status laporan</p>
          </div>
        )}
      </div>

      {/* Comments Card */}
      <div style={styles.card}>
        <div style={styles.commentsHeader}>
          <MessageCircle size={20} color="#2563EB" />
          <h2 style={styles.cardTitle}>Diskusi</h2>
        </div>

        <div style={styles.commentsList}>
          {comments.length > 0 ? (
            comments.map((item) => (
              <div key={item.id} style={styles.commentItem}>
                <div style={styles.commentAvatar}>
                  {item.full_name?.charAt(0) || "U"}
                </div>
                <div style={styles.commentContent}>
                  <div style={styles.commentHeader}>
                    <span style={styles.commentUser}>{item.full_name || "User"}</span>
                    <span style={{
                      ...styles.commentRole,
                      backgroundColor: item.role === "admin" ? "#DBEAFE" : "#F3F4F6",
                      color: item.role === "admin" ? "#2563EB" : "#6B7280",
                    }}>
                      {item.role === "admin" ? "Admin" : "User"}
                    </span>
                    <span style={styles.commentDate}>{formatDateTime(item.created_at)}</span>
                  </div>
                  <p style={styles.commentText}>{item.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyComments}>
              <MessageCircle size={48} color="#D1D5DB" />
              <p style={styles.emptyText}>Belum ada diskusi</p>
              <p style={styles.emptySubtext}>Belum ada komentar dari user atau admin</p>
            </div>
          )}
        </div>

        <div style={styles.commentInputWrapper}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar atau balasan..."
            style={styles.commentInput}
            rows={3}
          />
          <button
            onClick={handleAddComment}
            disabled={sendingComment || !newComment.trim()}
            style={styles.sendBtn}
          >
            {sendingComment ? (
              <div style={styles.btnSpinnerSmall}></div>
            ) : (
              <Send size={16} />
            )}
            Kirim Komentar
          </button>
        </div>
      </div>

      {/* Timeline Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Riwayat Status</h2>
        {timeline.length > 0 ? (
          <div style={styles.timeline}>
            {timeline.map((log, index) => {
              const isLast = index === timeline.length - 1;
              const logStatus = getStatusStyle(log.new_status);
              return (
                <div key={log.id} style={styles.timelineItem}>
                  <div style={styles.timelineLeft}>
                    <div style={styles.timelineDot} />
                    {!isLast && <div style={styles.timelineLine} />}
                  </div>
                  <div style={styles.timelineRight}>
                    <div style={styles.timelineHeader}>
                      <span style={{ ...styles.timelineStatus, backgroundColor: logStatus.bg, color: logStatus.color }}>
                        {logStatus.label}
                      </span>
                      <span style={styles.timelineDate}>{formatDateTime(log.created_at)}</span>
                    </div>
                    <p style={styles.timelineActor}>
                      {log.changed_by_name || "System"}
                      {log.changer_role && ` · ${log.changer_role === "admin" ? "Admin" : log.changer_role}`}
                    </p>
                    {log.notes && <p style={styles.timelineNotes}>"{log.notes}"</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={styles.emptyTimeline}>Belum ada riwayat status</p>
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
  notFound: {
    textAlign: "center",
    padding: "60px 24px",
    background: "#fff",
    borderRadius: 16,
    maxWidth: 500,
    margin: "100px auto",
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#2563EB",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 24,
  },
  backLink: {
    display: "inline-block",
    padding: "8px 20px",
    background: "#2563EB",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  headerCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  badgeGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  priorityBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4B5563",
    margin: 0,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  infoItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563EB",
  },
  infoLabel: {
    fontSize: 11,
    color: "#6B7280",
    margin: 0,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    margin: 0,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: 400,
    objectFit: "contain",
    borderRadius: 12,
  },
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  editBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    background: "#F3F4F6",
    border: "none",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    color: "#4B5563",
    cursor: "pointer",
  },
  currentStatus: {
    padding: "16px",
    background: "#F9FAFB",
    borderRadius: 12,
  },
  statusInfoRow: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  statusInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  statusLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: 500,
  },
  currentStatusBadge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  currentCategory: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
  },
  statusHint: {
    fontSize: 12,
    color: "#9CA3AF",
    margin: 0,
    marginTop: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 14,
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 100,
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
  editActions: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 16px",
    background: "#F3F4F6",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    cursor: "pointer",
  },
  saveBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 16px",
    background: "#2563EB",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    color: "#fff",
    cursor: "pointer",
  },
  btnSpinner: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  btnSpinnerSmall: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  commentsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxHeight: 400,
    overflowY: "auto",
    marginBottom: 20,
  },
  commentItem: {
    display: "flex",
    gap: 12,
    padding: "16px",
    background: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 0,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111827",
  },
  commentRole: {
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 8,
    fontWeight: 500,
  },
  commentDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  commentText: {
    fontSize: 13,
    color: "#4B5563",
    margin: 0,
    lineHeight: 1.5,
  },
  commentInputWrapper: {
    marginTop: 8,
  },
  commentInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 14,
    fontFamily: "'Inter', system-ui",
    resize: "vertical",
    outline: "none",
    marginBottom: 12,
  },
  sendBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "10px 20px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  emptyComments: {
    textAlign: "center",
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#111827",
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    margin: 0,
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  timelineItem: {
    display: "flex",
    gap: 16,
  },
  timelineLeft: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 24,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#2563EB",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#BFDBFE",
  },
  timelineLine: {
    position: "absolute",
    top: 12,
    width: 2,
    height: "calc(100% + 24px)",
    background: "#E5E7EB",
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  timelineStatus: {
    padding: "2px 10px",
    borderRadius: 16,
    fontSize: 11,
    fontWeight: 600,
  },
  timelineDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  timelineActor: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
    marginBottom: 6,
  },
  timelineNotes: {
    fontSize: 13,
    color: "#4B5563",
    fontStyle: "italic",
    margin: 0,
    padding: "8px 12px",
    background: "#F9FAFB",
    borderRadius: 10,
  },
  emptyTimeline: {
    textAlign: "center",
    padding: "40px 24px",
    color: "#9CA3AF",
    fontSize: 14,
  },
};