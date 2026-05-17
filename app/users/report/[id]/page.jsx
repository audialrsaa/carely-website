"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserReportDetailPage() {
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingComment, setLoadingComment] = useState(false);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API}/reports/my/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Gagal ambil detail laporan:", text);
        return;
      }

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

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setLoading(true);
      await Promise.all([fetchDetail(), fetchComments()]);
      setLoading(false);
    };
    init();
  }, [id]);

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

      if (!res.ok) {
        alert(data.message || "Gagal menambahkan komentar");
        return;
      }

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

  const commentClosed = report && ["selesai", "rejected", "ditolak"].includes(report.status);

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
      {/* Back Button */}
      <Link href="/users" style={styles.backBtn}>
        <ArrowLeft size={18} />
        Kembali ke Dashboard
      </Link>

      {/* Detail Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h1 style={styles.title}>{report.title}</h1>
          <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
            <StatusIcon size={12} style={{ marginRight: 6 }} />
            {status.label}
          </span>
        </div>

        <div style={styles.descBox}>
          <FileText size={18} color="#004b8d" />
          <p style={styles.desc}>{report.description}</p>
        </div>

        <div style={styles.metaGrid}>
          <MetaItem icon={<ShieldAlert size={16} />} label="Kategori" value={report.category_name || "-"} />
          <MetaItem icon={<MapPin size={16} />} label="Lokasi Kejadian" value={report.incident_location || "-"} />
          <MetaItem icon={<Calendar size={16} />} label="Tanggal Kejadian" value={formatDate(report.incident_date)} />
          <MetaItem icon={<Clock size={16} />} label="Dibuat Pada" value={formatDateTime(report.created_at)} />
        </div>

        {report.bukti_foto && (
          <div style={styles.imageBox}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <ImageIcon size={18} color="#004b8d" />
              <span style={styles.imageLabel}>Bukti Foto</span>
            </div>
            <img src={report.bukti_foto} alt="Bukti" style={styles.image} />
          </div>
        )}
      </div>

      {/* Timeline Card */}
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
                  <div style={styles.timelineIcon}>
                    <Clock size={16} />
                  </div>
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
                    <p style={styles.timelineMeta}>
                      Oleh: {log.changed_by_name || "System"}
                    </p>
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

      {/* Comments Card */}
      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <MessageSquare size={22} color="#004b8d" />
          <h2 style={styles.sectionTitle}>Komentar & Diskusi</h2>
        </div>

        {/* List Komentar */}
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
                    <span style={styles.commentDate}>
                      {formatDateTime(item.created_at)}
                    </span>
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

        {/* Input Komentar */}
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
              onMouseEnter={(e) => {
                if (!loadingComment) e.currentTarget.style.background = "#003d6e";
              }}
              onMouseLeave={(e) => {
                if (!loadingComment) e.currentTarget.style.background = "#004b8d";
              }}
            >
              {loadingComment ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Send size={16} />
              )}
              {loadingComment ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </div>
        )}
      </div>
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
  loadingWrap: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    textAlign: "center",
    padding: 60,
    background: "#fff",
    borderRadius: 24,
    border: "1px solid rgba(0,75,141,0.08)",
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#001f3d",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  notFoundText: {
    color: "#3a5068",
    marginBottom: 20,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#004b8d",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    width: "fit-content",
    fontFamily: "'Inter', system-ui, sans-serif",
    transition: "gap 0.2s",
  },
  backLink: {
    color: "#004b8d",
    textDecoration: "none",
    fontWeight: 600,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    padding: 28,
    borderRadius: 24,
    border: "1px solid rgba(0,75,141,0.08)",
    boxShadow: "0 4px 20px rgba(0,75,141,0.04)",
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
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
    color: "#001f3d",
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    borderRadius: 40,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  descBox: {
    background: "#f8f9ff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    border: "1px solid rgba(0,75,141,0.06)",
  },
  desc: {
    margin: 0,
    lineHeight: 1.6,
    color: "#3a5068",
    flex: 1,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  metaItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "8px 0",
  },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "#e8f5ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#004b8d",
  },
  metaLabel: {
    fontSize: 11,
    color: "#3a5068",
    margin: 0,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#001f3d",
    margin: 0,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  imageBox: {
    marginTop: 8,
    paddingTop: 16,
    borderTop: "1px solid #f1f1e6",
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#001f3d",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  image: {
    maxWidth: "100%",
    maxHeight: 400,
    objectFit: "contain",
    borderRadius: 16,
    border: "1px solid rgba(0,75,141,0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#001f3d",
    margin: 0,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  timelineList: {
    display: "flex",
    flexDirection: "column",
  },
  timelineItem: {
    display: "flex",
    gap: 14,
    padding: "16px 0",
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#e8f5ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#004b8d",
    flexShrink: 0,
  },
  timelineStatus: {
    margin: 0,
    fontWeight: 600,
    fontSize: 14,
    color: "#001f3d",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  statusOld: {
    background: "#f1f1e6",
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
  },
  arrowIcon: {
    color: "#3a5068",
  },
  statusNew: {
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  timelineMeta: {
    margin: "6px 0 0",
    fontSize: 12,
    color: "#3a5068",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  timelineNotes: {
    margin: "8px 0 0",
    fontSize: 13,
    color: "#3a5068",
    fontStyle: "italic",
    background: "#f8f9ff",
    padding: "8px 12px",
    borderRadius: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  timelineDate: {
    margin: "6px 0 0",
    fontSize: 11,
    color: "#8a9bb0",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  emptyTimeline: {
    textAlign: "center",
    padding: 48,
    color: "#3a5068",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  commentList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  commentItem: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(0,75,141,0.08)",
    transition: "all 0.2s",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  commentAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
  },
  adminBadge: {
    background: "#004b8d",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 600,
  },
  commentDate: {
    fontSize: 11,
    color: "#8a9bb0",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  commentText: {
    margin: 0,
    fontSize: 14,
    color: "#001f3d",
    lineHeight: 1.5,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  emptyComments: {
    textAlign: "center",
    padding: 48,
    color: "#3a5068",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    background: "#f8f9ff",
    borderRadius: 16,
    marginBottom: 24,
  },
  commentClosed: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 18px",
    background: "#f8f9ff",
    borderRadius: 12,
    color: "#3a5068",
    fontSize: 13,
    fontFamily: "'Inter', system-ui, sans-serif",
    border: "1px solid rgba(0,75,141,0.08)",
  },
  commentForm: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1.5px solid #e2e8f0",
    outline: "none",
    resize: "vertical",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 14,
    transition: "border-color 0.2s",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 20px",
    borderRadius: 40,
    border: "none",
    background: "#004b8d",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
};