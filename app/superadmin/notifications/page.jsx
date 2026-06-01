"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2, CheckCheck, AlertCircle, FileText, UserPlus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";

export default function SuperadminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
        throw new Error("Gagal mengambil notifikasi");
      }

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNotification = async (notif) => {
    try {
      const token = localStorage.getItem("token");

      if (!notif.is_read) {
        await fetch(`${API}/notifications/${notif.id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (notif.report_id) {
        router.push(`/superadmin/reports/${notif.report_id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menandai semua dibaca");

      fetchNotifications();
    } catch (error) {
      console.error(error);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    if (type?.includes("report")) return <FileText size={18} />;
    if (type?.includes("user")) return <UserPlus size={18} />;
    if (type?.includes("admin")) return <Shield size={18} />;
    return <Bell size={18} />;
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Memuat notifikasi...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Notifikasi</h1>
          <p style={styles.subtitle}>Pemberitahuan dan informasi terbaru dari sistem</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            disabled={markingAll}
            style={styles.markAllBtn}
          >
            {markingAll ? (
              <div style={styles.btnSpinner}></div>
            ) : (
              <CheckCheck size={16} />
            )}
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Stats Badge */}
      <div style={styles.statsBadge}>
        <Bell size={16} />
        Total: {notifications.length} notifikasi
        {notifications.filter(n => !n.is_read).length > 0 && (
          <span style={styles.unreadBadge}>
            {notifications.filter(n => !n.is_read).length} belum dibaca
          </span>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <Bell size={64} color="#D1D5DB" />
          <p style={styles.emptyText}>Belum ada notifikasi</p>
          <p style={styles.emptySubtext}>Notifikasi akan muncul di sini ketika ada aktivitas baru</p>
        </div>
      ) : (
        <div style={styles.notificationList}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => openNotification(notif)}
              style={{
                ...styles.notificationCard,
                background: notif.is_read ? "#fff" : "#EFF6FF",
                borderColor: notif.is_read ? "#E5E7EB" : "#BFDBFE",
              }}
            >
              <div style={styles.notificationIcon}>
                {getNotificationIcon(notif.type)}
              </div>
              <div style={styles.notificationContent}>
                <div style={styles.notificationHeader}>
                  <h3 style={styles.notificationTitle}>{notif.title}</h3>
                  {!notif.is_read && (
                    <span style={styles.newBadge}>Baru</span>
                  )}
                </div>
                <p style={styles.notificationMessage}>{notif.message}</p>
                <p style={styles.notificationDate}>
                  {new Date(notif.created_at).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  headerBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 8,
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
  markAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 20px",
    background: "#fff",
    color: "#2563EB",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnSpinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#2563EB",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  statsBadge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    background: "#fff",
    borderRadius: 12,
    fontSize: 13,
    color: "#6B7280",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  unreadBadge: {
    padding: "2px 8px",
    background: "#EFF6FF",
    color: "#2563EB",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  emptyState: {
    background: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    margin: 0,
  },
  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  notificationCard: {
    display: "flex",
    gap: 16,
    padding: "20px",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "solid",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563EB",
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  newBadge: {
    padding: "2px 10px",
    background: "#2563EB",
    color: "#fff",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#4B5563",
    margin: 0,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  notificationDate: {
    fontSize: 12,
    color: "#9CA3AF",
    margin: 0,
  },
};