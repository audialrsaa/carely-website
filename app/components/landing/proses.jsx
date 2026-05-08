'use client';

const steps = [
  {
    num: '01',
    title: 'Buat Laporan',
    desc: 'Isi detail kejadian pada formulir yang kami sediakan. Data dienkripsi dan dijaga kerahasiaannya.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Verifikasi',
    desc: 'Tim kami meninjau laporan Anda. Anda akan mendapat notifikasi setiap ada pembaruan status.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Tindak Lanjut',
    desc: 'Pendampingan hukum atau psikososial diberikan segera. Setiap laporan berujung pada aksi nyata.',
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="#2A9D8F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Proses() {
  return (
    <section
      style={{
        background: '#FFFFFF',
        padding: '80px 40px 100px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Alur Penanganan
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
            Langkah Nyata Menuju{' '}
            <span style={{ color: '#F4A261' }}>Keadilan</span>
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
            Proses yang transparan, empatik, dan profesional untuk setiap
            laporan yang masuk.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 'calc(16.66% + 20px)',
              right: 'calc(16.66% + 20px)',
              height: 2,
              background: 'linear-gradient(90deg, transparent, #2A9D8F, #F4A261, #2A9D8F, transparent)',
              zIndex: 0,
            }}
          />

          {steps.map((step) => (
            <div key={step.title} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '24px',
                  background: '#fff',
                  border: '2px solid rgba(42, 157, 143, 0.15)',
                  boxShadow: '0 15px 30px rgba(42, 157, 143, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 28px',
                  transition: 'all 0.35s ease',
                  flexDirection: 'column',
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderRadius = '40px 16px 40px 16px';
                  e.currentTarget.style.boxShadow = '0 25px 40px rgba(42, 157, 143, 0.12)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderRadius = '24px';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(42, 157, 143, 0.05)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(42, 157, 143, 0.15)';
                }}
              >
                {step.icon}
                <span
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#F4A261',
                    letterSpacing: '1.5px',
                  }}
                >
                  {step.num}
                </span>
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
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#5D7180',
                  maxWidth: 260,
                  margin: '0 auto',
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}