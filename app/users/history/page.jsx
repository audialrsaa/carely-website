"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data laporan");
      }

      const data = await res.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "diproses":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Riwayat Laporan Saya</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && reports.length === 0 && (
        <p className="text-gray-500">Belum ada laporan.</p>
      )}

      <div className="grid gap-4">
        {reports.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-500">
                {item.category_name} •{" "}
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>

              <Link
                href={`/users/reports/${item.id}`}
                className="text-blue-600 text-sm hover:underline"
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