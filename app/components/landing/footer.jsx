'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      style={{
        background: '#001f3d',
        padding: '80px 40px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -50,
          left: 0,
          right: 0,
          height: 70,
          background: '#001f3d',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 50,
            paddingBottom: 56,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: 32,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                  padding: 8,
                }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Carely Logo"
                  width={28}
                  height={28}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: '#fff',
                }}
              >
                Carely
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 280,
              }}
            >
              Menghadirkan rasa aman melalui teknologi dan empati. Memberdayakan
              penyintas untuk berani bersuara.
            </p>
          </div>

          {[
            { title: 'Navigasi', links: ['Beranda', 'Layanan', 'Edukasi', 'Testimoni', 'Tentang'] },
            { title: 'Bantuan', links: ['Kontak Darurat', 'FAQ', 'Pusat Bantuan', 'Hotline 24/7'] },
            { title: 'Legal', links: ['Kebijakan Privasi', 'Syarat & Ketentuan', 'Perlindungan Data'] },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: 22,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
                {col.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: 14,
                      color: 'rgba(255, 255, 255, 0.45)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#43acff';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} Carely. Lindungi Diri, Berdayakan Sesama.
        </p>
      </div>
    </footer>
  );
}