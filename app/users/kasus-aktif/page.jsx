// ============================================================
// app/users/active-cases/page.jsx — ActiveCasesPage (palet baru)
// ============================================================
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock, MapPin, CalendarDays, Search } from "lucide-react";

const API = "http://localhost:5000/api";

export default function ActiveCasesPage() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}${endpoint}`, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }
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
      case "pending": return { background: '#fff7d6', color: '#b07d00' };
      case "diproses": case "investigasi": case "ditindak": return { background: '#e8f5ff', color: '#004b8d' };
      case "selesai": return { background: '#e6f9f4', color: '#0a7c5c' };
      case "rejected": return { background: '#fde8e8', color: '#c0392b' };
      default: return { background: '#f1f1e6', color: '#3a5068' };
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#004b8d', fontWeight: 600, fontFamily: "'Inter', system-ui" }}>
        Memuat kasus aktif...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 36, fontWeight: 800, color: '#004b8d', marginBottom: 8 }}>Kasus Aktif</h1>
        <p style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#3a5068', fontSize: 15 }}>Pantau laporan yang sedang diproses atau menunggu tindak lanjut.</p>
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.15)', boxShadow: '0 2px 8px rgba(0,75,141,0.05)', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Search style={{ color: '#3a5068' }} size={20} />
        <input type="text" placeholder="Cari berdasarkan judul, kategori, atau lokasi..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', outline: 'none', border: 'none', background: 'transparent', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: '#001f3d' }} />
      </div>

      {/* Stats */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.1)', boxShadow: '0 2px 8px rgba(0,75,141,0.05)', padding: 24, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff7d6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle style={{ color: '#b07d00' }} />
        </div>
        <div>
          <p style={{ color: '#3a5068', fontSize: 13, fontFamily: "'Inter', system-ui" }}>Total Kasus Aktif</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#001f3d', fontFamily: "'Plus Jakarta Sans', system-ui" }}>{filteredReports.length}</h2>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredReports.length > 0 ? filteredReports.map((report) => (
          <div key={report.id} style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.1)', boxShadow: '0 2px 8px rgba(0,75,141,0.05)', padding: 24, transition: 'box-shadow 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,75,141,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,75,141,0.05)'}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#001f3d', fontFamily: "'Plus Jakarta Sans', system-ui" }}>{report.title}</h2>
                <p style={{ color: '#43acff', fontWeight: 600, fontSize: 14, marginTop: 4 }}>{report.category_name}</p>
              </div>
              <span style={{ padding: '6px 16px', borderRadius: 40, fontSize: 13, fontWeight: 700, ...getStatusStyle(report.status) }}>{report.status}</span>
            </div>
            <p style={{ color: '#3a5068', marginTop: 14, lineHeight: 1.7, fontSize: 14, fontFamily: "'Inter', system-ui" }}>{report.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20, fontSize: 13, color: '#3a5068', fontFamily: "'Inter', system-ui" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={15} />{report.incident_location || "Lokasi tidak tersedia"}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CalendarDays size={15} />{report.incident_date ? new Date(report.incident_date).toLocaleDateString("id-ID") : "-"}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15} />Dibuat: {new Date(report.created_at).toLocaleDateString("id-ID")}</div>
            </div>
          </div>
        )) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(0,75,141,0.1)', padding: '60px 20px', textAlign: 'center' }}>
            <AlertCircle style={{ color: '#c8d6e5', margin: '0 auto 16px' }} size={48} />
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#001f3d', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', system-ui" }}>Tidak Ada Kasus Aktif</h3>
            <p style={{ color: '#3a5068', fontSize: 14, fontFamily: "'Inter', system-ui" }}>Semua laporan Anda sudah selesai atau belum ada laporan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

