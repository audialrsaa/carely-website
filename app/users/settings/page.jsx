// app/users/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Lock, Edit2, Save, X, Camera, CheckCircle, AlertCircle as AlertCircleIcon } from "lucide-react";

export default function ProfilePage() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "" });
  const [password, setPassword] = useState({ old_password: "", new_password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", address: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const safeFetch = async (url, options = {}) => {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error("Server tidak mengembalikan JSON"); }
    if (!res.ok) throw new Error(data.message || "Request gagal");
    return data;
  };

  const fetchProfile = async () => {
    try {
      const data = await safeFetch("http://localhost:5000/api/users/profile", { headers: { Authorization: `Bearer ${token}` } });
      setForm({ full_name: data.full_name || "", email: data.email || "", phone: data.phone || "", address: data.address || "" });
      setEditForm({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "" });
    } catch (err) { setMessage({ type: "error", text: err.message }); }
  };

  useEffect(() => { if (token) fetchProfile(); }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: "", text: "" });
    try {
      await safeFetch("http://localhost:5000/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ full_name: editForm.full_name, phone: editForm.phone, address: editForm.address }) });
      setForm({ ...form, full_name: editForm.full_name, phone: editForm.phone, address: editForm.address });
      setMessage({ type: "success", text: "Profile berhasil diupdate" });
      setIsEditMode(false);
    } catch (err) { setMessage({ type: "error", text: err.message }); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: "", text: "" });
    try {
      await safeFetch("http://localhost:5000/api/users/change-password", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(password) });
      setMessage({ type: "success", text: "Password berhasil diubah" });
      setPassword({ old_password: "", new_password: "" });
    } catch (err) { setMessage({ type: "error", text: err.message }); }
    finally { setLoading(false); }
  };

  const handleCancelEdit = () => {
    setEditForm({ full_name: form.full_name, phone: form.phone, address: form.address });
    setIsEditMode(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1.5px solid #e2e8f0', background: '#fff',
    fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14,
    transition: 'all 0.2s ease', outline: 'none', boxSizing: 'border-box',
    color: '#001f3d',
  };

  const labelStyle = { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: '#001f3d', display: 'block', marginBottom: 6 };

  const onFocus = (e) => { e.currentTarget.style.borderColor = '#004b8d'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 141, 0.1)'; };
  const onBlur = (e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; };

  const profileCardStyle = {
    background: '#fff', borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0, 75, 141, 0.08)',
    border: '1px solid rgba(0, 75, 141, 0.08)',
    overflow: 'hidden',
  };

  const infoRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 24px',
    borderBottom: '1px solid rgba(0, 75, 141, 0.06)',
  };

  const iconWrapperStyle = {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'rgba(0, 75, 141, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 28, fontWeight: 800, color: '#001f3d' }}>Profil Saya</h1>
        <p style={{ fontFamily: "'Inter', system-ui", fontSize: 14, color: '#3a5068', marginTop: 6 }}>Kelola informasi profil dan keamanan akun Anda</p>
      </div>

      {message.text && (
        <div style={{ 
          padding: '12px 18px', 
          background: message.type === 'success' ? '#e6f9f4' : '#fde8e8', 
          border: `1px solid ${message.type === 'success' ? 'rgba(10,124,92,0.3)' : 'rgba(192,57,43,0.2)'}`, 
          borderRadius: 12, 
          fontSize: 13, 
          color: message.type === 'success' ? '#0a7c5c' : '#c0392b', 
          fontFamily: "'Inter', system-ui",
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircleIcon size={16} />}
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div style={profileCardStyle}>
        {/* Cover/Header with Avatar */}
        <div style={{ background: 'linear-gradient(135deg, #004b8d 0%, #43acff 100%)', padding: '32px 32px 24px 32px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 100, height: 100, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                  <span style={{ fontSize: 48, fontWeight: 700, color: '#004b8d', fontFamily: "'Plus Jakarta Sans', system-ui" }}>
                    {form.full_name ? form.full_name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 4, right: 4, background: '#fff', borderRadius: '50%', padding: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                  <Camera size={18} color="#004b8d" />
                </div>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{form.full_name || "Pengguna"}</h2>
              </div>
            </div>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                style={{ background: '#fff', border: 'none', borderRadius: 40, padding: '10px 24px', fontFamily: "'Inter', system-ui", fontWeight: 600, fontSize: 14, color: '#004b8d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}
              >
                <Edit2 size={16} /> Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ padding: '24px 32px 32px 32px' }}>
          {!isEditMode ? (
            // View Mode
            <div>
              <div style={infoRowStyle}>
                <div style={iconWrapperStyle}><User size={22} color="#004b8d" /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: '#6c7a8e', marginBottom: 4, fontFamily: "'Inter', system-ui" }}>Nama Lengkap</p>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#001f3d', fontFamily: "'Inter', system-ui" }}>{form.full_name || "Belum diisi"}</p>
                </div>
              </div>
              <div style={infoRowStyle}>
                <div style={iconWrapperStyle}><Mail size={22} color="#004b8d" /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: '#6c7a8e', marginBottom: 4, fontFamily: "'Inter', system-ui" }}>Email</p>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#001f3d', fontFamily: "'Inter', system-ui" }}>{form.email || "Belum diisi"}</p>
                </div>
              </div>
              <div style={infoRowStyle}>
                <div style={iconWrapperStyle}><Phone size={22} color="#004b8d" /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: '#6c7a8e', marginBottom: 4, fontFamily: "'Inter', system-ui" }}>No Handphone</p>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#001f3d', fontFamily: "'Inter', system-ui" }}>{form.phone || "Belum diisi"}</p>
                </div>
              </div>
              <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
                <div style={iconWrapperStyle}><MapPin size={22} color="#004b8d" /></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: '#6c7a8e', marginBottom: 4, fontFamily: "'Inter', system-ui" }}>Alamat</p>
                  <p style={{ fontSize: 16, fontWeight: 500, color: '#001f3d', fontFamily: "'Inter', system-ui" }}>{form.address || "Belum diisi"}</p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Nama Lengkap</label>
                  <input
                    type="text"
                    style={inputStyle}
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label style={labelStyle}>No Handphone</label>
                  <input
                    type="tel"
                    style={inputStyle}
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="Masukkan nomor handphone"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Alamat</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ background: '#004b8d', color: '#fff', border: 'none', borderRadius: 40, padding: '10px 28px', fontFamily: "'Inter', system-ui", fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Save size={16} /> {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{ background: '#f1f1e6', color: '#3a5068', border: 'none', borderRadius: 40, padding: '10px 28px', fontFamily: "'Inter', system-ui", fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <X size={16} /> Batal
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(0, 75, 141, 0.08)', border: '1px solid rgba(0, 75, 141, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(0, 75, 141, 0.08)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0, 75, 141, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={20} color="#004b8d" />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: 20, fontWeight: 700, color: '#001f3d' }}>Ganti Password</h2>
        </div>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={labelStyle}>Password Lama</label>
            <input type="password" placeholder="Masukkan password lama" style={inputStyle} value={password.old_password} onChange={(e) => setPassword({ ...password, old_password: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Password Baru</label>
            <input type="password" placeholder="Masukkan password baru (minimal 6 karakter)" style={inputStyle} value={password.new_password} onChange={(e) => setPassword({ ...password, new_password: e.target.value })} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <button type="submit" disabled={loading}
            style={{ background: '#004b8d', color: '#fff', border: 'none', borderRadius: 40, padding: '12px 32px', fontFamily: "'Inter', system-ui", fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', alignSelf: 'flex-start' }}>
            {loading ? "Memproses..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}