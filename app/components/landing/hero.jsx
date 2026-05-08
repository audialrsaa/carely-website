'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section
      id="beranda"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '140px 40px 80px',
        background: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -150,
          right: -80,
          width: 500,
          height: 500,
          borderRadius: '40% 60% 50% 50% / 45% 50% 50% 55%',
          background: 'radial-gradient(circle, rgba(42,157,143,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -60,
          width: 400,
          height: 400,
          borderRadius: '50% 50% 35% 65% / 55% 40% 60% 45%',
          background: 'radial-gradient(circle, rgba(244,162,97,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#E9F5F3',
              borderRadius: 40,
              padding: '6px 18px 6px 12px',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#2A9D8F',
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: '#2A9D8F',
              }}
            >
              Platform Perlindungan Terpercaya
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(42px, 5.5vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#264653',
              marginBottom: 24,
              letterSpacing: '-1.5px',
            }}
          >
            Saat Dunia Terlalu{' '}
            <span style={{ color: '#2A9D8F' }}>Diam</span>,
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #2A9D8F, #F4A261)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Suaramu Tetap Layak
            </span>{' '}
            Didengar.
          </h1>

          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 16,
              lineHeight: 1.75,
              color: '#4A5B6A',
              marginBottom: 40,
              maxWidth: 520,
            }}
          >
            Care for Her & Child adalah ruang aman bagi perempuan dan anak untuk
            melaporkan kekerasan, pelecehan, atau ancaman. Privasi terlindungi,
            laporan ditindaklanjuti dengan empati dan profesionalisme.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/register">
              <button
                style={{
                  background: '#2A9D8F',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 60,
                  padding: '14px 38px',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px rgba(42, 157, 143, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.background = '#F4A261';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(244, 162, 97, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#2A9D8F';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(42, 157, 143, 0.35)';
                }}
              >
                Buat Laporan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
            <a href="#layanan">
              <button
                style={{
                  background: 'transparent',
                  color: '#2A9D8F',
                  border: '1.5px solid rgba(42, 157, 143, 0.4)',
                  borderRadius: 60,
                  padding: '14px 34px',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(42, 157, 143, 0.05)';
                  e.currentTarget.style.borderColor = '#2A9D8F';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Pelajari Lebih Lanjut
              </button>
            </a>
          </div>

          {/* Statistics - KONTEN ASLI TETAP */}
          <div
            style={{
              display: 'flex',
              gap: 48,
              marginTop: 56,
              paddingTop: 32,
              borderTop: '1px solid #E0E8ED',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#2A9D8F',
                  marginBottom: 6,
                }}
              >
                5,651+
              </div>
              <div
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#5D7180',
                }}
              >
                Klien Terbantu
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#2A9D8F',
                  marginBottom: 6,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#5D7180',
                }}
              >
                Privasi Terjaga
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#2A9D8F',
                  marginBottom: 6,
                }}
              >
                24/7
              </div>
              <div
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#5D7180',
                }}
              >
                Layanan Aktif
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              aspectRatio: '1/1',
              borderRadius: '32px 64px 32px 64px',
              background: '#F0F6F4',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 50px rgba(42, 157, 143, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 280,
                height: 280,
                borderRadius: '50%',
                border: '1.5px dashed rgba(42, 157, 143, 0.2)',
                animation: 'spin 20s linear infinite',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 340,
                height: 340,
                borderRadius: '50%',
                border: '1px solid rgba(42, 157, 143, 0.08)',
                pointerEvents: 'none',
              }}
            />

            <Image
              src="/images/hero.jpeg"
              alt="Perempuan dan anak yang dilindungi"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              priority
              sizes="(max-width: 768px) 100vw, 460px"
            />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              background: 'rgba(255, 255, 255, 0.96)',
              borderRadius: 40,
              padding: '8px 20px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#F4A261',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Inter', system-ui",
                color: '#264653',
              }}
            >
              #BeraniBersuara
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}