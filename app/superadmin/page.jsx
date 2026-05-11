"use client"

import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API_BASE + path, { headers: authHeaders(), ...opts });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Mini Components ──────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const nav = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "users", icon: "👤", label: "Manajemen User" },
    { id: "admins", icon: "🛡️", label: "Manajemen Admin" },
    { id: "reports", icon: "📋", label: "Semua Laporan" },
    { id: "audit", icon: "📝", label: "Audit Log" },
    { id: "activity", icon: "⚡", label: "Activity Log" },
  ];

  return (
    <aside style={{
      width: 260,
      minHeight: "100vh",
      background: "#fff",
      borderRight: "1px solid #eee",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#1a6fd4,#2196f3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 18,
          }}>♥</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>Carely</div>
            <div style={{ fontSize: 11, color: "#888" }}>Superadmin Panel</div>
          </div>
        </div>
      </div>
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              marginBottom: 2, textAlign: "left", fontSize: 14,
              background: active === item.id ? "#EBF4FF" : "transparent",
              color: active === item.id ? "#1a6fd4" : "#555",
              fontWeight: active === item.id ? 600 : 400,
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#333", color: "#fff", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700,
          }}>SA</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>Superadmin</div>
            <div style={{ fontSize: 11, color: "#999" }}>superadmin@carely.id</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, color = "#1a6fd4", bg = "#EBF4FF" }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, border: "1px solid #eee",
      padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a" }}>{value ?? "—"}</div>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    pending: { bg: "#FFF7E6", color: "#B45309", label: "Pending" },
    diproses: { bg: "#EBF4FF", color: "#1a6fd4", label: "Diproses" },
    selesai: { bg: "#ECFDF5", color: "#065F46", label: "Selesai" },
    rejected: { bg: "#FEF2F2", color: "#991B1B", label: "Ditolak" },
    low: { bg: "#F0FDF4", color: "#166534", label: "Low" },
    medium: { bg: "#FFF7E6", color: "#B45309", label: "Medium" },
    high: { bg: "#FEF2F2", color: "#991B1B", label: "High" },
    emergency: { bg: "#FFF1F2", color: "#BE123C", label: "🚨 Emergency" },
    user: { bg: "#F5F3FF", color: "#4C1D95", label: "User" },
    admin: { bg: "#EBF4FF", color: "#1a6fd4", label: "Admin" },
    superadmin: { bg: "#ECFDF5", color: "#065F46", label: "Superadmin" },
  };
  const s = map[status] || { bg: "#F3F4F6", color: "#374151", label: status };
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 12, fontWeight: 600,
      padding: "3px 10px", borderRadius: 20,
    }}>{s.label}</span>
  );
}

