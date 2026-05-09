"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/reports/my", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengambil data laporan");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":   return { background: '#fff7d6', color: '#b07d00' };
      case "diproses":  return { background: '#e8f5ff', color: '#004b8d' };
      case "selesai":   return { background: '#e6f9f4', color: '#0a7c5c' };
      case "rejected":  return { background: '#fde8e8', color: '#c0392b' };
      default:          return { background: '#f1f1e6', color: '#3a5068' };
    }
  };

  const getStatusLabel = (status) => {
    const map = { pending: 'Menunggu', diproses: 'Diproses', selesai: 'Selesai', rejected: 'Ditolak' };
    return map[status] || status;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 28, fontWeight: 800, color: '#001f3d', marginBottom: 6 }}>
          Riwayat Laporan Saya
        </h1>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: '#3a5068' }}>
          Semua laporan yang pernah Anda buat.
        </p>
      </div>

      {/* States */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', gap: 12 }}>
          <div style={{ width: 32, height: 32, border: '3px solid #f1f1e6', borderTopColor: '#004b8d', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ color: '#3a5068', fontSize: 14, fontFamily: "'Inter', system-ui" }}>Memuat data...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ background: '#fde8e8', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 14, padding: '12px 18px', color: '#c0392b', fontFamily: "'Inter', system-ui", fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {!loading && reports.length === 0 && !error && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.1)', padding: '60px 20px', textAlign: 'center' }}>
          <FileText style={{ color: '#c8d6e5', margin: '0 auto 14px' }} size={48} />
          <p style={{ color: '#3a5068', fontSize: 14, fontFamily: "'Inter', system-ui", marginBottom: 10 }}>Belum ada laporan.</p>
          <Link href="/users/report/new" style={{ color: '#004b8d', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Buat laporan pertama →
          </Link>
        </div>
      )}

      {/* Report List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {reports.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#fff',
              padding: '18px 24px',
              borderRadius: 18,
              boxShadow: '0 2px 8px rgba(0,75,141,0.06)',
              border: '1px solid rgba(0,75,141,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,75,141,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,75,141,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,75,141,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,75,141,0.08)'; }}
          >
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 16, color: '#001f3d', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </h2>
              <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: '#3a5068' }}>
                {item.category_name} • {new Date(item.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <span style={{ fontSize: 12, padding: '5px 14px', borderRadius: 40, fontWeight: 700, fontFamily: "'Inter', system-ui", ...getStatusStyle(item.status) }}>
                {getStatusLabel(item.status)}
              </span>
              <Link
                href={`/users/reports/${item.id}`}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 13, fontWeight: 600, color: '#004b8d',
                  textDecoration: 'none', padding: '6px 14px',
                  borderRadius: 40, border: '1.5px solid rgba(0,75,141,0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#004b8d'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#004b8d'; }}
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}