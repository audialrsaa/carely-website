// ======================================================
// app/users/active-cases/page.jsx
// HALAMAN KASUS AKTIF (INTEGRASI BACKEND)
// MENAMPILKAN HANYA LAPORAN YANG BELUM SELESAI / BELUM DITOLAK
// ======================================================
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Clock,
  MapPin,
  CalendarDays,
  Search,
} from "lucide-react";

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
    const fetchReports = async () => {
      try {
        const data = await apiFetch("/reports/my");

        // FILTER KASUS AKTIF
        const activeCases = data.filter(
          (report) =>
            report.status !== "selesai" &&
            report.status !== "rejected"
        );

        setReports(activeCases);
        setFilteredReports(activeCases);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // SEARCH
  useEffect(() => {
    const filtered = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.category_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        report.incident_location
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredReports(filtered);
  }, [search, reports]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "diproses":
      case "investigasi":
      case "ditindak":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-teal-600 font-semibold">
        Loading kasus aktif...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-teal-500 mb-2">
          Kasus Aktif
        </h1>
        <p className="text-gray-600">
          Pantau laporan yang sedang diproses atau menunggu tindak lanjut.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl border shadow-sm p-4 mb-8">
        <div className="flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, kategori, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-3xl border shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="text-yellow-600" />
          </div>

          <div>
            <p className="text-gray-500">Total Kasus Aktif</p>
            <h2 className="text-3xl font-bold">
              {filteredReports.length}
            </h2>
          </div>
        </div>
      </div>

      {/* List Kasus */}
      <div className="space-y-6">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-md transition"
            >
              {/* Top */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {report.title}
                  </h2>

                  <p className="text-teal-600 font-medium mt-1">
                    {report.category_name}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-4 leading-relaxed">
                {report.description}
              </p>

              {/* Detail */}
              <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>
                    {report.incident_location || "Lokasi tidak tersedia"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span>
                    {report.incident_date
                      ? new Date(
                          report.incident_date
                        ).toLocaleDateString("id-ID")
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    Dibuat:{" "}
                    {new Date(report.created_at).toLocaleDateString(
                      "id-ID"
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border shadow-sm p-12 text-center">
            <AlertCircle
              className="mx-auto text-gray-300 mb-4"
              size={48}
            />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Tidak Ada Kasus Aktif
            </h3>
            <p className="text-gray-500">
              Semua laporan Anda sudah selesai atau belum ada laporan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}