function Table({ columns, rows, emptyMsg = "Tidak ada data" }) {
  if (!rows || rows.length === 0) {
    return <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 14 }}>{emptyMsg}</div>;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            {columns.map(c => (
              <th key={c.key} style={{
                padding: "10px 14px", textAlign: "left", fontWeight: 600,
                color: "#555", borderBottom: "1px solid #eee", whiteSpace: "nowrap",
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: "10px 14px", color: "#333", verticalAlign: "middle" }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 14, width: 420, maxWidth: "95vw",
        padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#aaa",
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 5, fontWeight: 500 }}>{label}</label>}
      <input style={{
        width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd",
        fontSize: 14, outline: "none", boxSizing: "border-box",
      }} {...props} />
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, disabled, style: extraStyle = {} }) {
  const base = {
    cursor: disabled ? "not-allowed" : "pointer", border: "none", borderRadius: 8,
    fontWeight: 600, fontSize: size === "sm" ? 12 : 13,
    padding: size === "sm" ? "5px 12px" : "9px 18px",
    opacity: disabled ? 0.6 : 1, transition: "opacity .15s",
    ...extraStyle,
  };
  const variants = {
    primary: { background: "#1a6fd4", color: "#fff" },
    danger: { background: "#ef4444", color: "#fff" },
    ghost: { background: "#F3F4F6", color: "#374151" },
    outline: { background: "transparent", color: "#1a6fd4", border: "1px solid #1a6fd4" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ── Page: Dashboard ──────────────────────────────────────────

function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/dashboard/super")
      .then(setData)
      .catch(() => setData({
        total_users: 128, total_admins: 5, total_reports: 312,
        today_reports: 14, emergency_reports: 3,
        status_summary: [
          { status: "pending", total: 89 }, { status: "diproses", total: 54 },
          { status: "selesai", total: 156 }, { status: "rejected", total: 13 },
        ],
        category_summary: [
          { category_name: "Kekerasan", total: 78 },
          { category_name: "Pelecehan", total: 120 },
          { category_name: "Bullying", total: 65 },
          { category_name: "Lainnya", total: 49 },
        ],
        priority_summary: [
          { priority: "low", total: 110 }, { priority: "medium", total: 140 },
          { priority: "high", total: 49 }, { priority: "emergency", total: 13 },
        ],
      }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#aaa" }}>Memuat dashboard...</div>;

  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg,#1a6fd4 0%,#2196f3 100%)",
        borderRadius: 16, padding: "28px 32px", marginBottom: 28, color: "#fff",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, opacity: .8, marginBottom: 8, textTransform: "uppercase" }}>
          Superadmin Dashboard
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>Selamat Datang! 👋</h2>
        <p style={{ margin: 0, opacity: .85, fontSize: 14 }}>Pantau semua aktivitas platform Carely dari sini.</p>
        <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {["🔒 Akses Penuh", "⚡ Real-time Data", "🛡️ Superadmin"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon="👤" label="Total User" value={data.total_users} />
        <StatCard icon="🛡️" label="Total Admin" value={data.total_admins} bg="#EEF2FF" color="#4338CA" />
        <StatCard icon="📋" label="Total Laporan" value={data.total_reports} bg="#F0FDF4" color="#16A34A" />
        <StatCard icon="📅" label="Laporan Hari Ini" value={data.today_reports} bg="#FFF7E6" color="#D97706" />
        <StatCard icon="🚨" label="Darurat Aktif" value={data.emergency_reports} bg="#FEF2F2" color="#DC2626" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { title: "Status Laporan", data: data.status_summary, keyField: "status" },
          { title: "Kategori", data: data.category_summary, keyField: "category_name" },
          { title: "Prioritas", data: data.priority_summary, keyField: "priority" },
        ].map(section => (
          <div key={section.title} style={{
            background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "18px 20px",
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 14 }}>{section.title}</div>
            {(section.data || []).map(item => (
              <div key={item[section.keyField]} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 0", borderBottom: "1px solid #f5f5f5",
              }}>
                <Badge status={item[section.keyField]} />
                <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{item.total}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page: Users ──────────────────────────────────────────────

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    apiFetch("/admin/users")
      .then(setUsers)
      .catch(() => setUsers([
        { id: 1, full_name: "Kahlaa Ramadani", email: "kahlaa@mail.com", phone: "081234567890", role: "user", created_at: "2025-01-15" },
        { id: 2, full_name: "Rizky Pratama", email: "rizky@mail.com", phone: "082112345678", role: "user", created_at: "2025-02-01" },
        { id: 3, full_name: "Sari Dewi", email: "sari@mail.com", phone: "087890123456", role: "user", created_at: "2025-03-10" },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deleteUser = async (id) => {
    await apiFetch(`/admin/users/${id}`, { method: "DELETE" }).catch(() => {});
    setUsers(u => u.filter(x => x.id !== id));
    setConfirm(null);
  };

  const cols = [
    { key: "full_name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telepon" },
    { key: "role", label: "Role", render: v => <Badge status={v} /> },
    { key: "created_at", label: "Bergabung", render: v => new Date(v).toLocaleDateString("id-ID") },
    {
      key: "id", label: "Aksi",
      render: (id, row) => (
        <Btn variant="danger" size="sm" onClick={() => setConfirm(row)}>Hapus</Btn>
      )
    },
  ];

  return (
    <div>
      <PageHeader title="Manajemen User" subtitle={`${users.length} user terdaftar`} />
      {loading ? <div style={{ padding: 40, color: "#aaa" }}>Memuat...</div> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
          <Table columns={cols} rows={users} />
        </div>
      )}
      {confirm && (
        <Modal title="Hapus User" onClose={() => setConfirm(null)}>
          <p style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>
            Yakin ingin menghapus <strong>{confirm.full_name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setConfirm(null)}>Batal</Btn>
            <Btn variant="danger" onClick={() => deleteUser(confirm.id)}>Hapus</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Page: Admins ─────────────────────────────────────────────

function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [resetPw, setResetPw] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    apiFetch("/admin/admins")
      .then(setAdmins)
      .catch(() => setAdmins([
        { id: 1, full_name: "Admin Pusat", email: "admin@carely.id", phone: "081200000001", role: "admin", created_at: "2024-11-01" },
        { id: 2, full_name: "Admin Wilayah", email: "adminwil@carely.id", phone: "081200000002", role: "admin", created_at: "2024-12-01" },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setForm({}); setModal("create"); setMsg(""); };
  const openEdit = (row) => { setForm({ full_name: row.full_name, phone: row.phone, id: row.id }); setModal("edit"); setMsg(""); };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await apiFetch("/admin/admins", { method: "POST", body: JSON.stringify(form) });
      setMsg("Admin berhasil dibuat!");
      load();
      setTimeout(() => setModal(null), 800);
    } catch { setMsg("Gagal membuat admin."); }
    setSubmitting(false);
  };

  const handleEdit = async () => {
    setSubmitting(true);
    try {
      await apiFetch(`/admin/admins/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
      setMsg("Data diperbarui!");
      load();
      setTimeout(() => setModal(null), 800);
    } catch { setMsg("Gagal memperbarui."); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    await apiFetch(`/admin/admins/${id}`, { method: "DELETE" }).catch(() => {});
    setAdmins(a => a.filter(x => x.id !== id));
    setConfirm(null);
  };

  const handleResetPw = async () => {
    setSubmitting(true);
    try {
      await apiFetch(`/admin/admins/${resetPw.id}/reset-password`, { method: "PUT", body: JSON.stringify({ new_password: form.new_password }) });
      setMsg("Password berhasil direset!");
      setTimeout(() => { setResetPw(null); setMsg(""); }, 800);
    } catch { setMsg("Gagal reset password."); }
    setSubmitting(false);
  };

  const cols = [
    { key: "full_name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telepon" },
    { key: "role", label: "Role", render: v => <Badge status={v} /> },
    { key: "created_at", label: "Dibuat", render: v => new Date(v).toLocaleDateString("id-ID") },
    {
      key: "id", label: "Aksi",
      render: (id, row) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Btn size="sm" variant="ghost" onClick={() => openEdit(row)}>Edit</Btn>
          <Btn size="sm" variant="outline" onClick={() => { setResetPw(row); setForm({}); setMsg(""); }}>Reset PW</Btn>
          <Btn size="sm" variant="danger" onClick={() => setConfirm(row)}>Hapus</Btn>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader title="Manajemen Admin" subtitle={`${admins.length} admin terdaftar`}>
        <Btn onClick={openCreate}>+ Tambah Admin</Btn>
      </PageHeader>

      {loading ? <div style={{ padding: 40, color: "#aaa" }}>Memuat...</div> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
          <Table columns={cols} rows={admins} />
        </div>
      )}

      {modal === "create" && (
        <Modal title="Tambah Admin Baru" onClose={() => setModal(null)}>
          <Input label="Nama Lengkap" value={form.full_name || ""} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Email" type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" value={form.password || ""} onChange={e => setForm({ ...form, password: e.target.value })} />
          <Input label="Telepon" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {msg && <div style={{ fontSize: 13, color: "#16A34A", marginBottom: 10 }}>{msg}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Batal</Btn>
            <Btn onClick={handleCreate} disabled={submitting}>Simpan</Btn>
          </div>
        </Modal>
      )}

      {modal === "edit" && (
        <Modal title="Edit Admin" onClose={() => setModal(null)}>
          <Input label="Nama Lengkap" value={form.full_name || ""} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Telepon" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {msg && <div style={{ fontSize: 13, color: "#16A34A", marginBottom: 10 }}>{msg}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Batal</Btn>
            <Btn onClick={handleEdit} disabled={submitting}>Simpan</Btn>
          </div>
        </Modal>
      )}

      {resetPw && (
        <Modal title={`Reset Password — ${resetPw.full_name}`} onClose={() => setResetPw(null)}>
          <Input label="Password Baru" type="password" value={form.new_password || ""} onChange={e => setForm({ ...form, new_password: e.target.value })} />
          {msg && <div style={{ fontSize: 13, color: "#16A34A", marginBottom: 10 }}>{msg}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setResetPw(null)}>Batal</Btn>
            <Btn onClick={handleResetPw} disabled={submitting}>Reset</Btn>
          </div>
        </Modal>
      )}

      {confirm && (
        <Modal title="Hapus Admin" onClose={() => setConfirm(null)}>
          <p style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>
            Yakin ingin menghapus <strong>{confirm.full_name}</strong>?
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setConfirm(null)}>Batal</Btn>
            <Btn variant="danger" onClick={() => handleDelete(confirm.id)}>Hapus</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Page: Reports ────────────────────────────────────────────

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [detail, setDetail] = useState(null);
  const [statusForm, setStatusForm] = useState({});
  const [priorityForm, setPriorityForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))).toString();
    apiFetch(`/reports${q ? "?" + q : ""}`)
      .then(setReports)
      .catch(() => setReports([
        { id: 1, title: "Laporan Kekerasan di Sekolah", status: "pending", priority: "high", category_name: "Kekerasan", reporter_name: "Kahlaa R.", incident_date: "2025-04-20", created_at: "2025-04-21" },
        { id: 2, title: "Pelecehan Verbal oleh Atasan", status: "diproses", priority: "medium", category_name: "Pelecehan", reporter_name: "Rizky P.", incident_date: "2025-04-18", created_at: "2025-04-19" },
        { id: 3, title: "Bullying di Kampus", status: "selesai", priority: "low", category_name: "Bullying", reporter_name: "Sari D.", incident_date: "2025-03-10", created_at: "2025-03-11" },
        { id: 4, title: "Ancaman Fisik Emergency", status: "pending", priority: "emergency", category_name: "Kekerasan", reporter_name: "Anonymous", incident_date: "2025-04-22", created_at: "2025-04-22" },
      ]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [JSON.stringify(filters)]);

  const handleStatus = async () => {
    setSubmitting(true);
    await apiFetch(`/reports/${detail.id}/status`, { method: "PUT", body: JSON.stringify(statusForm) }).catch(() => {});
    load();
    setDetail(null);
    setSubmitting(false);
  };

  const handlePriority = async (id, priority) => {
    await apiFetch(`/reports/${id}/priority`, { method: "PUT", body: JSON.stringify({ priority }) }).catch(() => {});
    load();
  };

  const cols = [
    { key: "title", label: "Judul", render: v => <span style={{ fontWeight: 500, color: "#1a1a1a" }}>{v}</span> },
    { key: "category_name", label: "Kategori" },
    { key: "reporter_name", label: "Pelapor" },
    { key: "status", label: "Status", render: v => <Badge status={v} /> },
    { key: "priority", label: "Prioritas", render: (v, row) => (
      <select value={v} onChange={e => handlePriority(row.id, e.target.value)} style={{
        border: "1px solid #ddd", borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer",
      }}>
        {["low","medium","high","emergency"].map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    )},
    { key: "created_at", label: "Tanggal", render: v => new Date(v).toLocaleDateString("id-ID") },
    { key: "id", label: "Aksi", render: (id, row) => (
      <Btn size="sm" onClick={() => { setDetail(row); setStatusForm({ new_status: row.status }); }}>Detail</Btn>
    )},
  ];

  return (
    <div>
      <PageHeader title="Semua Laporan" subtitle="Kelola dan pantau seluruh laporan" />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "status", placeholder: "Status", opts: ["pending","diproses","selesai","rejected"] },
          { key: "priority", placeholder: "Prioritas", opts: ["low","medium","high","emergency"] },
        ].map(f => (
          <select key={f.key} value={filters[f.key] || ""} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px", fontSize: 13, cursor: "pointer" }}>
            <option value="">Semua {f.placeholder}</option>
            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <input type="date" value={filters.date_from || ""} onChange={e => setFilters({ ...filters, date_from: e.target.value })}
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px", fontSize: 13 }} />
        <input type="date" value={filters.date_to || ""} onChange={e => setFilters({ ...filters, date_to: e.target.value })}
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: "8px 12px", fontSize: 13 }} />
        <Btn variant="ghost" onClick={() => setFilters({})}>Reset</Btn>
      </div>

      {loading ? <div style={{ padding: 40, color: "#aaa" }}>Memuat...</div> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
          <Table columns={cols} rows={reports} />
        </div>
      )}

      {detail && (
        <Modal title="Detail & Update Laporan" onClose={() => setDetail(null)}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 4 }}>{detail.title}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge status={detail.status} />
              <Badge status={detail.priority} />
              {detail.category_name && <span style={{ fontSize: 12, color: "#888" }}>{detail.category_name}</span>}
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>Pelapor: {detail.reporter_name}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 5 }}>Ubah Status</label>
            <select value={statusForm.new_status || ""} onChange={e => setStatusForm({ ...statusForm, new_status: e.target.value })}
              style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}>
              {["pending","diproses","selesai","rejected"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Catatan Admin" value={statusForm.admin_notes || ""} onChange={e => setStatusForm({ ...statusForm, admin_notes: e.target.value })} />
          {statusForm.new_status === "rejected" && (
            <Input label="Alasan Penolakan" value={statusForm.rejection_reason || ""} onChange={e => setStatusForm({ ...statusForm, rejection_reason: e.target.value })} />
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => setDetail(null)}>Batal</Btn>
            <Btn onClick={handleStatus} disabled={submitting}>Simpan Status</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Page: Audit Log ──────────────────────────────────────────

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/audit-logs")
      .then(setLogs)
      .catch(() => setLogs([
        { id: 1, report_title: "Laporan Kekerasan", old_status: "pending", new_status: "diproses", changed_by_name: "Admin Pusat", changer_role: "admin", notes: "Sedang ditangani", created_at: "2025-04-21T10:30:00" },
        { id: 2, report_title: "Bullying di Kampus", old_status: "diproses", new_status: "selesai", changed_by_name: "Admin Wilayah", changer_role: "admin", notes: "Kasus selesai", created_at: "2025-04-20T14:20:00" },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const cols = [
    { key: "report_title", label: "Laporan" },
    { key: "old_status", label: "Status Lama", render: v => v ? <Badge status={v} /> : <span style={{ color: "#aaa", fontSize: 12 }}>—</span> },
    { key: "new_status", label: "Status Baru", render: v => <Badge status={v} /> },
    { key: "changed_by_name", label: "Diubah Oleh" },
    { key: "changer_role", label: "Role", render: v => <Badge status={v} /> },
    { key: "notes", label: "Catatan" },
    { key: "created_at", label: "Waktu", render: v => new Date(v).toLocaleString("id-ID") },
  ];

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Riwayat perubahan status laporan" />
      {loading ? <div style={{ padding: 40, color: "#aaa" }}>Memuat...</div> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
          <Table columns={cols} rows={logs} />
        </div>
      )}
    </div>
  );
}

// ── Page: Activity Log ───────────────────────────────────────

function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/activity-logs")
      .then(setLogs)
      .catch(() => setLogs([
        { id: 1, admin_name: "Admin Pusat", action: "UPDATE_STATUS", description: "Mengubah status laporan #1", created_at: "2025-04-21T10:30:00" },
        { id: 2, admin_name: "Admin Wilayah", action: "LOGIN", description: "Admin login ke sistem", created_at: "2025-04-21T09:00:00" },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const cols = [
    { key: "admin_name", label: "Admin" },
    { key: "action", label: "Aksi", render: v => (
      <span style={{ background: "#F3F4F6", color: "#374151", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, fontFamily: "monospace" }}>{v}</span>
    )},
    { key: "description", label: "Deskripsi" },
    { key: "created_at", label: "Waktu", render: v => new Date(v).toLocaleString("id-ID") },
  ];

  return (
    <div>
      <PageHeader title="Activity Log" subtitle="Rekam jejak aktivitas admin" />
      {loading ? <div style={{ padding: 40, color: "#aaa" }}>Memuat...</div> : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
          <Table columns={cols} rows={logs} />
        </div>
      )}
    </div>
  );
}

// ── Shared PageHeader ────────────────────────────────────────

function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────

export default function SuperAdminDashboard() {
  const [active, setActive] = useState("dashboard");

  const pages = {
    dashboard: <DashboardPage />,
    users: <UsersPage />,
    admins: <AdminsPage />,
    reports: <ReportsPage />,
    audit: <AuditLogPage />,
    activity: <ActivityLogPage />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa", fontFamily: "system-ui, sans-serif" }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {pages[active]}
      </main>
    </div>
  );
}