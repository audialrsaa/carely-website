"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";

export default function AdminNotificationsPage() {
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
        return;
      }

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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
        router.push(`/admin/reports/${notif.report_id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      const token = localStorage.getItem("token");

      await fetch(`${API}/notifications/mark-all-read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    if (type?.includes("report")) return <Bell size={18} />;
    return <Bell size={18} />;
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner}></div>
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
          <p style={styles.subtitle}>Update terbaru terkait laporan</p>
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
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <Bell size={48} color="#D1D5DB" />
          <p style={styles.emptyText}>Belum ada notifikasi</p>
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
                  {new Date(notif.created_at).toLocaleString("id-ID")}
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
    maxWidth: 800,
    margin: "0 auto",
    padding: "32px 24px",
    background: "#F9FAFB",
    minHeight: "100vh",
  },
  loadingWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    marginBottom: 4,
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
    padding: "8px 16px",
    background: "#fff",
    color: "#2563EB",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
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
  emptyState: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 0,
  },
  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  notificationCard: {
    display: "flex",
    gap: 14,
    padding: "18px",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  newBadge: {
    padding: "2px 8px",
    background: "#2563EB",
    color: "#fff",
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 600,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#4B5563",
    margin: 0,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  notificationDate: {
    fontSize: 11,
    color: "#9CA3AF",
    margin: 0,
  },
};