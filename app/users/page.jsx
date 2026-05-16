// ============================================================
// app/users/page.jsx — UserDashboardPage (palet baru)
// ============================================================
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Clock, AlertCircle, CheckCircle, PlusCircle, ArrowRight, Shield, Zap } from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, process: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { window.location.href = "/login"; return; }

        const [profileRes, reportsRes] = await Promise.all([
          fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/reports/my`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (profileRes.status === 401) { localStorage.clear(); window.location.href = "/login"; return; }

        const profileData = await profileRes.json();
        const reportsData = await reportsRes.json();

        setProfile(profileData);
        setReports(reportsData);

        const pending = reportsData.filter((r) => r.status === "pending").length;
        const process = reportsData.filter((r) => ["diproses", "investigasi", "ditindak"].includes(r.status)).length;
        const selesai = reportsData.filter((r) => r.status === "selesai").length;

        setStats({ total: reportsData.length, pending, process, selesai });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
        <div style={{ width: 40, height: 40, border: '4px solid #f1f1e6', borderTopColor: '#004b8d', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const statCards = [
    { icon: <FileText size={18} />, label: 'Total Laporan', value: stats.total, bg: '#f1f1e6', color: '#004b8d' },
    { icon: <Clock size={18} />, label: 'Menunggu', value: stats.pending, bg: '#fff7d6', color: '#b07d00' },
    { icon: <AlertCircle size={18} />, label: 'Diproses', value: stats.process, bg: '#e8f5ff', color: '#004b8d' },
    { icon: <CheckCircle size={18} />, label: 'Selesai', value: stats.selesai, bg: '#e6f9f4', color: '#0a7c5c' },
  ];

  const getStatusStyle = (status) => {
    if (status === 'pending') return { background: '#fff7d6', color: '#b07d00' };
    if (status === 'selesai') return { background: '#e6f9f4', color: '#0a7c5c' };
    return { background: '#e8f5ff', color: '#004b8d' };
  };

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Menunggu';
    if (status === 'selesai') return 'Selesai';
    return 'Diproses';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #004b8d, #43acff)', borderRadius: 20, padding: 28, color: '#fff' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 40, padding: '6px 16px', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
          <Shield size={14} />
          DASHBOARD PERSONAL
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Halo, {profile?.full_name?.split(" ")[0] || "Pengguna"}!</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>Lingkungan aman untuk melaporkan. Kerahasiaan Anda prioritas kami.</p>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, opacity: 0.85, marginBottom: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} /> Privasi Terjaga</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} /> Respon Cepat</span>
        </div>
        <Link href="/users/report/new">
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#004b8d', border: 'none', borderRadius: 40, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
            <PlusCircle size={16} /> Buat Laporan
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,75,141,0.08)', border: '1px solid rgba(0,75,141,0.06)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{s.icon}</div>
            <p style={{ fontSize: 12, color: '#3a5068', marginBottom: 4, fontWeight: 500 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#001f3d' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Riwayat */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,75,141,0.08)', border: '1px solid rgba(0,75,141,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f1e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#001f3d', fontSize: 18 }}>Riwayat Laporan</h3>
            <p style={{ fontSize: 13, color: '#3a5068', marginTop: 2 }}>Aktivitas terbaru Anda</p>
          </div>
          <Link href="/users/history" style={{ fontSize: 13, color: '#004b8d', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#43acff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#004b8d'}>
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        {reports.length > 0 ? reports.slice(0, 5).map((report) => (
          <div key={report.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f1e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div>
              <h4 style={{ fontWeight: 600, color: '#001f3d', fontSize: 15, marginBottom: 4 }}>{report.title}</h4>
              <p style={{ fontSize: 12, color: '#3a5068' }}>{report.category_name || "Laporan"} • {new Date(report.created_at).toLocaleDateString("id-ID")}</p>
            </div>
            <span style={{ fontSize: 12, padding: '4px 14px', borderRadius: 40, fontWeight: 600, ...getStatusStyle(report.status) }}>
              {getStatusLabel(report.status)}
            </span>
          </div>
        )) : (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <FileText style={{ color: '#c8d6e5', margin: '0 auto 16px' }} size={52} />
            <p style={{ color: '#3a5068', fontSize: 14, marginBottom: 12 }}>Belum ada laporan yang dibuat</p>
            <Link href="/users/report/new" style={{ display: 'inline-block', fontSize: 14, color: '#004b8d', textDecoration: 'none', fontWeight: 600 }}>Buat laporan pertama →</Link>
          </div>
        )}
      </div>
    </div>
  );
}