// app/users/layout.jsx
"use client";

import SidebarUser from "../components/sidebarUser";

export default function UsersLayout({ children }) {
  return (
    <div style={styles.container}>
      <SidebarUser />
      <main style={styles.main}>
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