// ============================================================
// app/admin/reports/[id]/page.jsx
// Detail Laporan Admin + Update Status FIXED
// STATUS DB VALID:
// pending | diperiksa | diverifikasi | rejected | tindak_lanjut | selesai
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =========================================
  // FETCH DETAIL
  // =========================================
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
        console.error("Fetch detail gagal:", text);

        if (res.status === 401) {
          localStorage.clear();
          router.push("/login");
        }

        return;
      }

      const data = await res.json();

      setReport(data.report);
      setTimeline(data.timeline || []);
      setNewStatus(data.report.status);
    } catch (err) {
      console.error("Fetch detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  // =========================================
  // UPDATE STATUS
  // =========================================
  const updateStatus = async () => {
    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      const payload = {
        new_status: newStatus,
        notes: notes || `Status diubah menjadi ${newStatus}`,
      };

      const res = await fetch(`${API}/reports/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update status gagal:", text);
        alert("Gagal update status");
        return;
      }

      alert("Status berhasil diperbarui");
      setNotes("");
      fetchDetail();
    } catch (err) {
      console.error("Update status error:", err);
      alert("Terjadi kesalahan");
    } finally {
      setUpdating(false);
    }
  };

  // =========================================
  // HELPERS
  // =========================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fff7d6", color: "#b07d00", label: "Pending" };
      case "diperiksa":
        return { bg: "#eef6ff", color: "#004b8d", label: "Diperiksa" };
      case "diverifikasi":
        return { bg: "#ede9fe", color: "#6d28d9", label: "Diverifikasi" };
      case "tindak_lanjut":
        return { bg: "#e0f2fe", color: "#0369a1", label: "Tindak Lanjut" };
      case "selesai":
        return { bg: "#e6f9f4", color: "#0a7c5c", label: "Selesai" };
      case "rejected":
        return { bg: "#fef2f2", color: "#dc2626", label: "Rejected" };
      default:
        return { bg: "#f8fafc", color: "#64748b", label: status };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "emergency":
        return { bg: "#fef2f2", color: "#dc2626", label: "Emergency" };
      case "high":
        return { bg: "#fff7d6", color: "#b07d00", label: "High" };
      case "medium":
        return { bg: "#eef6ff", color: "#004b8d", label: "Medium" };
      default:
        return { bg: "#f8fafc", color: "#64748b", label: "Low" };
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!report) {
    return <div>Laporan tidak ditemukan</div>;
  }

  const status = getStatusStyle(report.status);
  const priority = getPriorityStyle(report.priority);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* BACK */}
      <button onClick={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={18} />
        Kembali
      </button>

      {/* DETAIL */}
      <div style={styles.card}>
        <h1 style={styles.title}>{report.title}</h1>

        <p style={styles.desc}>{report.description}</p>

        {report.bukti_foto && (
          <img
            src={report.bukti_foto}
            alt="Bukti Foto"
            style={styles.image}
          />
        )}

        <div style={styles.metaGrid}>
          <MetaItem label="Pelapor" value={report.reporter_name || "-"} />
          <MetaItem label="Kategori" value={report.category_name || "-"} />
          <MetaItem
            label="Lokasi"
            value={report.incident_location || "-"}
          />
          <MetaItem
            label="Tanggal Kejadian"
            value={
              report.incident_date
                ? new Date(report.incident_date).toLocaleDateString("id-ID")
                : "-"
            }
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <span
            style={{
              ...styles.badge,
              background: status.bg,
              color: status.color,
            }}
          >
            {status.label}
          </span>

          <span
            style={{
              ...styles.badge,
              background: priority.bg,
              color: priority.color,
            }}
          >
            Prioritas: {priority.label}
          </span>
        </div>
      </div>

      {/* UPDATE STATUS */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Update Status</h2>

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          style={styles.select}
        >
          <option value="pending">Pending</option>
          <option value="diperiksa">Diperiksa</option>
          <option value="diverifikasi">Diverifikasi</option>
          <option value="tindak_lanjut">Tindak Lanjut</option>
          <option value="selesai">Selesai</option>
          <option value="rejected">Rejected</option>
        </select>

        <textarea
          placeholder="Catatan admin (opsional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
        />

        <button
          onClick={updateStatus}
          disabled={updating}
          style={styles.updateBtn}
        >
          {updating ? (
            <>
              <RefreshCcw size={16} className="spin" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Update Status
            </>
          )}
        </button>
      </div>

      {/* TIMELINE */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Timeline Status</h2>

        {timeline.length > 0 ? (
          timeline.map((log) => (
            <div key={log.id} style={styles.timelineItem}>
              <div style={styles.timelineIcon}>
                <Clock size={16} />
              </div>

              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {log.old_status || "new"} → {log.new_status}
                </p>

                <p style={styles.timelineMeta}>
                  {log.changed_by_name || "System"} •{" "}
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </p>

                {log.notes && (
                  <p style={styles.timelineNotes}>{log.notes}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Belum ada timeline.</p>
        )}
      </div>
    </div>
  );
}

// =========================================
// COMPONENTS
// =========================================
function MetaItem({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{value}</p>
    </div>
  );
}

// =========================================
// STYLES
// =========================================
const styles = {
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: 42,
    height: 42,
    border: "4px solid #dbeafe",
    borderTopColor: "#004b8d",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#004b8d",
    fontWeight: 600,
  },

  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    border: "1px solid rgba(0,75,141,0.08)",
  },

  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#001f3d",
  },

  desc: {
    marginTop: 12,
    lineHeight: 1.7,
    color: "#475569",
  },

  image: {
    width: "100%",
    maxHeight: 400,
    objectFit: "cover",
    borderRadius: 16,
    marginTop: 18,
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 18,
    marginTop: 20,
  },

  badge: {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },

  sectionTitle: {
    marginTop: 0,
    fontSize: 20,
    fontWeight: 700,
  },

  select: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    marginBottom: 14,
  },

  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    resize: "vertical",
  },

  updateBtn: {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 18px",
    border: "none",
    borderRadius: 12,
    background: "#004b8d",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  timelineItem: {
    display: "flex",
    gap: 14,
    padding: "14px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#eef6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#004b8d",
    flexShrink: 0,
  },

  timelineMeta: {
    margin: "4px 0",
    fontSize: 12,
    color: "#64748b",
  },

  timelineNotes: {
    margin: 0,
    fontSize: 13,
    color: "#334155",
  },
};