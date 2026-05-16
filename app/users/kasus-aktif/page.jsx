// ============================================================
// app/users/active-cases/page.jsx — ActiveCasesPage
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, MapPin, CalendarDays, Search, Loader2, FileQuestion, Shield } from "lucide-react";
import Link from "next/link";

const API = "http://localhost:5000/api";

export default function ActiveCasesPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}${endpoint}`, { 
      ...options, 
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`, 
        ...(options.headers || {}) 
      } 
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) { 
        localStorage.removeItem("token"); 
        localStorage.removeItem("user"); 
        window.location.href = "/login"; 
      }
      throw new Error(errBody.message || "Request gagal");
    }
    return res.json();
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiFetch("/reports/my");
        const activeCases = data.filter((r) => r.status !== "selesai" && r.status !== "rejected");
        setReports(activeCases);
        setFilteredReports(activeCases);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.incident_location?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [search, reports]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return { background: '#fff7d6', color: '#b07d00', label: 'Menunggu' };
      case "diproses": return { background: '#e8f5ff', color: '#004b8d', label: 'Diproses' };
      case "investigasi": return { background: '#e8f5ff', color: '#004b8d', label: 'Investigasi' };
      case "ditindak": return { background: '#e8f5ff', color: '#004b8d', label: 'Ditindak' };
      case "selesai": return { background: '#e6f9f4', color: '#0a7c5c', label: 'Selesai' };
      case "rejected": return { background: '#fde8e8', color: '#c0392b', label: 'Ditolak' };
      default: return { background: '#f1f1e6', color: '#3a5068', label: status };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={40} style={{ color: '#004b8d', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 12, color: '#3a5068', fontFamily: "'Inter', system-ui" }}>Memuat kasus aktif...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Shield size={28} color="#004b8d" />
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 32, fontWeight: 800, color: '#004b8d', margin: 0 }}>Kasus Aktif</h1>
        </div>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#3a5068', fontSize: 15, marginLeft: 40 }}>
          Pantau laporan yang sedang diproses atau menunggu tindak lanjut.
        </p>
      </div>

      {/* Search */}
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        border: '1px solid rgba(0,75,141,0.12)', 
        boxShadow: '0 2px 8px rgba(0,75,141,0.04)', 
        padding: '12px 20px', 
        marginBottom: 24, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12 
      }}>
        <Search size={20} color="#8a9bb0" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan judul, kategori, atau lokasi..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ 
            width: '100%', 
            outline: 'none', 
            border: 'none', 
            background: 'transparent', 
            fontFamily: "'Inter', system-ui, sans-serif", 
            fontSize: 14, 
            color: '#001f3d' 
          }} 
        />
      </div>

      {/* Stats */}
      <div style={{ 
        background: 'linear-gradient(135deg, #f1f1e6, #fff)', 
        borderRadius: 20, 
        border: '1px solid rgba(0,75,141,0.1)', 
        padding: '20px 28px', 
        marginBottom: 28, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff7d6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={28} color="#b07d00" />
          </div>
          <div>
            <p style={{ color: '#3a5068', fontSize: 13, fontFamily: "'Inter', system-ui", marginBottom: 4 }}>Total Kasus Aktif</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#001f3d', fontFamily: "'Plus Jakarta Sans', system-ui", margin: 0 }}>{filteredReports.length}</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '6px 14px', borderRadius: 20, background: '#fff7d6', fontSize: 12, fontWeight: 600, color: '#b07d00' }}>
            Menunggu: {reports.filter(r => r.status === 'pending').length}
          </div>
          <div style={{ padding: '6px 14px', borderRadius: 20, background: '#e8f5ff', fontSize: 12, fontWeight: 600, color: '#004b8d' }}>
            Diproses: {reports.filter(r => ['diproses', 'investigasi', 'ditindak'].includes(r.status)).length}
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredReports.length > 0 ? filteredReports.map((report) => {
          const statusStyle = getStatusStyle(report.status);
          return (
            <Link 
              key={report.id} 
              href={`/users/report/${report.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div 
                style={{ 
                  background: '#fff', 
                  borderRadius: 20, 
                  border: '1px solid rgba(0,75,141,0.1)', 
                  boxShadow: '0 2px 8px rgba(0,75,141,0.04)', 
                  padding: 24, 
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,75,141,0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,75,141,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#001f3d', fontFamily: "'Plus Jakarta Sans', system-ui", margin: 0 }}>
                      {report.title}
                    </h2>
                    <p style={{ color: '#43acff', fontWeight: 600, fontSize: 13, marginTop: 6 }}>{report.category_name}</p>
                  </div>
                  <span style={{ padding: '6px 16px', borderRadius: 40, fontSize: 12, fontWeight: 700, ...statusStyle }}>
                    {statusStyle.label}
                  </span>
                </div>
                <p style={{ color: '#3a5068', lineHeight: 1.6, fontSize: 14, fontFamily: "'Inter', system-ui", margin: 0 }}>
                  {report.description.length > 150 ? report.description.substring(0, 150) + '...' : report.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 16, fontSize: 13, color: '#6c7a8e', fontFamily: "'Inter', system-ui" }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} />{report.incident_location || "Lokasi tidak tersedia"}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarDays size={14} />{report.incident_date ? new Date(report.incident_date).toLocaleDateString("id-ID") : "-"}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} />Dibuat: {new Date(report.created_at).toLocaleDateString("id-ID")}</div>
                </div>
              </div>
            </Link>
          );
        }) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.1)', padding: '60px 20px', textAlign: 'center' }}>
            <FileQuestion size={52} color="#c8d6e5" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#001f3d', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', system-ui" }}>Tidak Ada Kasus Aktif</h3>
            <p style={{ color: '#3a5068', fontSize: 14, fontFamily: "'Inter', system-ui", marginBottom: 20 }}>Semua laporan Anda sudah selesai atau belum ada laporan.</p>
            <Link href="/users/report/new" style={{ color: '#004b8d', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Buat laporan baru →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}