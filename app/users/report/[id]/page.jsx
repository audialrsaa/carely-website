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

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);         // File object
  const [newPhotoPreview, setNewPhotoPreview] = useState(null); // blob URL
  const [removePhoto, setRemovePhoto] = useState(false);

  // Delete state
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

  // ── Edit handlers ──────────────────────────────────────────
  const handleOpenEdit = () => {
    setEditForm({
      title: report.title || "",
      description: report.description || "",
      incident_location: report.incident_location || "",
      incident_date: report.incident_date
        ? report.incident_date.split("T")[0]
        : "",
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

  // ── Delete handlers ────────────────────────────────────────
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

  // ── Comment handler ────────────────────────────────────────
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

  // ── Helpers ────────────────────────────────────────────────
  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#fff7d6", color: "#b07d00", label: "Menunggu", icon: Clock },
      diproses: { bg: "#e8f5ff", color: "#004b8d", label: "Diproses", icon: Activity },
      investigasi: { bg: "#e8f5ff", color: "#004b8d", label: "Investigasi", icon: ShieldAlert },
      ditindak: { bg: "#e8f5ff", color: "#004b8d", label: "Ditindak", icon: AlertCircle },
      selesai: { bg: "#e6f9f4", color: "#0a7c5c", label: "Selesai", icon: CheckCircle },
      ditolak: { bg: "#fde8e8", color: "#c0392b", label: "Ditolak", icon: AlertCircle },
      rejected: { bg: "#fde8e8", color: "#c0392b", label: "Ditolak", icon: AlertCircle },
    };
    return map[status] || { bg: "#f1f1e6", color: "#3a5068", label: status, icon: FileText };
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

  // ── Render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <Loader2 size={42} style={{ color: "#004b8d", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={styles.notFound}>
        <AlertCircle size={48} color="#c0392b" />
        <h2 style={styles.notFoundTitle}>Laporan tidak ditemukan</h2>
        <p style={styles.notFoundText}>Akses ditolak atau laporan tidak tersedia.</p>
        <Link href="/users" style={styles.backLink}>Kembali ke Dashboard</Link>
      </div>
    );
  }

  const status = getStatusStyle(report.status);
  const StatusIcon = status.icon;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .edit-input:focus { border-color: #004b8d !important; outline: none; box-shadow: 0 0 0 3px rgba(0,75,141,0.08); }
        .action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .action-btn { transition: all 0.18s ease; }
      `}</style>

      {/* Back Button */}
      <Link href="/users" style={styles.backBtn}>
        <ArrowLeft size={18} />
        Kembali ke Dashboard
      </Link>

      {/* ── Detail Card ── */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {isEditing ? (
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="edit-input"
                style={styles.editInput}
                placeholder="Judul laporan"
              />
            ) : (
              <h1 style={styles.title}>{report.title}</h1>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
              <StatusIcon size={12} style={{ marginRight: 6 }} />
              {status.label}
            </span>

            {/* Edit & Delete — only when pending */}
            {isPending && !isEditing && (
              <>
                <button
                  className="action-btn"
                  onClick={handleOpenEdit}
                  style={{ ...styles.iconBtn, background: "#e8f5ff", color: "#004b8d" }}
                  title="Edit laporan"
                >
                  <Pencil size={15} />
                  <span style={styles.btnLabel}>Edit</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => setShowDeleteModal(true)}
                  style={{ ...styles.iconBtn, background: "#fde8e8", color: "#c0392b" }}
                  title="Hapus laporan"
                >
                  <Trash2 size={15} />
                  <span style={styles.btnLabel}>Hapus</span>
                </button>
              </>
            )}

            {/* Save / Cancel when editing */}
            {isEditing && (
              <>
                <button
                  className="action-btn"
                  onClick={handleSaveEdit}
                  disabled={loadingEdit}
                  style={{ ...styles.iconBtn, background: "#e6f9f4", color: "#0a7c5c" }}
                >
                  {loadingEdit
                    ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                    : <Save size={15} />}
                  <span style={styles.btnLabel}>{loadingEdit ? "Menyimpan..." : "Simpan"}</span>
                </button>
                <button
                  className="action-btn"
                  onClick={handleCancelEdit}
                  style={{ ...styles.iconBtn, background: "#f1f1e6", color: "#3a5068" }}
                >
                  <X size={15} />
                  <span style={styles.btnLabel}>Batal</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={styles.descBox}>
          <FileText size={18} color="#004b8d" style={{ flexShrink: 0, marginTop: 2 }} />
          {isEditing ? (
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              className="edit-input"
              rows={4}
              style={{ ...styles.editInput, resize: "vertical", lineHeight: 1.6 }}
              placeholder="Deskripsi kejadian"
            />
          ) : (
            <p style={styles.desc}>{report.description}</p>
          )}
        </div>

        {/* Meta Grid */}
        <div style={styles.metaGrid}>
          <MetaItem
            icon={<ShieldAlert size={16} />}
            label="Kategori"
            value={
              <span>
                {report.category_name || "-"}
                <span style={{ fontSize: 10, marginLeft: 6, color: "#8a9bb0", fontWeight: 500 }}>
                  (ditentukan admin)
                </span>
              </span>
            }
          />

          {/* Editable: Lokasi */}
          <div style={styles.metaItem}>
            <div style={styles.metaIcon}><MapPin size={16} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={styles.metaLabel}>Lokasi Kejadian</p>
              {isEditing ? (
                <input
                  name="incident_location"
                  value={editForm.incident_location}
                  onChange={handleEditChange}
                  className="edit-input"
                  style={{ ...styles.editInput, padding: "6px 10px", fontSize: 13, marginTop: 4 }}
                  placeholder="Lokasi kejadian"
                />
              ) : (
                <p style={styles.metaValue}>{report.incident_location || "-"}</p>
              )}
            </div>
          </div>

          {/* Editable: Tanggal */}
          <div style={styles.metaItem}>
            <div style={styles.metaIcon}><Calendar size={16} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={styles.metaLabel}>Tanggal Kejadian</p>
              {isEditing ? (
                <input
                  type="date"
                  name="incident_date"
                  value={editForm.incident_date}
                  onChange={handleEditChange}
                  className="edit-input"
                  style={{ ...styles.editInput, padding: "6px 10px", fontSize: 13, marginTop: 4 }}
                />
              ) : (
                <p style={styles.metaValue}>{formatDate(report.incident_date)}</p>
              )}
            </div>
          </div>

          <MetaItem icon={<Clock size={16} />} label="Dibuat Pada" value={formatDateTime(report.created_at)} />
        </div>

        {/* Foto Bukti — selalu tampil, bisa diedit saat mode edit */}
        <div style={styles.imageBox}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <ImageIcon size={18} color="#004b8d" />
            <span style={styles.imageLabel}>Bukti Foto</span>
            {isEditing && (
              <span style={{ fontSize: 11, color: "#8a9bb0", marginLeft: 4 }}>
                (opsional — biarkan jika tidak ingin mengganti)
              </span>
            )}
          </div>

          {isEditing ? (
            <div style={styles.photoEditWrap}>
              {/* Preview: foto baru atau foto lama (kalau belum dihapus) */}
              {newPhotoPreview ? (
                <div style={styles.photoPreviewBox}>
                  <img src={newPhotoPreview} alt="Preview baru" style={styles.image} />
                  <div style={styles.photoPreviewLabel}>
                    <CheckCircle size={13} color="#0a7c5c" />
                    Foto baru dipilih
                  </div>
                </div>
              ) : !removePhoto && report.bukti_foto ? (
                <div style={styles.photoPreviewBox}>
                  <img src={report.bukti_foto} alt="Foto saat ini" style={{ ...styles.image, opacity: 0.75 }} />
                  <div style={styles.photoPreviewLabel}>
                    <ImageIcon size={13} color="#3a5068" />
                    Foto saat ini
                  </div>
                </div>
              ) : (
                <div style={styles.photoEmpty}>
                  <ImageIcon size={32} color="#c8d6e5" />
                  <p style={{ margin: 0, fontSize: 13, color: "#8a9bb0" }}>Tidak ada foto</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <label style={styles.photoUploadBtn}>
                  <ImageIcon size={14} />
                  {newPhotoPreview ? "Ganti Foto Lain" : "Pilih Foto Baru"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                </label>

                {(report.bukti_foto || newPhotoPreview) && !removePhoto && (
                  <button onClick={handleRemovePhoto} style={styles.photoRemoveBtn}>
                    <X size={14} />
                    Hapus Foto
                  </button>
                )}

                {(newPhotoPreview || removePhoto) && (
                  <button
                    onClick={() => { setNewPhoto(null); setNewPhotoPreview(null); setRemovePhoto(false); }}
                    style={styles.photoResetBtn}
                  >
                    <X size={14} />
                    Batalkan Perubahan Foto
                  </button>
                )}
              </div>
            </div>
          ) : (
            report.bukti_foto ? (
              <img src={report.bukti_foto} alt="Bukti" style={styles.image} />
            ) : (
              <div style={styles.photoEmpty}>
                <ImageIcon size={32} color="#c8d6e5" />
                <p style={{ margin: 0, fontSize: 13, color: "#8a9bb0" }}>Tidak ada foto bukti</p>
              </div>
            )
          )}
        </div>

        {/* Pending notice */}
        {isPending && (
          <div style={styles.pendingNotice}>
            <Pencil size={14} />
            Laporan masih berstatus <strong>Menunggu</strong> — kamu dapat mengedit atau menghapus laporan ini.
          </div>
        )}
      </div>

      {/* ── Timeline Card ── */}
      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Activity size={22} color="#004b8d" />
          <h2 style={styles.sectionTitle}>Timeline Status</h2>
        </div>

        {timeline.length > 0 ? (
          <div style={styles.timelineList}>
            {timeline.map((log, index) => {
              const isLast = index === timeline.length - 1;
              const logStatus = getStatusStyle(log.new_status);
              return (
                <div key={log.id} style={{ ...styles.timelineItem, borderBottom: isLast ? "none" : "1px solid #f1f1e6" }}>
                  <div style={styles.timelineIcon}><Clock size={16} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={styles.timelineStatus}>
                      {log.old_status ? (
                        <>
                          <span style={styles.statusOld}>{log.old_status}</span>
                          <span style={styles.arrowIcon}> → </span>
                          <span style={{ ...styles.statusNew, background: logStatus.bg, color: logStatus.color }}>
                            {log.new_status}
                          </span>
                        </>
                      ) : (
                        <span style={{ ...styles.statusNew, background: logStatus.bg, color: logStatus.color }}>
                          {log.new_status}
                        </span>
                      )}
                    </p>
                    <p style={styles.timelineMeta}>Oleh: {log.changed_by_name || "System"}</p>
                    {log.notes && <p style={styles.timelineNotes}>"{log.notes}"</p>}
                    <p style={styles.timelineDate}>{formatDateTime(log.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyTimeline}>
            <Clock size={32} color="#c8d6e5" />
            <p>Belum ada timeline.</p>
          </div>
        )}
      </div>

      {/* ── Comments Card ── */}
      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <MessageSquare size={22} color="#004b8d" />
          <h2 style={styles.sectionTitle}>Komentar & Diskusi</h2>
        </div>

        {comments.length > 0 ? (
          <div style={styles.commentList}>
            {comments.map((item) => {
              const isAdmin = item.role === "admin";
              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.commentItem,
                    background: isAdmin ? "#e8f5ff" : "#f8f9ff",
                    borderLeft: isAdmin ? "3px solid #004b8d" : "3px solid #c8d6e5",
                  }}
                >
                  <div style={styles.commentHeader}>
                    <div style={styles.commentAuthor}>
                      <User size={14} color={isAdmin ? "#004b8d" : "#3a5068"} />
                      <strong>{item.full_name}</strong>
                      {isAdmin && <span style={styles.adminBadge}>Admin</span>}
                    </div>
                    <span style={styles.commentDate}>{formatDateTime(item.created_at)}</span>
                  </div>
                  <p style={styles.commentText}>{item.comment}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyComments}>
            <MessageSquare size={32} color="#c8d6e5" />
            <p>Belum ada komentar.</p>
          </div>
        )}

        {commentClosed ? (
          <div style={styles.commentClosed}>
            <Lock size={16} />
            Komentar ditutup karena laporan telah selesai / ditolak.
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
              style={styles.submitBtn}
              onMouseEnter={(e) => { if (!loadingComment) e.currentTarget.style.background = "#003d6e"; }}
              onMouseLeave={(e) => { if (!loadingComment) e.currentTarget.style.background = "#004b8d"; }}
            >
              {loadingComment
                ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                : <Send size={16} />}
              {loadingComment ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIcon}>
              <Trash2 size={28} color="#c0392b" />
            </div>
            <h3 style={styles.modalTitle}>Hapus Laporan?</h3>
            <p style={styles.modalText}>
              Tindakan ini tidak dapat dibatalkan. Laporan beserta seluruh data terkait akan dihapus secara permanen.
            </p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.modalCancelBtn}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e8eef5"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f1f1e6"}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loadingDelete}
                style={styles.modalDeleteBtn}
                onMouseEnter={(e) => { if (!loadingDelete) e.currentTarget.style.background = "#a93226"; }}
                onMouseLeave={(e) => { if (!loadingDelete) e.currentTarget.style.background = "#c0392b"; }}
              >
                {loadingDelete
                  ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                  : <Trash2 size={15} />}
                {loadingDelete ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div style={styles.metaItem}>
      <div style={styles.metaIcon}>{icon}</div>
      <div>
        <p style={styles.metaLabel}>{label}</p>
        <p style={styles.metaValue}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  loadingWrap: { minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" },
  notFound: { textAlign: "center", padding: 60, background: "#fff", borderRadius: 24, border: "1px solid rgba(0,75,141,0.08)" },
  notFoundTitle: { fontSize: 20, fontWeight: 700, color: "#001f3d", marginTop: 16, marginBottom: 8, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  notFoundText: { color: "#3a5068", marginBottom: 20, fontFamily: "'Inter', system-ui, sans-serif" },
  backBtn: { display: "inline-flex", alignItems: "center", gap: 8, color: "#004b8d", textDecoration: "none", fontWeight: 600, fontSize: 14, width: "fit-content", fontFamily: "'Inter', system-ui, sans-serif" },
  backLink: { color: "#004b8d", textDecoration: "none", fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif" },
  card: { background: "#fff", padding: 28, borderRadius: 24, border: "1px solid rgba(0,75,141,0.08)", boxShadow: "0 4px 20px rgba(0,75,141,0.04)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 },
  title: { margin: 0, fontSize: 26, fontWeight: 800, color: "#001f3d", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  badge: { display: "inline-flex", alignItems: "center", padding: "6px 14px", borderRadius: 40, fontSize: 12, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif" },
  iconBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 40, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif" },
  btnLabel: { fontSize: 13 },
  descBox: { background: "#f8f9ff", padding: 20, borderRadius: 16, marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start", border: "1px solid rgba(0,75,141,0.06)" },
  desc: { margin: 0, lineHeight: 1.6, color: "#3a5068", flex: 1, fontFamily: "'Inter', system-ui, sans-serif" },
  editInput: { width: "100%", padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "'Inter', system-ui, sans-serif", color: "#001f3d", background: "#fff", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" },
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 24 },
  metaItem: { display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0" },
  metaIcon: { width: 32, height: 32, borderRadius: 10, background: "#e8f5ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#004b8d", flexShrink: 0 },
  metaLabel: { fontSize: 11, color: "#3a5068", margin: 0, fontFamily: "'Inter', system-ui, sans-serif" },
  metaValue: { fontSize: 14, fontWeight: 600, color: "#001f3d", margin: 0, fontFamily: "'Inter', system-ui, sans-serif" },
  imageBox: { marginTop: 8, paddingTop: 16, borderTop: "1px solid #f1f1e6" },
  imageLabel: { fontSize: 14, fontWeight: 600, color: "#001f3d", fontFamily: "'Inter', system-ui, sans-serif" },
  image: { maxWidth: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 16, border: "1px solid rgba(0,75,141,0.1)" },
  photoEditWrap: { display: "flex", flexDirection: "column" },
  photoPreviewBox: { position: "relative", display: "inline-block" },
  photoPreviewLabel: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 12, color: "#3a5068", fontFamily: "'Inter', system-ui, sans-serif" },
  photoEmpty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "32px 0", background: "#f8f9ff", borderRadius: 16, border: "1.5px dashed #c8d6e5" },
  photoUploadBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 40, background: "#e8f5ff", color: "#004b8d", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif", border: "none", transition: "opacity 0.18s" },
  photoRemoveBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 40, background: "#fde8e8", color: "#c0392b", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif", border: "none", transition: "opacity 0.18s" },
  photoResetBtn: { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 40, background: "#f1f1e6", color: "#3a5068", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', system-ui, sans-serif", border: "none", transition: "opacity 0.18s" },
  pendingNotice: { display: "flex", alignItems: "center", gap: 8, marginTop: 20, padding: "10px 16px", background: "#fff7d6", borderRadius: 12, fontSize: 13, color: "#b07d00", fontFamily: "'Inter', system-ui, sans-serif", border: "1px solid rgba(176,125,0,0.15)" },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: "#001f3d", margin: 0, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  timelineList: { display: "flex", flexDirection: "column" },
  timelineItem: { display: "flex", gap: 14, padding: "16px 0" },
  timelineIcon: { width: 36, height: 36, borderRadius: "50%", background: "#e8f5ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#004b8d", flexShrink: 0 },
  timelineStatus: { margin: 0, fontWeight: 600, fontSize: 14, color: "#001f3d", fontFamily: "'Inter', system-ui, sans-serif" },
  statusOld: { background: "#f1f1e6", padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 500 },
  arrowIcon: { color: "#3a5068" },
  statusNew: { padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  timelineMeta: { margin: "6px 0 0", fontSize: 12, color: "#3a5068", fontFamily: "'Inter', system-ui, sans-serif" },
  timelineNotes: { margin: "8px 0 0", fontSize: 13, color: "#3a5068", fontStyle: "italic", background: "#f8f9ff", padding: "8px 12px", borderRadius: 12, fontFamily: "'Inter', system-ui, sans-serif" },
  timelineDate: { margin: "6px 0 0", fontSize: 11, color: "#8a9bb0", fontFamily: "'Inter', system-ui, sans-serif" },
  emptyTimeline: { textAlign: "center", padding: 48, color: "#3a5068", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  commentList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  commentItem: { padding: 16, borderRadius: 16, border: "1px solid rgba(0,75,141,0.08)", transition: "all 0.2s" },
  commentHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  commentAuthor: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
  adminBadge: { background: "#004b8d", color: "#fff", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600 },
  commentDate: { fontSize: 11, color: "#8a9bb0", fontFamily: "'Inter', system-ui, sans-serif" },
  commentText: { margin: 0, fontSize: 14, color: "#001f3d", lineHeight: 1.5, fontFamily: "'Inter', system-ui, sans-serif" },
  emptyComments: { textAlign: "center", padding: 48, color: "#3a5068", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: "#f8f9ff", borderRadius: 16, marginBottom: 24 },
  commentClosed: { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "#f8f9ff", borderRadius: 12, color: "#3a5068", fontSize: 13, fontFamily: "'Inter', system-ui, sans-serif", border: "1px solid rgba(0,75,141,0.08)" },
  commentForm: { display: "flex", flexDirection: "column", gap: 12 },
  textarea: { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1.5px solid #e2e8f0", outline: "none", resize: "vertical", fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, transition: "border-color 0.2s", boxSizing: "border-box" },
  submitBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 40, border: "none", background: "#004b8d", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter', system-ui, sans-serif" },
  // Modal
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 },
  modalBox: { background: "#fff", borderRadius: 24, padding: "36px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "fadeIn 0.2s ease" },
  modalIcon: { width: 64, height: 64, borderRadius: "50%", background: "#fde8e8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  modalTitle: { margin: "0 0 12px", fontSize: 20, fontWeight: 800, color: "#001f3d", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  modalText: { margin: "0 0 28px", fontSize: 14, color: "#3a5068", lineHeight: 1.6, fontFamily: "'Inter', system-ui, sans-serif" },
  modalActions: { display: "flex", gap: 12, justifyContent: "center" },
  modalCancelBtn: { padding: "11px 24px", borderRadius: 40, border: "none", background: "#f1f1e6", color: "#3a5068", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background 0.18s", fontFamily: "'Inter', system-ui, sans-serif" },
  modalDeleteBtn: { display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 40, border: "none", background: "#c0392b", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background 0.18s", fontFamily: "'Inter', system-ui, sans-serif" },
};