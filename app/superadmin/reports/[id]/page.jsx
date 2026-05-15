"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API = "http://localhost:5000/api";

export default function SuperAdminReportDetailPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/reports/${id}`, {
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
      {/* Main */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          border: "1px solid #e2e8f0",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{report.title}</h1>
        <p>{report.description}</p>

        <div style={{ marginTop: 20 }}>
          <p><strong>Pelapor:</strong> {report.reporter_name}</p>
          <p><strong>Email:</strong> {report.reporter_email}</p>
          <p><strong>Telepon:</strong> {report.reporter_phone || "-"}</p>
          <p><strong>Kategori:</strong> {report.category_name}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Prioritas:</strong> {report.priority}</p>
          <p><strong>Lokasi:</strong> {report.incident_location}</p>
        </div>

        {report.bukti_foto && (
          <img
            src={report.bukti_foto}
            alt="Bukti"
            style={{
              width: "100%",
              marginTop: 20,
              borderRadius: 16,
              maxHeight: 450,
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Timeline */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          border: "1px solid #e2e8f0",
        }}
      >
        <h2>Audit Timeline</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
          {timeline.map((log) => (
            <div
              key={log.id}
              style={{
                padding: 16,
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                background: "#f8fafc",
              }}
            >
              <strong>
                {log.old_status || "new"} → {log.new_status}
              </strong>
              <p>By: {log.changed_by_name || "System"}</p>
              <p>Role: {log.changer_role}</p>
              {log.notes && <p>Notes: {log.notes}</p>}
              <small>{new Date(log.created_at).toLocaleString("id-ID")}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}