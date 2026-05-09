// app/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Clock, AlertCircle, CheckCircle, PlusCircle, ArrowRight } from "lucide-react";

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
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const [profileRes, reportsRes] = await Promise.all([
          fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/reports/my`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (profileRes.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const profileData = await profileRes.json();
        const reportsData = await reportsRes.json();

        setProfile(profileData);
        setReports(reportsData);

        const pending = reportsData.filter((r) => r.status === "pending").length;
        const process = reportsData.filter((r) =>
          ["diproses", "investigasi", "ditindak"].includes(r.status)
        ).length;
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
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-navy-700 to-teal-500 rounded-2xl p-6 text-white">
        <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
          DASHBOARD PERSONAL
        </div>
        <h2 className="text-2xl font-bold">Halo, {profile?.full_name?.split(" ")[0] || "Pengguna"}!</h2>
        <p className="text-white/80 text-sm mt-1">Lingkungan aman untuk melaporkan. Kerahasiaan Anda prioritas kami.</p>
        <div className="flex gap-4 mt-3 text-xs opacity-80">
          <span>🔒 Privasi Terjaga</span>
          <span>⚡ Respon Cepat</span>
        </div>
        <Link href="/users/report/new">
          <button className="mt-4 flex items-center gap-2 bg-orange-400 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-500 transition">
            <PlusCircle size={16} /> Buat Laporan
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center mb-2">
            <FileText size={18} />
          </div>
          <p className="text-xs text-slate-400">Total Laporan</p>
          <p className="text-2xl font-bold text-navy-700">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center mb-2">
            <Clock size={18} />
          </div>
          <p className="text-xs text-slate-400">Menunggu</p>
          <p className="text-2xl font-bold text-navy-700">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
            <AlertCircle size={18} />
          </div>
          <p className="text-xs text-slate-400">Diproses</p>
          <p className="text-2xl font-bold text-navy-700">{stats.process}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-2">
            <CheckCircle size={18} />
          </div>
          <p className="text-xs text-slate-400">Selesai</p>
          <p className="text-2xl font-bold text-navy-700">{stats.selesai}</p>
        </div>
      </div>

      {/* Riwayat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-navy-700">Riwayat Laporan</h3>
            <p className="text-xs text-slate-400">Aktivitas terbaru Anda</p>
          </div>
          <Link href="/users/history" className="text-sm text-teal-500 flex items-center gap-1 hover:text-orange-400">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {reports.length > 0 ? (
            reports.slice(0, 5).map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-navy-700 text-sm">{report.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {report.category_name || "Laporan"} • {new Date(report.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    report.status === "pending" ? "bg-orange-50 text-orange-400" :
                    report.status === "selesai" ? "bg-green-50 text-green-500" :
                    "bg-blue-50 text-blue-500"
                  }`}>
                    {report.status === "pending" ? "Menunggu" : report.status === "selesai" ? "Selesai" : "Diproses"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Belum ada laporan yang dibuat</p>
              <Link href="/users/report/new" className="inline-block mt-2 text-sm text-teal-500 hover:underline">
                Buat laporan pertama →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}