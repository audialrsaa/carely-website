// app/users/history/page.jsx — MyReportsPage
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Loader2, AlertCircle, FileQuestion, ChevronRight } from "lucide-react";

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
      case "pending":   return { background: '#fff7d6', color: '#b07d00', label: 'Menunggu' };
      case "diproses":  return { background: '#e8f5ff', color: '#004b8d', label: 'Diproses' };
      case "selesai":   return { background: '#e6f9f4', color: '#0a7c5c', label: 'Selesai' };
      case "rejected":  return { background: '#fde8e8', color: '#c0392b', label: 'Ditolak' };
      default:          return { background: '#f1f1e6', color: '#3a5068', label: status };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 32, fontWeight: 800, color: '#001f3d', marginBottom: 8 }}>
          Riwayat Laporan Saya
        </h1>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: '#3a5068' }}>
          Semua laporan yang pernah Anda buat.
        </p>
      </div>

      {/* States */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', gap: 12 }}>
          <Loader2 size={32} style={{ color: '#004b8d', animation: 'spin 1s linear infinite' }} />
          <span style={{ color: '#3a5068', fontSize: 14, fontFamily: "'Inter', system-ui" }}>Memuat data...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ 
          background: '#fde8e8', 
          border: '1px solid rgba(192,57,43,0.2)', 
          borderRadius: 12, 
          padding: '14px 20px', 
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: '#c0392b', 
          fontFamily: "'Inter', system-ui", 
          fontSize: 13, 
          marginBottom: 20 
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!loading && reports.length === 0 && !error && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.1)', padding: '60px 20px', textAlign: 'center' }}>
          <FileQuestion size={52} color="#c8d6e5" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#3a5068', fontSize: 14, fontFamily: "'Inter', system-ui", marginBottom: 12 }}>Belum ada laporan.</p>
          <Link href="/users/report/new" style={{ color: '#004b8d', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Buat laporan pertama <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Report List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reports.map((item) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <Link
              key={item.id}
              href={`/users/report/${item.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: '18px 24px',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(0,75,141,0.04)',
                  border: '1px solid rgba(0,75,141,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,75,141,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(0,75,141,0.15)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,75,141,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(0,75,141,0.08)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h2 style={{ 
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", 
                    fontWeight: 700, 
                    fontSize: 16, 
                    color: '#001f3d', 
                    marginBottom: 6,
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {item.title}
                  </h2>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: '#6c7a8e' }}>
                    {item.category_name} • {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <span style={{ 
                    fontSize: 12, 
                    padding: '5px 14px', 
                    borderRadius: 40, 
                    fontWeight: 600, 
                    fontFamily: "'Inter', system-ui", 
                    ...statusStyle 
                  }}>
                    {statusStyle.label}
                  </span>
                  <ChevronRight size={18} color="#004b8d" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}