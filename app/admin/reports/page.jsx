// app/admin/reports/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  RefreshCcw,
  Trash2,
  FileText,
  Calendar,
  User,
} from "lucide-react"; // import icon-icon dari lucide
import Swal from "sweetalert2"; // library popup konfirmasi

const API = "http://localhost:5000/api"; // base URL backend

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);          // semua laporan dari API
  const [filtered, setFiltered] = useState([]);        // laporan setelah difilter
  const [loading, setLoading] = useState(true);        // status loading data
  const [search, setSearch] = useState("");            // kata kunci pencarian
  const [statusFilter, setStatusFilter] = useState("all");     // filter aktif by status
  const [categoryFilter, setCategoryFilter] = useState("all"); // filter aktif by kategori
  const [categories, setCategories] = useState([]);    // daftar kategori dari API
  const [isMobile, setIsMobile] = useState(false);     // flag tampilan mobile/desktop

  // daftar kategori beserta warna badge-nya
  const categoriesList = [
    { id: 1, name: "Kekerasan Fisik",    color: "#DC2626", bg: "#FEE2E2" },
    { id: 2, name: "Kekerasan Verbal",   color: "#F59E0B", bg: "#FEF3C7" },
    { id: 3, name: "Kekerasan Seksual",  color: "#EC4899", bg: "#FCE7F3" },
    { id: 4, name: "Penelantaran Anak",  color: "#8B5CF6", bg: "#EDE9FE" },
    { id: 5, name: "KDRT",               color: "#EF4444", bg: "#FEE2E2" },
    { id: 6, name: "Lainnya",            color: "#6B7280", bg: "#F3F4F6" },
  ];

  // daftar status laporan beserta warna badge-nya
  const statusList = [
    { key: "pending",       label: "Menunggu",      bg: "#FEF3C7", color: "#D97706" },
    { key: "diperiksa",     label: "Diperiksa",     bg: "#DBEAFE", color: "#2563EB" },
    { key: "diverifikasi",  label: "Diverifikasi",  bg: "#E0E7FF", color: "#4F46E5" },
    { key: "tindak_lanjut", label: "Tindak Lanjut", bg: "#E0E7FF", color: "#4F46E5" },
    { key: "selesai",       label: "Selesai",       bg: "#D1FAE5", color: "#059669" },
    { key: "rejected",      label: "Ditolak",       bg: "#FEE2E2", color: "#DC2626" },
  ];

  // deteksi ukuran layar, update isMobile saat window di-resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint mobile 768px
    };
    checkMobile();                                        // cek saat pertama render
    window.addEventListener("resize", checkMobile);      // pantau perubahan ukuran layar
    return () => window.removeEventListener("resize", checkMobile); // cleanup saat unmount
  }, []);

  // ambil daftar kategori dari API
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/reports/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []); // pastikan selalu array
    } catch (err) {
      console.error("Fetch Categories Error:", err);
    }
  };

  // ambil semua laporan dari API
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { window.location.href = "/login"; return; } // belum login, redirect

      const res = await fetch(`${API}/reports`, {
        headers: { Authorization: `Bearer ${token}` }, // sertakan token auth
      });

      if (!res.ok) {
        if (res.status === 401) { localStorage.clear(); window.location.href = "/login"; } // token expired
        return;
      }

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);  // simpan semua data
      setFiltered(Array.isArray(data) ? data : []); // tampilkan semua sebelum difilter
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // matikan loading apapun hasilnya
    }
  };

  // fetch data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchReports();
    fetchCategories();
  }, []);

  // jalankan ulang filter setiap kali search/status/kategori/data berubah
  useEffect(() => {
    let temp = [...reports]; // salin agar data asli tidak termutasi

    if (search) { // filter by judul atau nama pelapor
      temp = temp.filter(
        (r) =>
          r.title?.toLowerCase().includes(search.toLowerCase()) ||
          r.reporter_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all")   // filter by status jika bukan "all"
      temp = temp.filter((r) => r.status === statusFilter);

    if (categoryFilter !== "all") // filter by kategori jika bukan "all"
      temp = temp.filter((r) => r.category_id === parseInt(categoryFilter));

    setFiltered(temp); // update hasil filter ke state
  }, [search, statusFilter, categoryFilter, reports]);

  // hitung jumlah laporan per status untuk stat card
  const statusCounts = statusList.map((s) => ({
    ...s,
    count: reports.filter((r) =>
      r.status === s.key || r.status === s.key.replace("rejected", "ditolak") // handle alias 'ditolak'
    ).length,
  }));

  // hitung jumlah laporan per kategori untuk stat card
  const categoryCounts = categoriesList.map((cat) => ({
    ...cat,
    count: reports.filter((r) => r.category_id === cat.id).length,
  }));

  // tampilkan konfirmasi lalu kirim request hapus laporan
  const deleteReport = async (id) => {
    const result = await Swal.fire({ // popup konfirmasi sebelum hapus
      title: "Hapus laporan ini?",
      text: "Laporan yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return; // user klik batal, hentikan proses

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) { // gagal hapus, tampilkan error
        Swal.fire({ icon: "error", title: "Gagal", text: "Gagal menghapus laporan", confirmButtonColor: "#2563EB" });
        return;
      }

      // sukses hapus, tampilkan notif lalu refresh data
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Laporan berhasil dihapus", timer: 1500, showConfirmButton: false });
      fetchReports();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi kesalahan", confirmButtonColor: "#2563EB" });
    }
  };

  // kembalikan style badge berdasarkan nilai prioritas
  const getPriorityStyle = (priority) => {
    if (!priority || priority === "") // belum ada prioritas
      return { bg: "#FEF3C7", color: "#D97706", label: "Menunggu Prioritas" };
    const map = {
      emergency: { bg: "#FEE2E2", color: "#DC2626", label: "Darurat" },
      high:      { bg: "#FEF3C7", color: "#D97706", label: "Tinggi" },
      medium:    { bg: "#DBEAFE", color: "#2563EB", label: "Sedang" },
      low:       { bg: "#F3F4F6", color: "#6B7280", label: "Rendah" },
    };
    return map[priority] || { bg: "#F3F4F6", color: "#6B7280", label: priority }; // fallback
  };

  // kembalikan style badge berdasarkan nilai status
  const getStatusStyle = (status) => {
    if (!status) return { bg: "#F3F4F6", color: "#6B7280", label: "-" }; // status kosong
    const map = {
      pending:       { bg: "#FEF3C7", color: "#D97706", label: "Menunggu" },
      diperiksa:     { bg: "#DBEAFE", color: "#2563EB", label: "Diperiksa" },
      diverifikasi:  { bg: "#E0E7FF", color: "#4F46E5", label: "Diverifikasi" },
      tindak_lanjut: { bg: "#E0E7FF", color: "#4F46E5", label: "Tindak Lanjut" },
      selesai:       { bg: "#D1FAE5", color: "#059669", label: "Selesai" },
      rejected:      { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak" },
      ditolak:       { bg: "#FEE2E2", color: "#DC2626", label: "Ditolak" }, // alias rejected
    };
    return map[status] || { bg: "#F3F4F6", color: "#6B7280", label: status }; // fallback
  };

  // tampilan loading sebelum data selesai difetch
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat laporan...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // komponen statistik, bisa diklik untuk set filter aktif
  const StatsSection = () => (
    <div style={{ marginBottom: 24 }}>

      {/* stat card per status */}
      <h2 style={styles.statsSectionTitle}>Laporan per Status</h2>
      <div style={styles.statsGrid}>
        {statusCounts.map((s) => (
          <div
            key={s.key}
            onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)} // toggle filter
            style={{
              ...styles.statCard,
              border: statusFilter === s.key ? `2px solid ${s.color}` : "1px solid #E5E7EB", // highlight jika aktif
              cursor: "pointer",
            }}
          >
            <div style={{ ...styles.statDot, background: s.color }} /> {/* titik warna status */}
            <div>
              <p style={styles.statLabel}>{s.label}</p>
              <p style={{ ...styles.statCount, color: s.color }}>{s.count}</p> {/* jumlah laporan */}
            </div>
          </div>
        ))}
      </div>

      {/* stat card per kategori */}
      <h2 style={{ ...styles.statsSectionTitle, marginTop: 20 }}>Laporan per Kategori</h2>
      <div style={styles.statsGrid}>
        {categoryCounts.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setCategoryFilter(categoryFilter === String(cat.id) ? "all" : String(cat.id))} // toggle filter
            style={{
              ...styles.statCard,
              border: categoryFilter === String(cat.id) ? `2px solid ${cat.color}` : "1px solid #E5E7EB", // highlight jika aktif
              cursor: "pointer",
            }}
          >
            <div style={{ ...styles.statDot, background: cat.color }} /> {/* titik warna kategori */}
            <div>
              <p style={styles.statLabel}>{cat.name}</p>
              <p style={{ ...styles.statCount, color: cat.color }}>{cat.count}</p> {/* jumlah laporan */}
            </div>
          </div>
        ))}
      </div>

      {/* tombol reset filter, muncul hanya jika ada filter aktif */}
      {(statusFilter !== "all" || categoryFilter !== "all") && (
        <button
          onClick={() => { setStatusFilter("all"); setCategoryFilter("all"); }} // reset semua filter
          style={styles.clearFilterBtn}
        >
          Hapus Filter ×
        </button>
      )}
    </div>
  );

  // =====================
  // TAMPILAN MOBILE
  // =====================
  if (isMobile) {
    return (
      <div style={{ ...styles.container, padding: "16px" }}>

        {/* header halaman */}
        <div style={styles.header}>
          <div>
            <div style={styles.headerBadge}>Admin Panel</div>
            <h1 style={{ ...styles.title, fontSize: "24px" }}>Kelola Laporan</h1>
            <p style={styles.subtitle}>Admin dapat memeriksa, memverifikasi, menindak lanjuti, atau menyelesaikan laporan</p>
          </div>
          <div style={{ ...styles.statsBadge, padding: "4px 12px", fontSize: "11px" }}>
            <FileText size={14} />
            Total: {reports.length} {/* total semua laporan */}
          </div>
        </div>

        <StatsSection /> {/* statistik laporan per status & kategori */}

        {/* area filter pencarian */}
        <div style={styles.filterCard}>
          <div style={styles.searchBox}>
            <Search size={18} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Cari judul atau pelapor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)} // update kata kunci
              style={styles.searchInput}
            />
          </div>

          {/* dropdown filter kategori */}
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ ...styles.select, width: "100%", marginTop: 8 }}>
            <option value="all">Semua Kategori</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* dropdown filter status */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...styles.select, width: "100%", marginTop: 8 }}>
            <option value="all">Semua Status</option>
            {statusList.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          {/* tombol refresh data */}
          <button onClick={fetchReports} style={{ ...styles.refreshBtn, marginTop: 8 }}>
            <RefreshCcw size={16} />
          </button>
        </div>

        {/* info jumlah laporan yang ditampilkan */}
        <div style={styles.resultInfo}>
          <p>Menampilkan {filtered.length} dari {reports.length} laporan</p>
        </div>

        {/* daftar laporan dalam bentuk card mobile */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: "300px" }}>
          {filtered.length > 0 ? (
            filtered.map((report) => {
              const priority = getPriorityStyle(report.priority);  // style badge prioritas
              const status = getStatusStyle(report.status);        // style badge status
              const category = categoriesList.find(cat => cat.id === report.category_id); // data kategori
              return (
                <div key={report.id} style={styles.mobileCard}>

                  {/* header card: ikon + judul + nama pelapor */}
                  <div style={styles.mobileCardHeader}>
                    <div style={styles.mobileCardIcon}><FileText size={20} color="#2563EB" /></div>
                    <div style={styles.mobileCardTitle}>
                      <h3>{report.title || "-"}</h3>
                      <span style={styles.mobileCardReporter}><User size={12} /> {report.reporter_name || "User"}</span>
                    </div>
                  </div>

                  {/* info detail laporan */}
                  <div style={styles.mobileCardInfo}>
                    <div style={styles.mobileCardRow}>
                      <span style={styles.mobileCardLabel}>Kategori:</span>
                      <span style={{ ...styles.badge, backgroundColor: category?.bg || "#F3F4F6", color: category?.color || "#6B7280" }}>
                        {category?.name || "-"}
                      </span>
                    </div>
                    <div style={styles.mobileCardRow}>
                      <span style={styles.mobileCardLabel}>Prioritas:</span>
                      <span style={{ ...styles.badge, backgroundColor: priority.bg, color: priority.color }}>{priority.label}</span>
                    </div>
                    <div style={styles.mobileCardRow}>
                      <span style={styles.mobileCardLabel}>Status:</span>
                      <span style={{ ...styles.badge, backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                    </div>
                    <div style={styles.mobileCardRow}>
                      <span style={styles.mobileCardLabel}>Tanggal:</span>
                      <span>{new Date(report.created_at).toLocaleDateString("id-ID")}</span> {/* format tanggal Indonesia */}
                    </div>
                  </div>

                  {/* tombol aksi: lihat detail & hapus */}
                  <div style={styles.mobileCardActions}>
                    {report.priority ? (
                      <Link href={`/admin/reports/${report.id}`} style={styles.detailBtn}>
                        <Eye size={16} /> {/* tombol lihat detail jika sudah ada prioritas */}
                      </Link>
                    ) : (
                      <button disabled title="Menunggu prioritas dari superadmin" style={{ ...styles.detailBtn, opacity: 0.5, cursor: "not-allowed", border: "none" }}>
                        <Eye size={16} /> {/* disabled jika belum diprioritaskan */}
                      </button>
                    )}
                    <button onClick={() => deleteReport(report.id)} style={styles.deleteBtn}>
                      <Trash2 size={16} /> {/* tombol hapus laporan */}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            // empty state jika tidak ada laporan
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px", width: "100%" }}>
              <div style={styles.emptyState}>
                <FileText size={48} color="#D1D5DB" />
                <p style={styles.emptyText}>Tidak ada laporan ditemukan</p>
                <p style={styles.emptySubtext}>
                  {search || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Coba dengan filter yang berbeda" // ada filter aktif
                    : "Belum ada laporan yang masuk"}   // tidak ada laporan sama sekali
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TAMPILAN DESKTOP
  return (
    <div style={{ ...styles.container, padding: "32px 24px" }}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerBadge}>Admin Panel</div>
          <h1 style={{ ...styles.title, fontSize: "32px" }}>Kelola Laporan</h1>
          <p style={styles.subtitle}>Admin dapat memeriksa, memverifikasi, menindak lanjuti, atau menyelesaikan laporan</p>
        </div>
        <div style={{ ...styles.statsBadge, padding: "8px 16px", fontSize: "13px" }}>
          <FileText size={16} />
          Total: {reports.length}
        </div>
      </div>

      <StatsSection />

      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <Search size={18} color="#9CA3AF" />
          <input type="text" placeholder="Cari judul atau pelapor..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />
        </div>
        <div style={styles.filterRight}>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={styles.select}>
            <option value="all">Semua Kategori</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.select}>
            <option value="all">Semua Status</option>
            {statusList.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <button onClick={fetchReports} style={styles.refreshBtn}><RefreshCcw size={16} /></button>
        </div>
      </div>

      <div style={styles.resultInfo}>
        <p>Menampilkan {filtered.length} dari {reports.length} laporan</p>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Laporan</th>
                <th style={styles.th}>Pelapor</th>
                <th style={styles.th}>Kategori</th>
                <th style={styles.th}>Prioritas</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((report, index) => {
                  const priority = getPriorityStyle(report.priority);
                  const status = getStatusStyle(report.status);
                  const category = categoriesList.find(cat => cat.id === report.category_id);
                  return (
                    <tr key={report.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                      <td style={styles.td}>
                        <div style={styles.reportTitle}>
                          <FileText size={14} color="#9CA3AF" />
                          <span>{report.title || "-"}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.reporterInfo}>
                          <User size={14} color="#9CA3AF" />
                          <span>{report.reporter_name || "User"}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.categoryBadge, backgroundColor: category?.bg || "#F3F4F6", color: category?.color || "#6B7280" }}>
                          {category?.name || "-"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: priority.bg, color: priority.color }}>{priority.label}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.dateCell}>
                          <Calendar size={14} color="#9CA3AF" />
                          <span>{new Date(report.created_at).toLocaleDateString("id-ID")}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionWrap}>
                          {report.priority && report.priority ? (
                            <Link href={`/admin/reports/${report.id}`} style={styles.detailBtn}><Eye size={15} /></Link>
                          ) : (
                            <button disabled title="Menunggu prioritas dari superadmin" style={{ ...styles.detailBtn, opacity: 0.5, cursor: "not-allowed", border: "none" }}><Eye size={15} /></button>
                          )}
                          <button onClick={() => deleteReport(report.id)} style={styles.deleteBtn}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 0 }}>
                    <div style={styles.emptyState}>
                      <FileText size={48} color="#D1D5DB" />
                      <p style={styles.emptyText}>Tidak ada laporan ditemukan</p>
                      <p style={styles.emptySubtext}>
                        {search || statusFilter !== "all" || categoryFilter !== "all" 
                          ? "Coba dengan filter yang berbeda" 
                          : "Belum ada laporan yang masuk"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1400, margin: "0 auto", background: "#F9FAFB", minHeight: "100vh" },
  loadingWrap: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#F9FAFB" },
  loadingCard: { textAlign: "center", background: "#fff", padding: "48px", borderRadius: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  spinner: { width: 40, height: 40, borderWidth: 4, borderStyle: "solid", borderColor: "#E5E7EB", borderTopColor: "#2563EB", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" },
  loadingText: { marginTop: 16, color: "#6B7280", fontSize: 14 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 },
  headerBadge: { fontSize: 12, fontWeight: 600, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 },
  title: { fontWeight: 800, color: "#111827", margin: 0, marginBottom: 8 },
  subtitle: { color: "#6B7280", fontSize: 14, margin: 0 },
  statsBadge: { display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 12, fontWeight: 600, color: "#2563EB", borderWidth: 1, borderStyle: "solid", borderColor: "#E5E7EB" },
  statsSectionTitle: { fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 10px 0" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 },
  statCard: { background: "#fff", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, transition: "box-shadow 0.2s" },
  statDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  statLabel: { fontSize: 12, color: "#6B7280", margin: 0, marginBottom: 2 },
  statCount: { fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1 },
  clearFilterBtn: { marginTop: 12, padding: "6px 14px", background: "#F3F4F6", border: "none", borderRadius: 8, fontSize: 13, color: "#374151", cursor: "pointer", fontWeight: 500 },
  filterCard: { display: "flex", gap: 12, background: "#fff", padding: 16, borderRadius: 16, borderWidth: 1, borderStyle: "solid", borderColor: "#E5E7EB", marginBottom: 16, flexWrap: "wrap" },
  searchBox: { flex: 1, display: "flex", alignItems: "center", gap: 10, borderWidth: 1, borderStyle: "solid", borderColor: "#E5E7EB", borderRadius: 12, padding: "0 14px", background: "#F9FAFB" },
  searchInput: { flex: 1, border: "none", outline: "none", padding: "12px 0", fontSize: 14, background: "transparent" },
  filterRight: { display: "flex", gap: 10 },
  select: { padding: "0 16px", borderWidth: 1, borderStyle: "solid", borderColor: "#E5E7EB", borderRadius: 12, fontSize: 14, background: "#F9FAFB", cursor: "pointer" },
  refreshBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, border: "none", borderRadius: 12, background: "#2563EB", color: "#fff", cursor: "pointer" },
  resultInfo: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
  tableCard: { background: "#fff", borderRadius: 20, borderWidth: 1, borderStyle: "solid", borderColor: "#E5E7EB", overflow: "hidden" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 800 },
  th: { textAlign: "left", padding: "16px 20px", background: "#F9FAFB", fontSize: 13, fontWeight: 600, color: "#6B7280", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#E5E7EB" },
  td: { padding: "16px 20px", fontSize: 14, color: "#111827", borderBottomWidth: 1, borderStyle: "solid", borderBottomColor: "#F3F4F6" },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#F9FAFB" },
  reportTitle: { display: "flex", alignItems: "center", gap: 8 },
  reporterInfo: { display: "flex", alignItems: "center", gap: 8 },
  categoryBadge: { padding: "4px 10px", borderRadius: 8, fontSize: 12, display: "inline-block", fontWeight: 500 },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-block" },
  dateCell: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B7280" },
  actionWrap: { display: "flex", alignItems: "center", gap: 8 },
  detailBtn: { width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "#EFF6FF", color: "#2563EB", textDecoration: "none" },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, border: "none", background: "#FEE2E2", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyState: { 
    padding: "64px 24px", 
    textAlign: "center", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 12,
    width: "100%",
  },
  emptyText: { fontSize: 16, fontWeight: 500, color: "#111827", marginTop: 16, marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: "#6B7280", margin: 0 },
  mobileCard: { background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: "16px", marginBottom: 12 },
  mobileCardHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  mobileCardIcon: { width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" },
  mobileCardTitle: { flex: 1 },
  mobileCardReporter: { fontSize: "12px", color: "#6B7280", display: "flex", alignItems: "center", gap: 4 },
  mobileCardInfo: { marginBottom: 12 },
  mobileCardRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: "13px" },
  mobileCardLabel: { color: "#6B7280", fontWeight: 500 },
  mobileCardActions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" },
};