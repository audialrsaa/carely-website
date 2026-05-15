"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  ShieldAlert,
  FileText,
  Clock,
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

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>Laporan tidak ditemukan</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 20,
          border: "1px solid #e2e8f0",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{report.title}</h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>{report.description}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 16,
            marginTop: 20,
          }}
        >
          <Info icon={<ShieldAlert size={18} />} label="Kategori" value={report.category_name} />
          <Info icon={<MapPin size={18} />} label="Lokasi" value={report.incident_location} />
          <Info
            icon={<Calendar size={18} />}
            label="Tanggal Kejadian"
            value={new Date(report.incident_date).toLocaleDateString("id-ID")}
          />
          <Info icon={<Clock size={18} />} label="Status" value={report.status} />
        </div>

        {report.bukti_foto && (
          <div style={{ marginTop: 24 }}>
            <h3>Bukti Foto</h3>
            <img
              src={report.bukti_foto}
              alt="Bukti"
              style={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                borderRadius: 16,
                marginTop: 10,
              }}
            />
          </div>
        )}
      </div>

      {/* Timeline */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 20,
          border: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Timeline Status</h2>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {timeline.map((log) => (
            <div
              key={log.id}
              style={{
                padding: 16,
                borderRadius: 14,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ fontWeight: 700 }}>
                {log.old_status || "new"} → {log.new_status}
              </p>
              <p style={{ fontSize: 14, color: "#64748b" }}>
                Oleh: {log.changed_by_name || "System"}
              </p>
              {log.notes && <p style={{ marginTop: 6 }}>{log.notes}</p>}
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                {new Date(log.created_at).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 14,
        borderRadius: 14,
        background: "#f8fafc",
      }}
    >
      {icon}
      <div>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{label}</p>
        <p style={{ margin: 0, fontWeight: 700 }}>{value}</p>
      </div>
    </div>
  );
}