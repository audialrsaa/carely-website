'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Alur', href: '#proses' },
    { label: 'Edukasi', href: '#edukasi' }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: 1200,
        zIndex: 100,
        background: scrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        borderRadius: 80,
        border: '1px solid rgba(0, 75, 141, 0.2)',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.3s ease',
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
              background: 'linear-gradient(135deg, #004b8d, #43acff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 75, 141, 0.25)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.3px',
              color: '#004b8d',
            }}
          >
            Carely
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              textDecoration: 'none',
              color: '#1a2e44',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              padding: '8px 18px',
              borderRadius: 40,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f1e6';
              e.currentTarget.style.color = '#004b8d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a2e44';
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <Link href="/login">
        <button
          style={{
            background: '#004b8d',
            color: '#fff',
            border: 'none',
            borderRadius: 40,
            padding: '8px 28px',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 75, 141, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = '#43acff';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(67, 172, 255, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = '#004b8d';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 75, 141, 0.3)';
          }}
        >
          Akses Akun
        </button>
      </Link>
    </nav>
  );
}