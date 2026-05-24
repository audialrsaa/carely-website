"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ShieldAlert,
  FileText,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
  MessageSquare,
  Image as ImageIcon,
  Activity,
  Send,
  Lock,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingComment, setLoadingComment] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; }

      const res = await fetch(`${API}/reports/my/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) { console.error("Gagal ambil detail laporan:", await res.text()); return; }

      const data = await res.json();
      setReport(data.report || data);
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error("Fetch Detail Error:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/comments/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { console.error("Fetch Comment Error:", await res.text()); return; }
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Comments Error:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setLoading(true);
      await Promise.all([fetchDetail(), fetchComments()]);
      setLoading(false);
    };
    init();
  }, [id]);

  const handleOpenEdit = () => {
    setEditForm({
      title: report.title || "",
      description: report.description || "",
      incident_location: report.incident_location || "",
      incident_date: report.incident_date ? report.incident_date.split("T")[0] : "",
    });
    setNewPhoto(null);
    setNewPhotoPreview(null);
    setRemovePhoto(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPhoto(null);
    setNewPhotoPreview(null);
    setRemovePhoto(false);
  };

  const handleEditChange = (e) =>
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPhoto(file);
    setRemovePhoto(false);
    setNewPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setNewPhoto(null);
    setNewPhotoPreview(null);
    setRemovePhoto(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoadingEdit(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("incident_location", editForm.incident_location);
      formData.append("incident_date", editForm.incident_date);
      if (newPhoto) formData.append("bukti_foto", newPhoto);
      if (removePhoto) formData.append("remove_foto", "true");

      const res = await fetch(`${API}/reports/my/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) { alert(data.message || "Gagal menyimpan perubahan"); return; }

      setIsEditing(false);
      setNewPhoto(null);
      setNewPhotoPreview(null);
      setRemovePhoto(false);
      await fetchDetail();
    } catch (error) {
      console.error("Edit Error:", error);
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoadingDelete(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/reports/my/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) { alert(data.message || "Gagal menghapus laporan"); return; }

      router.push("/users");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Terjadi kesalahan saat menghapus");
    } finally {
      setLoadingDelete(false);
      setShowDeleteModal(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoadingComment(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/comments/report/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Gagal menambahkan komentar"); return; }
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Add Comment Error:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoadingComment(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#FEF3C7", color: "#D97706", label: "Menunggu", icon: Clock },
      diproses: { bg: "#DBEAFE", color: "#2563EB", label: "Diproses", icon: Activity },
      investigasi: { bg: "#E0E7FF", color: "#4F46E5", label: "Investigasi", icon: ShieldAlert },
      ditindak: { bg: "#E0E7FF", color: "#4F46E5", label: "Ditindak", icon: AlertCircle },
      selesai: { bg: "#D1FAE5", color: "#059669", label: "Selesai", icon: CheckCircle },
      ditolak: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak", icon: AlertCircle },
      rejected: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak", icon: AlertCircle },
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
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const commentClosed = report && ["selesai", "rejected", "ditolak"].includes(report.status);
  const isPending = report?.status === "pending";

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat detail laporan...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={styles.notFound}>
        <AlertCircle size={48} color="#DC2626" />
        <h2 style={styles.notFoundTitle}>Laporan tidak ditemukan</h2>
        <p style={styles.notFoundText}>Akses ditolak atau laporan tidak tersedia.</p>
        <Link href="/users" style={styles.backLink}>Kembali ke Dashboard</Link>
      </div>
    );
  }

  const status = getStatusStyle(report.status);
  const StatusIcon = status.icon;
  const priority = getPriorityStyle(report.priority);

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <Link href="/users" style={styles.backBtn}>
        <ArrowLeft size={18} />
        Kembali ke Dashboard
      </Link>

      {/* Detail Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                style={styles.editInput}
                placeholder="Judul laporan"
              />
            ) : (
              <h1 style={styles.title}>{report.title}</h1>
            )}
          </div>

          <div style={styles.badgeGroup}>
            <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
              <StatusIcon size={12} style={{ marginRight: 6 }} />
              {status.label}
            </span>
            <span style={{ ...styles.badge, background: priority.bg, color: priority.color }}>
              Prioritas: {priority.label}
            </span>

            {isPending && !isEditing && (
              <>
                <button onClick={handleOpenEdit} style={{ ...styles.iconBtn, background: "#EFF6FF", color: "#2563EB" }}>
                  <Pencil size={14} />
                  Edit
                </button>
                <button onClick={() => setShowDeleteModal(true)} style={{ ...styles.iconBtn, background: "#FEE2E2", color: "#DC2626" }}>
                  <Trash2 size={14} />
                  Hapus
                </button>
              </>
            )}

            {isEditing && (
              <>
                <button onClick={handleSaveEdit} disabled={loadingEdit} style={{ ...styles.iconBtn, background: "#D1FAE5", color: "#059669" }}>
                  {loadingEdit ? <Loader2 size={14} style={styles.spin} /> : <Save size={14} />}
                  Simpan
                </button>
                <button onClick={handleCancelEdit} style={{ ...styles.iconBtn, background: "#F3F4F6", color: "#6B7280" }}>
                  <X size={14} />
                  Batal
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={styles.descBox}>
          <FileText size={18} color="#2563EB" />
          {isEditing ? (
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              rows={4}
              style={styles.editTextarea}
              placeholder="Deskripsi kejadian"
            />
          ) : (
            <p style={styles.desc}>{report.description}</p>
          )}
        </div>

        {/* Info Grid */}
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><ShieldAlert size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Kategori</p>
              <p style={styles.infoValue}>{report.category_name || "-"}</p>
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><MapPin size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Lokasi Kejadian</p>
              {isEditing ? (
                <input
                  name="incident_location"
                  value={editForm.incident_location}
                  onChange={handleEditChange}
                  style={styles.infoInput}
                />
              ) : (
                <p style={styles.infoValue}>{report.incident_location || "-"}</p>
              )}
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.infoIcon}><Calendar size={16} /></div>
            <div>
              <p style={styles.infoLabel}>Tanggal Kejadian</p>
              {isEditing ? (
                <input
                  type="date"
                  name="incident_date"
                  value={editForm.incident_date}
                  onChange={handleEditChange}
                  style={styles.infoInput}
                />
              ) : (
                <p style={styles.infoValue}>{formatDate(report.incident_date)}</p>
              )}
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

        {/* Image */}
        <div style={styles.imageBox}>
          <div style={styles.imageHeader}>
            <ImageIcon size={18} color="#2563EB" />
            <span style={styles.imageLabel}>Bukti Foto</span>
          </div>

          {isEditing ? (
            <div style={styles.photoEditWrap}>
              {newPhotoPreview ? (
                <div style={styles.photoPreview}>
                  <img src={newPhotoPreview} alt="Preview" style={styles.image} />
                  <span style={styles.photoPreviewLabel}>Foto baru dipilih</span>
                </div>
              ) : !removePhoto && report.bukti_foto ? (
                <div style={styles.photoPreview}>
                  <img src={report.bukti_foto} alt="Current" style={{ ...styles.image, opacity: 0.7 }} />
                  <span style={styles.photoPreviewLabel}>Foto saat ini</span>
                </div>
              ) : (
                <div style={styles.photoEmpty}>
                  <ImageIcon size={32} color="#D1D5DB" />
                  <p>Tidak ada foto</p>
                </div>
              )}

              <div style={styles.photoActions}>
                <label style={styles.photoUploadBtn}>
                  <ImageIcon size={14} />
                  {newPhotoPreview ? "Ganti Foto" : "Pilih Foto"}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                </label>
                {(report.bukti_foto || newPhotoPreview) && !removePhoto && (
                  <button onClick={handleRemovePhoto} style={styles.photoRemoveBtn}>
                    <X size={14} />
                    Hapus Foto
                  </button>
                )}
              </div>
            </div>
          ) : (
            report.bukti_foto ? (
              <img src={report.bukti_foto} alt="Bukti" style={styles.image} />
            ) : (
              <div style={styles.photoEmpty}>
                <ImageIcon size={32} color="#D1D5DB" />
                <p>Tidak ada foto bukti</p>
              </div>
            )
          )}
        </div>

        {isPending && (
          <div style={styles.pendingNotice}>
            <Pencil size={14} />
            Laporan masih berstatus <strong>Menunggu</strong> — kamu dapat mengedit atau menghapus laporan ini.
          </div>
        )}
      </div>

      {/* Timeline Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <Activity size={20} color="#2563EB" />
          <h2 style={styles.sectionTitle}>Timeline Status</h2>
        </div>

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
                        {log.new_status}
                      </span>
                      <span style={styles.timelineDate}>{formatDateTime(log.created_at)}</span>
                    </div>
                    <p style={styles.timelineActor}>Oleh: {log.changed_by_name || "System"}</p>
                    {log.notes && <p style={styles.timelineNotes}>"{log.notes}"</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <Clock size={32} color="#D1D5DB" />
            <p>Belum ada timeline</p>
          </div>
        )}
      </div>

      {/* Comments Card */}
      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <MessageSquare size={20} color="#2563EB" />
          <h2 style={styles.sectionTitle}>Diskusi</h2>
        </div>

        {comments.length > 0 ? (
          <div style={styles.commentsList}>
            {comments.map((item) => {
              const isAdmin = item.role === "admin";
              return (
                <div key={item.id} style={styles.commentItem}>
                  <div style={styles.commentAvatar}>
                    {item.full_name?.charAt(0) || "U"}
                  </div>
                  <div style={styles.commentContent}>
                    <div style={styles.commentHeader}>
                      <span style={styles.commentUser}>{item.full_name}</span>
                      {isAdmin && <span style={styles.adminBadge}>Admin</span>}
                      <span style={styles.commentDate}>{formatDateTime(item.created_at)}</span>
                    </div>
                    <p style={styles.commentText}>{item.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyComments}>
            <MessageSquare size={48} color="#D1D5DB" />
            <p style={styles.emptyText}>Belum ada diskusi</p>
            <p style={styles.emptySubtext}>Mulai diskusi dengan menulis komentar di bawah</p>
          </div>
        )}

        {commentClosed ? (
          <div style={styles.commentClosed}>
            <Lock size={16} />
            Komentar ditutup karena laporan telah selesai/ditolak
          </div>
        ) : (
          <div style={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar atau pertanyaan..."
              rows={3}
              style={styles.textarea}
            />
            <button
              onClick={handleAddComment}
              disabled={loadingComment}
              style={styles.sendBtn}
            >
              {loadingComment ? (
                <div style={styles.btnSpinner}></div>
              ) : (
                <Send size={16} />
              )}
              Kirim Komentar
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIcon}>
              <Trash2 size={28} color="#DC2626" />
            </div>
            <h3 style={styles.modalTitle}>Hapus Laporan?</h3>
            <p style={styles.modalText}>
              Tindakan ini tidak dapat dibatalkan. Laporan akan dihapus secara permanen.
            </p>
            <div style={styles.modalActions}>
              <button onClick={() => setShowDeleteModal(false)} style={styles.modalCancelBtn}>
                Batal
              </button>
              <button onClick={handleConfirmDelete} disabled={loadingDelete} style={styles.modalDeleteBtn}>
                {loadingDelete ? <div style={styles.btnSpinnerSmall}></div> : <Trash2 size={14} />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
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
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  badgeGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  iconBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  spin: {
    animation: "spin 1s linear infinite",
  },
  editInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 14,
    outline: "none",
  },
  editTextarea: {
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
  descBox: {
    background: "#F9FAFB",
    padding: "20px",
    borderRadius: 16,
    marginBottom: 24,
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  desc: {
    margin: 0,
    lineHeight: 1.6,
    color: "#4B5563",
    flex: 1,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 16,
    marginBottom: 24,
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
  infoInput: {
    padding: "6px 10px",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 13,
    marginTop: 4,
    width: "100%",
  },
  imageBox: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "#E5E7EB",
  },
  imageHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },
  image: {
    maxWidth: "100%",
    maxHeight: 400,
    objectFit: "contain",
    borderRadius: 12,
  },
  photoEditWrap: {
    display: "flex",
    flexDirection: "column",
  },
  photoPreview: {
    display: "inline-block",
  },
  photoPreviewLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  photoEmpty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "32px 0",
    background: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
  },
  photoActions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  photoUploadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 8,
    background: "#EFF6FF",
    color: "#2563EB",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  },
  photoRemoveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 8,
    background: "#FEE2E2",
    color: "#DC2626",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
  },
  pendingNotice: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    padding: "10px 16px",
    background: "#FEF3C7",
    borderRadius: 10,
    fontSize: 13,
    color: "#D97706",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
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
  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
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
  adminBadge: {
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 8,
    background: "#DBEAFE",
    color: "#2563EB",
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
  emptyComments: {
    textAlign: "center",
    padding: "48px 24px",
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
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    color: "#9CA3AF",
  },
  commentClosed: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    background: "#F3F4F6",
    borderRadius: 10,
    fontSize: 13,
    color: "#6B7280",
  },
  commentForm: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 20,
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    fontSize: 14,
    resize: "vertical",
    outline: "none",
    fontFamily: "'Inter', system-ui",
  },
  sendBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px",
    maxWidth: 400,
    width: "90%",
    textAlign: "center",
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#FEE2E2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#6B7280",
    margin: 0,
    marginBottom: 24,
  },
  modalActions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
  },
  modalCancelBtn: {
    padding: "8px 20px",
    background: "#F3F4F6",
    color: "#6B7280",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  modalDeleteBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 20px",
    background: "#DC2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
};