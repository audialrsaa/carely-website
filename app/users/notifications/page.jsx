"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000/api";

export default function UserNotificationsPage() {
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

      const res = await fetch(`${API}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setNotifications(data || []);
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
      await fetch(
        `${API}/notifications/${notif.id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    if (notif.report_id) {
      router.push(
        `/users/report/${notif.report_id}`
      );
    }
  } catch (err) {
    console.error(err);
  }
};
  const markAllRead = async () => {
    try {
      setMarkingAll(true);

      const token = localStorage.getItem("token");

      await fetch(
        `${API}/notifications/mark-all-read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Memuat notifikasi...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Notifikasi
          </h1>

          <p style={styles.subtitle}>
            Informasi terbaru terkait laporan Anda
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            style={styles.markBtn}
            disabled={markingAll}
          >
            <CheckCheck size={16} />
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={styles.empty}>
          <Bell size={60} />
          <p>Belum ada notifikasi</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() =>
              openNotification(notif)
            }
            style={{
              ...styles.card,
              background: notif.is_read
                ? "#fff"
                : "#EFF6FF",
            }}
          >
            <div style={styles.cardTop}>
              <h3 style={styles.cardTitle}>
                {notif.title}
              </h3>

              {!notif.is_read && (
                <span style={styles.badge}>
                  Baru
                </span>
              )}
            </div>

            <p style={styles.message}>
              {notif.message}
            </p>

            <p style={styles.date}>
              {new Date(
                notif.created_at
              ).toLocaleString("id-ID")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
  },

  loading: {
    padding: "30px",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  subtitle: {
    color: "#6B7280",
  },

  markBtn: {
    border: "none",
    background: "#2563EB",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    color: "#6B7280",
    padding: "80px 20px",
  },

  card: {
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    marginBottom: "12px",
    cursor: "pointer",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  badge: {
    background: "#2563EB",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "999px",
  },

  message: {
    color: "#4B5563",
    marginBottom: "10px",
  },

  date: {
    fontSize: "12px",
    color: "#9CA3AF",
  },
};