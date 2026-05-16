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
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserReportDetailPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/reports/my/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Gagal mengambil detail laporan");
          return;
        }

        setReport(data.report);
        setTimeline(data.timeline);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { background: '#fff7d6', color: '#b07d00', label: 'Menunggu', icon: Clock };
      case "diproses":
        return { background: '#e8f5ff', color: '#004b8d', label: 'Diproses', icon: Activity };
      case "investigasi":
        return { background: '#e8f5ff', color: '#004b8d', label: 'Investigasi', icon: ShieldAlert };
      case "ditindak":
        return { background: '#e8f5ff', color: '#004b8d', label: 'Ditindak', icon: AlertCircle };
      case "selesai":
        return { background: '#e6f9f4', color: '#0a7c5c', label: 'Selesai', icon: CheckCircle };
      case "rejected":
        return { background: '#fde8e8', color: '#c0392b', label: 'Ditolak', icon: AlertCircle };
      default:
        return { background: '#f1f1e6', color: '#3a5068', label: status || 'Unknown', icon: FileText };
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        gap: 16
      }}>
        <Loader2 size={40} style={{ color: "#004b8d", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#3a5068", fontFamily: "'Inter', system-ui" }}>Memuat detail laporan...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        gap: 16,
        textAlign: "center"
      }}>
        <AlertCircle size={48} color="#c0392b" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#001f3d" }}>Laporan Tidak Ditemukan</h2>
        <p style={{ color: "#3a5068" }}>Laporan yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link 
          href="/users" 
          style={{ 
            marginTop: 8,
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            color: "#004b8d", 
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const statusStyle = getStatusStyle(report.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Back Button */}
      <Link
        href="/users"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          color: "#004b8d",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 14,
          width: "fit-content",
          transition: "gap 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.gap = "12px"}
        onMouseLeave={(e) => e.currentTarget.style.gap = "8px"}
      >
        <ArrowLeft size={18} />
        Kembali ke Dashboard
      </Link>

      {/* Header / Report Detail Card */}
      <div
        style={{
          background: "#fff",
          padding: 28,
          borderRadius: 24,
          border: "1px solid rgba(0,75,141,0.08)",
          boxShadow: "0 4px 20px rgba(0,75,141,0.06)",
        }}
      >
        {/* Title & Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#001f3d", margin: 0, fontFamily: "'Plus Jakarta Sans', system-ui" }}>
              {report.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
              <span style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 6, 
                padding: "4px 12px", 
                borderRadius: 40, 
                fontSize: 12, 
                fontWeight: 600,
                ...statusStyle 
              }}>
                <StatusIcon size={14} />
                {statusStyle.label}
              </span>
              <span style={{ fontSize: 12, color: "#8a9bb0" }}>
                ID: {report.id}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ 
          background: "#f8f9ff", 
          padding: 20, 
          borderRadius: 16, 
          marginBottom: 24,
          border: "1px solid rgba(0,75,141,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <MessageSquare size={18} color="#004b8d" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#001f3d", margin: 0 }}>Deskripsi Kejadian</h3>
          </div>
          <p style={{ color: "#3a5068", lineHeight: 1.6, margin: 0, fontFamily: "'Inter', system-ui" }}>
            {report.description}
          </p>
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <Info icon={<ShieldAlert size={18} />} label="Kategori" value={report.category_name} />
          <Info icon={<MapPin size={18} />} label="Lokasi Kejadian" value={report.incident_location} />
          <Info
            icon={<Calendar size={18} />}
            label="Tanggal Kejadian"
            value={formatDate(report.incident_date)}
          />
          <Info icon={<Clock size={18} />} label="Dibuat Pada" value={formatDateTime(report.created_at)} />
        </div>

        {/* Photo Evidence */}
        {report.bukti_foto && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <ImageIcon size={20} color="#004b8d" />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#001f3d", margin: 0 }}>Bukti Foto</h3>
            </div>
            <div style={{
              borderRadius: 16,
              overflow: "hidden",
              background: "#f8f9ff",
              border: "1px solid rgba(0,75,141,0.1)",
              display: "inline-block",
            }}>
              <img
                src={report.bukti_foto}
                alt="Bukti laporan"
                style={{
                  maxWidth: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Timeline Card */}
      <div
        style={{
          background: "#fff",
          padding: 28,
          borderRadius: 24,
          border: "1px solid rgba(0,75,141,0.08)",
          boxShadow: "0 4px 20px rgba(0,75,141,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <Activity size={22} color="#004b8d" />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#001f3d", margin: 0, fontFamily: "'Plus Jakarta Sans', system-ui" }}>
            Timeline Status
          </h2>
        </div>

        {timeline.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {timeline.map((log, index) => {
              const isLast = index === timeline.length - 1;
              return (
                <div
                  key={log.id}
                  style={{
                    position: "relative",
                    padding: "16px 20px",
                    paddingLeft: 48,
                    borderRadius: 16,
                    background: "#fafcff",
                    border: "1px solid rgba(0,75,141,0.08)",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Timeline Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: 16,
                      top: 20,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: isLast ? "#0a7c5c" : "#004b8d",
                      border: "3px solid #fff",
                      boxShadow: "0 0 0 2px rgba(0,75,141,0.2)",
                    }}
                  />
                  
                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      style={{
                        position: "absolute",
                        left: 25,
                        top: 40,
                        width: 2,
                        height: "calc(100% + 12px)",
                        background: "rgba(0,75,141,0.15)",
                      }}
                    />
                  )}

                  <div>
                    <p style={{ 
                      fontWeight: 700, 
                      fontSize: 14, 
                      color: "#001f3d", 
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap"
                    }}>
                      {log.old_status ? (
                        <>
                          <span style={{ 
                            background: "#f1f1e6", 
                            padding: "2px 8px", 
                            borderRadius: 20, 
                            fontSize: 11,
                            fontWeight: 600
                          }}>
                            {log.old_status}
                          </span>
                          <span>→</span>
                          <span style={{ 
                            background: statusStyle.background, 
                            color: statusStyle.color,
                            padding: "2px 8px", 
                            borderRadius: 20, 
                            fontSize: 11,
                            fontWeight: 600
                          }}>
                            {log.new_status}
                          </span>
                        </>
                      ) : (
                        <span style={{ 
                          background: statusStyle.background, 
                          color: statusStyle.color,
                          padding: "2px 8px", 
                          borderRadius: 20, 
                          fontSize: 11,
                          fontWeight: 600
                        }}>
                          {log.new_status}
                        </span>
                      )}
                    </p>
                    
                    <p style={{ 
                      fontSize: 13, 
                      color: "#6c7a8e", 
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}>
                      <User size={14} />
                      Oleh: {log.changed_by_name || "System"}
                    </p>
                    
                    {log.notes && (
                      <p style={{ 
                        fontSize: 13, 
                        color: "#3a5068", 
                        marginTop: 8,
                        background: "#f1f1e6",
                        padding: "8px 12px",
                        borderRadius: 12,
                        fontStyle: "italic"
                      }}>
                        "{log.notes}"
                      </p>
                    )}
                    
                    <p style={{ 
                      fontSize: 11, 
                      color: "#8a9bb0", 
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      <Clock size={12} />
                      {formatDateTime(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "48px 20px",
            background: "#f8f9ff",
            borderRadius: 16,
          }}>
            <FileText size={40} color="#c8d6e5" />
            <p style={{ color: "#3a5068", marginTop: 12, fontSize: 14 }}>
              Belum ada update status untuk laporan ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        padding: "14px 18px",
        borderRadius: 16,
        background: "#f8f9ff",
        border: "1px solid rgba(0,75,141,0.06)",
        transition: "all 0.2s",
      }}
    >
      <div style={{ 
        width: 36, 
        height: 36, 
        borderRadius: 12, 
        background: "rgba(0,75,141,0.08)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#004b8d"
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: "#6c7a8e", fontWeight: 500, letterSpacing: 0.5 }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#001f3d" }}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}