"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Loader2,
} from "lucide-react";

// menyimpan base url backend api
const API = "http://localhost:5000/api";

// admin profile page
export default function AdminProfilePage() {

  // menyimpan data profil admin
  const [profile, setProfile] = useState(null);

  // menyimpan status loading
  const [loading, setLoading] = useState(true);

  // menjalankan fetchProfile saat halaman pertama kali dibuka
  useEffect(() => {
    fetchProfile();
  }, []);


  // mengambil data profil admin yang sedang login
  const fetchProfile = async () => {
    try {

      // mengambil token login dari local storage
      const token = localStorage.getItem("token");

      // mengambil data profil dari backend
      const res = await fetch(`${API}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // mengubah response menjadi json
      const data = await res.json();

      // jika request gagal tampilkan pesan error
      if (!res.ok) {
        alert(data.message);
        return;
      }

      // menyimpan data profil ke state
      setProfile(data);

    } catch (err) {

      // menampilkan error ke console
      console.error(err);

    } finally {

      // menghentikan loading
      setLoading(false);
    }
  };

  // menampilkan animasi loading saat data profilmmasih diambil dari backend
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <p style={styles.loadingText}>
            Memuat profil...
          </p>
        </div>

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Profil Admin</h1>
          <p style={styles.subtitle}>Informasi akun Admin</p>
        </div>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          {profile?.full_name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <h2 style={styles.name}>{profile?.full_name || "-"}</h2>
        <span style={styles.roleBadge}>
          {profile?.role === "admin" ? "Admin" : profile?.role}
        </span>
      </div>

      {/* Informasi Akun Card */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Informasi Akun</h3>
        <div style={styles.infoGrid}>
          <InfoItem
            icon={<Mail size={18} />}
            label="Email"
            value={profile?.email || "-"}
          />
          <InfoItem
            icon={<Phone size={18} />}
            label="Telepon"
            value={profile?.phone || "-"}
          />
          <InfoItem
            icon={<Shield size={18} />}
            label="Role"
            value={profile?.role === "admin" ? "Administrator" : profile?.role || "-"}
          />
          <InfoItem
            icon={<Calendar size={18} />}
            label="Tanggal Bergabung"
            value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }) : "-"}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.iconBox}>{icon}</div>
      <div>
        <p style={styles.label}>{label}</p>
        <p style={styles.value}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px 24px",
    background: "#F9FAFB",
    minHeight: "100vh",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F9FAFB",
  },
  loadingCard: {
    textAlign: "center",
    background: "#fff",
    padding: "48px",
    borderRadius: 24,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderTopColor: "#2563EB",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    margin: 0,
  },
  profileCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "32px 24px",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: 700,
    margin: "0 auto",
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  roleBadge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 20,
    background: "#EFF6FF",
    color: "#2563EB",
    fontWeight: 600,
    fontSize: 13,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "28px",
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 20,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  infoItem: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: "16px",
    borderRadius: 14,
    background: "#F9FAFB",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    margin: 0,
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    margin: 0,
    marginTop: 4,
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },
};