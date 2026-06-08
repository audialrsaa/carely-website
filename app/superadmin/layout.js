// app/superadmin/layout.jsx
"use client";

import SidebarSuperAdmin from "../components/sidebarSuperAdmin";
import { useEffect, useState } from "react";

export default function SuperAdminLayout({ children }) {
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
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <SidebarSuperAdmin />
      <main
        style={{
          flex: 1,
          padding: isMobile ? "80px 16px 16px 16px" : "24px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}