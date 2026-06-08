// app/admin/layout.jsx
"use client";

import SidebarAdmin from "../components/sidebarAdmin";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <SidebarAdmin />
      <main
        style={{
          flex: 1,
          padding: isMobile ? "80px 16px 16px 16px" : "24px",
          marginLeft: isMobile ? 0 : 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}