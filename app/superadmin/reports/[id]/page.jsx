// app/superadmin/reports/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Image as ImageIcon,
  Clock,
  Activity,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Flag,
  Edit2,
  Save,
  X,
  MessageCircle,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function SuperAdminReportDetailPage() {
  const params = useParams();
  const id = params.id;

  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [originalPriority, setOriginalPriority] = useState("medium");
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [savingPriority, setSavingPriority] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        // DETAIL LAPORAN
        const reportRes = await fetch(`${API}/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reportRes.ok) {
          const text = await reportRes.text();
          console.error("Detail Error:", text);
          return;
        }

        const reportData = await reportRes.json();

        // KOMENTAR
        let commentsData = [];

        try {
          const commentsRes = await fetch(`${API}/comments/report/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (commentsRes.ok) {
            commentsData = await commentsRes.json();
            console.log(commentsData);
          }
        } catch (err) {
          console.error("Comments Error:", err);
        }

        setReport(reportData.report);
        setTimeline(reportData.timeline || []);
        setComments(commentsData || []);

        setPriority(reportData.report?.priority || "medium");
        setOriginalPriority(reportData.report?.priority || "medium");
      } catch (err) {
        console.error("Detail Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: "#FEF3C7", color: "#D97706", label: "Menunggu", icon: Clock },
      diproses: { bg: "#DBEAFE", color: "#2563EB", label: "Diproses", icon: Activity },
      investigasi: { bg: "#E0E7FF", color: "#4F46E5", label: "Investigasi", icon: Activity },
      ditindak: { bg: "#E0E7FF", color: "#4F46E5", label: "Ditindak", icon: Activity },
      selesai: { bg: "#D1FAE5", color: "#059669", label: "Selesai", icon: CheckCircle },
      ditolak: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak", icon: AlertTriangle },
      rejected: { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak", icon: AlertTriangle },
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status, icon: FileText };
  };

  const getPriorityStyle = (priority) => {
    const map = {
      emergency: { bg: "#FEE2E2", color: "#DC2626", label: "Emergency", borderColor: "#FCA5A5" },
      high: { bg: "#FEF3C7", color: "#D97706", label: "High", borderColor: "#FCD34D" },
      medium: { bg: "#DBEAFE", color: "#2563EB", label: "Medium", borderColor: "#93C5FD" },
      low: { bg: "#F3F4F6", color: "#6B7280", label: "Low", borderColor: "#D1D5DB" },
    };
    return map[priority] || map.medium;
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

  const handleEditPriority = () => {
    setIsEditingPriority(true);
  };

  const handleCancelEdit = () => {
    setPriority(originalPriority);
    setIsEditingPriority(false);
  };

  const handleUpdatePriority = async () => {
    if (priority === originalPriority) {
      setIsEditingPriority(false);
      return;
    }

    try {
      setSavingPriority(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/reports/${id}/priority`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal update prioritas");
        return;
      }

      alert("Prioritas berhasil diperbarui");

      setOriginalPriority(priority);
      setReport((prev) => ({
        ...prev,
        priority,
      }));
      setIsEditingPriority(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setSavingPriority(false);
    }
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
        <Link href="/superadmin/reports" style={styles.backLink}>Kembali ke daftar</Link>
      </div>
    );
  }

  const status = getStatusStyle(report.status);
  const priorityStyle = getPriorityStyle(priority);
  const StatusIcon = status.icon;

  return (
    <div style={styles.container}>
      <Link href="/superadmin/reports" style={styles.backBtn}>
        <ArrowLeft size={18} />
        Kembali ke Daftar
      </Link>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badgeGroup}>
            <span style={{ ...styles.statusBadge, backgroundColor: status.bg, color: status.color }}>
              <StatusIcon size={12} style={{ marginRight: 6 }} />
              {status.label}
            </span>
          </div>
          <h1 style={styles.title}>{report.title}</h1>
          <p style={styles.id}>ID: #{report.id}</p>
        </div>
      </div>

      {/* Description */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Deskripsi</h2>
        <p style={styles.description}>{report.description}</p>
      </div>

      {/* Details Grid */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Informasi Pelapor</h2>
        <div style={styles.grid}>
          <div style={styles.gridItem}>
            <User size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Nama</p>
              <p style={styles.value}>{report.reporter_name || "-"}</p>
            </div>
          </div>
          <div style={styles.gridItem}>
            <Mail size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Email</p>
              <p style={styles.value}>{report.reporter_email || "-"}</p>
            </div>
          </div>
          <div style={styles.gridItem}>
            <Phone size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Telepon</p>
              <p style={styles.value}>{report.reporter_phone || "-"}</p>
            </div>
          </div>
          <div style={styles.gridItem}>
            <FileText size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Kategori</p>
              <p style={styles.value}>{report.category_name || "-"}</p>
            </div>
          </div>
          <div style={styles.gridItem}>
            <MapPin size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Lokasi Kejadian</p>
              <p style={styles.value}>{report.incident_location || "-"}</p>
            </div>
          </div>
          <div style={styles.gridItem}>
            <Calendar size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Tanggal Kejadian</p>
              <p style={styles.value}>{formatDate(report.incident_date)}</p>
            </div>
          </div>
          <div style={styles.gridItem}>
            <Clock size={16} color="#6B7280" />
            <div>
              <p style={styles.label}>Dibuat Pada</p>
              <p style={styles.value}>{formatDateTime(report.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Section */}
      <div style={styles.card}>
        <div style={styles.priorityHeader}>
          <h2 style={styles.cardTitle}>Prioritas Laporan</h2>
          {!isEditingPriority && (
            <button onClick={handleEditPriority} style={styles.editBtn}>
              <Edit2 size={14} />
              Edit
            </button>
          )}
        </div>

        {isEditingPriority ? (
          <div style={styles.editPriorityBox}>
            <div style={styles.selectWrapper}>
              <Flag size={16} color="#6B7280" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={styles.select}
                disabled={savingPriority}
              >
                <option value="low">Low - Prioritas Rendah</option>
                <option value="medium">Medium - Prioritas Sedang</option>
                <option value="high">High - Prioritas Tinggi</option>
                <option value="emergency">Emergency - Darurat</option>
              </select>
            </div>
            <div style={styles.editActions}>
              <button
                onClick={handleCancelEdit}
                style={styles.cancelBtn}
                disabled={savingPriority}
              >
                <X size={14} />
                Batal
              </button>
              <button
                onClick={handleUpdatePriority}
                style={styles.saveBtn}
                disabled={savingPriority}
              >
                {savingPriority ? (
                  <>
                    <div style={styles.btnSpinner}></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.currentPriority}>
            <span style={{ ...styles.priorityValue, backgroundColor: priorityStyle.bg, color: priorityStyle.color }}>
              {priorityStyle.label}
            </span>
            <p style={styles.priorityHint}>
              Klik tombol Edit untuk mengubah prioritas laporan
            </p>
          </div>
        )}
      </div>

      {/* Image */}
      {report.bukti_foto && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Bukti Foto</h2>
          <img src={report.bukti_foto} alt="Bukti" style={styles.image} />
        </div>
      )}

      {/* Komentar Section - Hanya Baca */}
      <div style={styles.card}>
        <div style={styles.commentsHeader}>
          <MessageCircle size={20} color="#2563EB" />
          <h2 style={styles.cardTitle}>Diskusi</h2>
        </div>

        {comments.length > 0 ? (
          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} style={styles.commentItem}>
                <div style={styles.commentAvatar}>
                  {comment.full_name?.charAt(0) || "U"}
                </div>
                <div style={styles.commentContent}>
                  <div style={styles.commentHeader}>
                    <span style={styles.commentUser}>{comment.full_name || "Unknown"}</span>
                    <span style={{
                      ...styles.commentRole,
                      backgroundColor: comment.role === "superadmin" ? "#EFF6FF" : 
                                     comment.role === "admin" ? "#F3E8FF" : "#F3F4F6",
                      color: comment.role === "superadmin" ? "#2563EB" : 
                             comment.role === "admin" ? "#9333EA" : "#6B7280",
                    }}>
                      {comment.role === "superadmin" ? "Super Admin" : 
                       comment.role === "admin" ? "Admin" : "User"}
                    </span>
                    <span style={styles.commentDate}>
                      {formatDateTime(comment.created_at)}
                    </span>
                  </div>
                  <p style={styles.commentText}>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyComments}>
            <MessageCircle size={48} color="#D1D5DB" />
            <p style={styles.emptyText}>Belum ada diskusi</p>
            <p style={styles.emptySubtext}>Belum ada komentar dari user atau admin</p>
          </div>
        )}
      </div>

      {/* Timeline */}
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
                        {log.new_status}
                      </span>
                      <span style={styles.timelineDate}>{formatDateTime(log.created_at)}</span>
                    </div>
                    <p style={styles.timelineActor}>
                      {log.changed_by_name || "System"}
                      {log.changer_role && ` · ${log.changer_role}`}
                    </p>
                    {log.notes && <p style={styles.timelineNotes}>"{log.notes}"</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={styles.empty}>Belum ada riwayat status</p>
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
    marginBottom: 20,
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
  header: {
    marginBottom: 24,
  },
  badgeGroup: {
    marginBottom: 12,
  },
  statusBadge: {
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
    marginBottom: 4,
  },
  id: {
    fontSize: 12,
    color: "#6B7280",
    margin: 0,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#4B5563",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  gridItem: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 11,
    color: "#6B7280",
    margin: 0,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    margin: 0,
  },
  priorityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  currentPriority: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  priorityValue: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  priorityHint: {
    fontSize: 12,
    color: "#9CA3AF",
    margin: 0,
  },
  editPriorityBox: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  selectWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 200,
    padding: "8px 12px",
    background: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  select: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: 14,
    outline: "none",
  },
  editActions: {
    display: "flex",
    gap: 8,
  },
  cancelBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#F3F4F6",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    cursor: "pointer",
  },
  saveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    background: "#2563EB",
    border: "none",
    borderRadius: 8,
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
  image: {
    maxWidth: "100%",
    maxHeight: 400,
    objectFit: "contain",
    borderRadius: 12,
  },
  // Comments Styles - Read Only
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
    width: 40,
    height: 40,
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
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
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
    fontSize: 14,
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
  // Timeline Styles
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
  empty: {
    textAlign: "center",
    padding: "40px 24px",
    color: "#9CA3AF",
    fontSize: 14,
  },
};