"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // VALIDASI
  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password harus diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT LOGIN
  // GANTI BAGIAN handleSubmit JADI INI

const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError("");

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login gagal");
    }

    // ==========================
    // TOKEN WAJIB KE LOCALSTORAGE
    // ==========================
    localStorage.setItem("token", data.token);

    // USER DATA
    localStorage.setItem("user", JSON.stringify(data.user));

    // OPTIONAL SESSION
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    // REMEMBER EMAIL
    if (formData.rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // REDIRECT ROLE
    switch (data.user.role) {
      case "superadmin":
        router.push("/superadmin");
        break;

      case "admin":
        router.push("/admin");
        break;

      case "user":
      default:
        router.push("/users");
        break;
    }
  } catch (error) {
    setServerError(error.message || "Terjadi kesalahan koneksi");
  } finally {
    setIsLoading(false);
  }
};

<input
  type="checkbox"
  checked={formData.rememberMe}
  onChange={(e) =>
    setFormData({
      ...formData,
      rememberMe: e.target.checked,
    })
  }
/>

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
      {/* Background blobs Infotek */}
      <div
        className="animate-blob"
        style={{
          position: 'absolute',
          top: -150,
          right: -80,
          width: 500,
          height: 500,
          borderRadius: '40% 60% 50% 50% / 45% 50% 50% 55%',
          background: 'radial-gradient(circle, rgba(42,157,143,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-blob animation-delay-2000"
        style={{
          position: 'absolute',
          bottom: -100,
          left: -60,
          width: 400,
          height: 400,
          borderRadius: '50% 50% 35% 65% / 55% 40% 60% 45%',
          background: 'radial-gradient(circle, rgba(244,162,97,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-blob animation-delay-4000"
        style={{
          position: 'absolute',
          top: '40%',
          left: '20%',
          width: 300,
          height: 300,
          borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%',
          background: 'radial-gradient(circle, rgba(42,157,143,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: 1200,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: 80,
          border: '1px solid rgba(42, 157, 143, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          padding: '0 28px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2A9D8F, #F4A261)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(42, 157, 143, 0.25)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.3px',
                color: '#264653',
              }}
            >
              Carely
            </span>
          </div>
        </Link>

        <Link href="/register">
          <button
            style={{
              background: 'transparent',
              color: '#2A9D8F',
              border: '1.5px solid rgba(42, 157, 143, 0.4)',
              borderRadius: 40,
              padding: '8px 24px',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(42, 157, 143, 0.05)';
              e.currentTarget.style.borderColor = '#2A9D8F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.4)';
            }}
          >
            Daftar
          </button>
        </Link>
      </nav>

      {/* Form Card */}
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          background: '#fff',
          borderRadius: '32px 16px 32px 16px',
          padding: '48px 40px',
          boxShadow: '0 25px 50px rgba(42, 157, 143, 0.08)',
          border: '1px solid rgba(42, 157, 143, 0.1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #2A9D8F, #F4A261)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 20px rgba(42, 157, 143, 0.2)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: '#264653',
              marginBottom: 8,
            }}
          >
            Selamat Datang Kembali
          </h1>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 14,
              color: '#5D7180',
            }}
          >
            Masuk untuk melanjutkan ke akun Anda
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#2C3E50',
                display: 'block',
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contoh@email.com"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: 20,
                border: '1.5px solid rgba(42, 157, 143, 0.2)',
                background: '#F8FBF9',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2A9D8F';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42, 157, 143, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="password"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#2C3E50',
                display: 'block',
                marginBottom: 8,
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
                  border: '1.5px solid rgba(42, 157, 143, 0.2)',
                  background: '#F8FBF9',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 14,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2A9D8F';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42, 157, 143, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.2)';
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
                  color: '#8A7A82',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.756 0 8.773 2.663 10.065 7-.84 2.463-2.371 4.537-4.262 6.021m-3.522 1.04A10.294 10.294 0 0112 19c-4.756 0-8.773-2.663-10.065-7 1.05-3.076 2.863-5.593 5.22-7.414" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  border: '1.5px solid rgba(42, 157, 143, 0.3)',
                  cursor: 'pointer',
                  accentColor: '#2A9D8F',
                }}
              />
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#5D7180',
                }}
              >
                Ingat saya
              </span>
            </label>
            <a
              href="#"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                color: '#2A9D8F',
                textDecoration: 'none',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Lupa password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: '#2A9D8F',
              color: '#fff',
              border: 'none',
              borderRadius: 40,
              padding: '14px 24px',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(42, 157, 143, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#F4A261';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 162, 97, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#2A9D8F';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(42, 157, 143, 0.35)';
              }
            }}
          >
            {isLoading ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
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
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 14,
              color: '#5D7180',
            }}
          >
            Belum punya akun?{' '}
            <Link
              href="/register"
              style={{
                color: '#2A9D8F',
                textDecoration: 'none',
                fontWeight: 600,
              }}
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
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.08); }
          66% { transform: translate(-15px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}