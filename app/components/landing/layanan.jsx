'use client';

const services = [
  {
    title: 'Lapor Aman',
    desc: 'Sampaikan kejadian melalui formulir terstruktur. Identitas pelapor dijaga sepenuhnya dengan enkripsi end-to-end.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Pantau Status',
    desc: 'Lacak perkembangan laporan secara real-time dari verifikasi hingga tindak lanjut dengan notifikasi instan.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="white" strokeWidth="1.8"/>
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Edukasi & Bantuan',
    desc: 'Akses pusat pengetahuan tentang hak-hak Anda, konsultasi hukum, dan panduan psikososial dari para ahli.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Konsultasi Rahasia',
    desc: 'Chat anonim dengan konselor profesional yang siap mendengarkan dan memberikan arahan terbaik.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Pendampingan Hukum',
    desc: 'Terhubung dengan lembaga bantuan hukum yang siap mendampingi proses hukum Anda.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v8m-4-4h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Ruang Aman',
    desc: 'Komunitas dukungan sebaya yang moderat dan aman untuk berbagi pengalaman tanpa takut dihakimi.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Layanan() {
  return (
    <section
      id="layanan"
      style={{
        background: '#F8FBF9',
        padding: '100px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -50,
          width: 400,
          height: 400,
          borderRadius: '70% 30% 60% 40% / 40% 50% 50% 60%',
          background: 'rgba(42, 157, 143, 0.03)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: '#2A9D8F',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: '#E9F5F3',
              padding: '4px 16px',
              borderRadius: 40,
              display: 'inline-block',
            }}
          >
            Layanan Kami
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 700,
              color: '#264653',
              marginTop: 20,
              marginBottom: 16,
              letterSpacing: '-0.8px',
            }}
          >
            Solusi Lengkap{' '}
            <span style={{ color: '#F4A261' }}>Perlindungan</span> untuk Anda
          </h2>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 16,
              color: '#5D7180',
              maxWidth: 540,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Kami hadir dengan berbagai layanan untuk memastikan Anda mendapatkan
            perlindungan terbaik.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
          }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(42, 157, 143, 0.1)',
                borderRadius: '32px 16px 32px 16px',
                padding: '40px 28px',
                transition: 'all 0.35s cubic-bezier(0.2, 0, 0, 1)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderRadius = '16px 32px 16px 32px';
                e.currentTarget.style.boxShadow = '0 25px 40px rgba(42, 157, 143, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderRadius = '32px 16px 32px 16px';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.1)';
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #2A9D8F, #F4A261)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 28,
                  boxShadow: '0 12px 24px rgba(42, 157, 143, 0.2)',
                }}
              >
                {s.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#264653',
                  marginBottom: 12,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#5D7180',
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}