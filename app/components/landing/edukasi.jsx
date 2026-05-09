'use client';

const articles = [
  {
    tag: 'Hak Hukum',
    title: 'Memahami Hak Korban Kekerasan di Indonesia',
    desc: 'Undang-undang memberikan perlindungan khusus bagi perempuan dan anak. Pelajari hak-hak dasar yang wajib Anda ketahui.',
    color: '#004b8d',
    bgGradient: 'linear-gradient(135deg, #f1f1e6, #e8e8da)',
  },
  {
    tag: 'Psikososial',
    title: 'Panduan Keluarga Mendampingi Korban',
    desc: 'Dukungan dari orang terdekat sangat krusial. Temukan cara tepat mendampingi tanpa menambah trauma.',
    color: '#43acff',
    bgGradient: 'linear-gradient(135deg, #e8f5ff, #d6edff)',
  },
  {
    tag: 'Pencegahan',
    title: 'Kenali Tanda-Tanda Kekerasan Sejak Dini',
    desc: 'Edukasi dini adalah kunci pencegahan. Pelajari pola kekerasan yang sering terlewatkan.',
    color: '#004b8d',
    bgGradient: 'linear-gradient(135deg, #fff7d6, #fff0b3)',
  },
];

export default function Edukasi() {
  return (
    <section
      id="edukasi"
      style={{
        background: '#f1f1e6',
        padding: '100px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          right: -40,
          width: 350,
          height: 350,
          borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%',
          background: 'radial-gradient(circle, rgba(0,75,141,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: '#004b8d',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: '#fff7d6',
              padding: '4px 16px',
              borderRadius: 40,
              display: 'inline-block',
            }}
          >
            Pusat Edukasi
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 'clamp(32px, 4vw, 44px)',
              fontWeight: 700,
              color: '#001f3d',
              marginTop: 20,
              marginBottom: 16,
              letterSpacing: '-0.8px',
            }}
          >
            Pengetahuan untuk{' '}
            <span style={{ color: '#43acff' }}>Keberanian</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 16,
              color: '#3a5068',
              maxWidth: 540,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Setiap informasi yang Anda baca bisa menjadi langkah awal menuju
            perubahan yang lebih baik.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
        >
          {articles.map((article) => (
            <div
              key={article.title}
              style={{
                borderRadius: '24px 16px 24px 16px',
                overflow: 'hidden',
                background: '#fff',
                border: '1px solid rgba(0, 75, 141, 0.1)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.35s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 25px 40px rgba(0, 75, 141, 0.1)';
                e.currentTarget.style.borderRadius = '16px 24px 16px 24px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.02)';
                e.currentTarget.style.borderRadius = '24px 16px 24px 16px';
              }}
            >
              <div
                style={{
                  height: 160,
                  background: article.bgGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" opacity="0.5">
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    stroke={article.color}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div style={{ padding: '28px 28px 34px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#f1f1e6',
                    color: article.color,
                    borderRadius: 40,
                    padding: '4px 16px',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 18,
                  }}
                >
                  {article.tag}
                </span>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    fontSize: 19,
                    fontWeight: 700,
                    color: '#001f3d',
                    marginBottom: 12,
                    lineHeight: 1.4,
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: '#3a5068',
                    marginBottom: 24,
                  }}
                >
                  {article.desc}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#004b8d',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'gap 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = '14px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = '8px';
                  }}
                >
                  Baca selengkapnya
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#004b8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}