"use client";

import SidebarUser from "../components/sidebarUser";
import { useEffect, useState } from "react";

export default function UsersLayout({ children }) {
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
    <div style={styles.container}>
      <SidebarUser />
      <main style={{
        ...styles.main,
        paddingTop: isMobile ? 70 : 0,
      }}>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F9FAFB',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    height: '100vh',
    position: 'relative',
  },
  content: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: '32px 40px',
  },
};