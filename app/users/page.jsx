// ======================================================
// app/users/page.jsx
// DASHBOARD USER (SIDEBAR DIHAPUS KARENA UDAH DARI LAYOUT)
// ======================================================
"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    process: 0,
    selesai: 0,
  });
  const [loading, setLoading] = useState(true);

  const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      console.error(`[apiFetch] ${res.status}`, endpoint, errBody);

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        window.location.href = "/login";
      }

      throw new Error(errBody.message || "Request gagal");
    }

    return res.json();
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileData, reportsData] = await Promise.all([
          apiFetch("/users/profile"),
          apiFetch("/reports/my"),
        ]);

        setProfile(profileData);
        setReports(reportsData);

        const pending = reportsData.filter(
          (r) => r.status === "pending"
        ).length;

        const process = reportsData.filter(
          (r) =>
            r.status === "diproses" ||
            r.status === "investigasi" ||
            r.status === "ditindak"
        ).length;

        const selesai = reportsData.filter(
          (r) => r.status === "selesai"
        ).length;

        setStats({
          total: reportsData.length,
          pending,
          process,
          selesai,
        });
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
      <div className="min-h-screen flex items-center justify-center text-teal-600 font-semibold">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="h-14 bg-white rounded-xl border mb-8"></div>

      {/* Welcome */}
      <section className="bg-[#dce9ee] rounded-3xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-teal-500 mb-3">
          Selamat Datang Kembali.
        </h2>
        <p className="text-gray-700 max-w-2xl leading-relaxed">
          Halo <span className="font-semibold">{profile?.full_name}</span>,
          Anda berada di lingkungan yang aman. Setiap laporan yang Anda buat
          dijaga kerahasiaannya dengan sistem keamanan berlapis.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Laporan"
          value={stats.total}
          icon={<FileText className="text-teal-500" />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="text-yellow-500" />}
        />
        <StatCard
          title="Diproses"
          value={stats.process}
          icon={<AlertCircle className="text-blue-500" />}
        />
        <StatCard
          title="Selesai"
          value={stats.selesai}
          icon={<CheckCircle className="text-green-500" />}
        />
      </section>

      {/* Riwayat */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-teal-500">
              Riwayat Laporan
            </h3>
            <a
              href="/users/history"
              className="text-teal-500 font-semibold"
            >
              Lihat Semua
            </a>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {reports.length > 0 ? (
              reports.slice(0, 8).map((report) => (
                <div
                  key={report.id}
                  className="border rounded-2xl p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {report.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {report.category_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(report.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : report.status === "selesai"
                          ? "bg-green-100 text-green-700"
                          : report.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                Belum ada laporan.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* Stat Card */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-gray-500 mb-1">{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}