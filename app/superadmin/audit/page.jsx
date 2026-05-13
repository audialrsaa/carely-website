// ============================================================
// app/superadmin/audit/page.jsx
// Audit Log
// ============================================================
"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

export default function SuperAdminAuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/admin/audit-logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={titleStyle}>Audit Log</h1>
        <p style={subtitleStyle}>
          Riwayat perubahan status laporan oleh admin/superadmin
        </p>
      </div>

      <div style={tableWrap}>
        <table style={tableStyle}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={thStyle}>Laporan</th>
              <th style={thStyle}>Status Lama</th>
              <th style={thStyle}>Status Baru</th>
              <th style={thStyle}>Diubah Oleh</th>
              <th style={thStyle}>Catatan</th>
              <th style={thStyle}>Tanggal</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={tdStyle}>{log.report_title}</td>
                <td style={tdStyle}>{log.old_status || "-"}</td>
                <td style={tdStyle}>{log.new_status}</td>
                <td style={tdStyle}>
                  {log.changed_by_name} ({log.changer_role})
                </td>
                <td style={tdStyle}>{log.notes || "-"}</td>
                <td style={tdStyle}>
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const titleStyle = {
  fontSize: 28,
  fontWeight: 800,
  color: "#001f3d",
};

const subtitleStyle = {
  color: "#64748b",
};

const tableWrap = {
  background: "#fff",
  borderRadius: 20,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: 16,
  fontSize: 13,
  color: "#475569",
};

const tdStyle = {
  padding: 16,
  borderTop: "1px solid #f1f5f9",
  fontSize: 14,
};