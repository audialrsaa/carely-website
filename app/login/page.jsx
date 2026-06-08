"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // menyimpan data form login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // menyimpan pesan error validasi form
  const [errors, setErrors] = useState({});

  // menyimpan status loading
  const [loading, setLoading] = useState(false);

  // menyimpan pesan error dari server
  const [serverError, setServerError] = useState("");

  // menyimpan status tampil/sembunyi password
  const [showPassword, setShowPassword] = useState(false);

  // menyimpan status loading saat proses login
  const [isLoading, setIsLoading] = useState(false);

  // ======================================================
  // handle change
  // memperbarui nilai input form saat user mengetik
  // ======================================================
  const handleChange = (e) => {

    // mengambil data dari input
    const { name, value, type, checked } = e.target;

    // memperbarui state form
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // ======================================================
  // validate form
  // memvalidasi data login sebelum dikirim
  // ======================================================
  const validateForm = () => {

    let newErrors = {};

    // validasi email kosong
    if (!formData.email.trim()) {

      newErrors.email =
        "Email harus diisi";

    }

    // validasi format email
    else if (
      !/\S+@\S+\.\S+/.test(
        formData.email
      )
    ) {

      newErrors.email =
        "Email tidak valid";
    }

    // validasi password kosong
    if (!formData.password.trim()) {

      newErrors.password =
        "Password harus diisi";

    }

    // validasi panjang password
    else if (
      formData.password.length < 6
    ) {

      newErrors.password =
        "Password minimal 6 karakter";
    }

    // menyimpan error validasi
    setErrors(newErrors);

    // mengembalikan status validasi
    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ======================================================
  // handle submit
  // memproses login pengguna
  // ======================================================
  const handleSubmit = async (e) => {

    // mencegah reload halaman
    e.preventDefault();

    // menghapus error sebelumnya
    setServerError("");

    // menghentikan proses jika validasi gagal
    if (!validateForm()) return;

    // mengaktifkan loading
    setIsLoading(true);

    try {

      // mengirim data login ke backend
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      // mengubah response menjadi json
      const data =
        await response.json();

      // jika login gagal tampilkan pesan error
      if (!response.ok) {
        throw new Error(
          data.message ||
          "Login gagal"
        );
      }

      // menyimpan token login ke local storage
      localStorage.setItem(
        "token",
        data.token
      );

      // menyimpan data user ke local storage
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // menyimpan token ke session storage
      sessionStorage.setItem(
        "token",
        data.token
      );

      // menyimpan data user ke session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // menyimpan email jika remember me dicentang
      if (formData.rememberMe) {

        localStorage.setItem(
          "rememberedEmail",
          formData.email
        );

      } else {

        // menghapus email tersimpan
        localStorage.removeItem(
          "rememberedEmail"
        );
      }

      // mengarahkan user berdasarkan role
      switch (data.user.role) {

        case "superadmin":
          router.push("/superadmin");
          break;

        case "admin":
          router.push("/admin");
          break;

        default:
          router.push("/users");
          break;
      }

    } catch (error) {

      // menyimpan pesan error dari server
      setServerError(
        error.message ||
        "Terjadi kesalahan koneksi"
      );

    } finally {

      // menghentikan loading
      setIsLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 80px',
      }}
    >
      <div
        className="animate-blob"
        style={{
          position: 'absolute', top: -150, right: -80,
          width: 500, height: 500,
          borderRadius: '40% 60% 50% 50% / 45% 50% 50% 55%',
          background: 'radial-gradient(circle, rgba(0,75,141,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-blob animation-delay-2000"
        style={{
          position: 'absolute', bottom: -100, left: -60,
          width: 400, height: 400,
          borderRadius: '50% 50% 35% 65% / 55% 40% 60% 45%',
          background: 'radial-gradient(circle, rgba(67,172,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-blob animation-delay-4000"
        style={{
          position: 'absolute', top: '40%', left: '20%',
          width: 300, height: 300,
          borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%',
          background: 'radial-gradient(circle, rgba(0,75,141,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)', maxWidth: 1200, zIndex: 100,
          background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)',
          borderRadius: 80, border: '1px solid rgba(0, 75, 141, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          padding: '0 28px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 12,
                background: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 75, 141, 0.25)',
                overflow: 'hidden',
                padding: 6,
              }}
            >
              <Image
                src="/images/logo.png"
                alt="Carely Logo"
                width={24}
                height={24}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px', color: '#004b8d' }}>
              Carely
            </span>
          </div>
        </Link>

        <Link href="/register">
          <button
            style={{
              background: 'transparent', color: '#004b8d',
              border: '1.5px solid rgba(0, 75, 141, 0.4)', borderRadius: 40,
              padding: '8px 24px', fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0, 75, 141, 0.05)'; e.currentTarget.style.borderColor = '#004b8d'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0, 75, 141, 0.4)'; }}
          >
            Daftar
          </button>
        </Link>
      </nav>

      {/* Form Card */}
      <div
        style={{
          maxWidth: 480, width: '100%', background: '#fff',
          borderRadius: '32px 16px 32px 16px', padding: '48px 40px',
          boxShadow: '0 25px 50px rgba(0, 75, 141, 0.08)',
          border: '1px solid rgba(0, 75, 141, 0.1)',
          position: 'relative', zIndex: 2,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: '20px',
              background: 'linear-gradient(135deg, #004b8d, #43acff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 8px 20px rgba(0, 75, 141, 0.2)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: '#001f3d', marginBottom: 8 }}>
            Selamat Datang Kembali
          </h1>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: '#3a5068' }}>
            Masuk untuk melanjutkan ke akun Anda
          </p>
        </div>

        {serverError && (
          <div style={{ background: '#fff7d6', border: '1px solid rgba(0,75,141,0.2)', borderRadius: 12, padding: '10px 16px', marginBottom: 20, fontFamily: "'Inter', system-ui", fontSize: 13, color: '#004b8d' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="email" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#001f3d', display: 'block', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email" id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contoh@email.com" required
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 20,
                border: '1.5px solid rgba(0, 75, 141, 0.2)', background: '#f1f1e6',
                fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14,
                transition: 'all 0.2s ease', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#004b8d'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 141, 0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 75, 141, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="password"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#001f3d',
                display: 'block',
                marginBottom: 8
              }}
            >
              Password
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 18px',
                  borderRadius: 20,
                  border: '1.5px solid rgba(0, 75, 141, 0.2)',
                  background: '#f1f1e6',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 14,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#004b8d';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 75, 141, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 75, 141, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                style={{ width: 18, height: 18, borderRadius: 6, border: '1.5px solid rgba(0, 75, 141, 0.3)', cursor: 'pointer', accentColor: '#004b8d' }}
              />
              <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: '#3a5068' }}>Ingat saya</span>
            </label>
            <a href="#"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, color: '#004b8d', textDecoration: 'none', fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Lupa password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={isLoading}
            style={{
              width: '100%', background: '#004b8d', color: '#fff', border: 'none',
              borderRadius: 40, padding: '14px 24px',
              fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 15,
              cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(0, 75, 141, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.background = '#43acff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(67, 172, 255, 0.45)'; } }}
            onMouseLeave={(e) => { if (!isLoading) { e.currentTarget.style.background = '#004b8d'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 75, 141, 0.35)'; } }}
          >
            {isLoading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                Masuk
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: '#3a5068' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: '#004b8d', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }

          33% {
            transform: translate(20px, -30px) scale(1.08);
          }

          66% {
            transform: translate(-15px, 20px) scale(0.95);
          }
        }

        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }

        input[type="password"]::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          display: none !important;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}