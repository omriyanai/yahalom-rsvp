import type { Metadata } from 'next'
import './globals.css'

/* ─── Shared background config (matches login page) ─── */
const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='30,3 57,30 30,57 3,30' fill='none' stroke='rgba(196%2C18%2C48%2C0.14)' stroke-width='0.6'/%3E%3C/svg%3E")`

const PARTICLES: { left: string; size: number; dur: number; delay: number; opacity: number }[] = [
  { left: '6%',  size: 7,  dur: 14, delay: 0,  opacity: 0.18 },
  { left: '16%', size: 5,  dur: 19, delay: 4,  opacity: 0.12 },
  { left: '28%', size: 10, dur: 16, delay: 7,  opacity: 0.09 },
  { left: '42%', size: 6,  dur: 22, delay: 2,  opacity: 0.14 },
  { left: '55%', size: 9,  dur: 13, delay: 9,  opacity: 0.11 },
  { left: '67%', size: 5,  dur: 18, delay: 1,  opacity: 0.16 },
  { left: '79%', size: 8,  dur: 15, delay: 6,  opacity: 0.10 },
  { left: '89%', size: 11, dur: 20, delay: 3,  opacity: 0.08 },
  { left: '94%', size: 6,  dur: 17, delay: 11, opacity: 0.13 },
]

/* ─── Yahalom unit photos — public domain / CC, IDF official Flickr via Wikimedia Commons ─── */
const BORDER = 9
const DIAMONDS: {
  src: string; size: number; top: string; left: string; opacity: number; delay: string
}[] = [
  /* Right column */
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/4/49/Yahlom_soliders_2025.jpg',
    size: 270, top: '8vh',  left: '72vw', opacity: 0.22, delay: '0s',
  },
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/8/8e/Yahalom-Sapir-Unit-02.jpg',
    size: 185, top: '45vh', left: '80vw', opacity: 0.17, delay: '2.2s',
  },
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/6/60/Operation-Northern-Shield-3.jpg',
    size: 245, top: '76vh', left: '70vw', opacity: 0.20, delay: '4.1s',
  },
  /* Left column */
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/1/17/Yahlom_soliders_excercise.jpg',
    size: 235, top: '16vh', left: '5vw',  opacity: 0.18, delay: '1.1s',
  },
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/d/d1/Operation-Northern-Shield-1.jpg',
    size: 200, top: '54vh', left: '-1vw', opacity: 0.16, delay: '3.0s',
  },
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/a/af/Yahalom-Sapir-Unit-01.jpg',
    size: 185, top: '84vh', left: '7vw',  opacity: 0.18, delay: '5.3s',
  },
  /* Lone accent — upper centre */
  {
    src:  'https://upload.wikimedia.org/wikipedia/commons/e/e1/YAHLOM_SOLIDER_2024.jpg',
    size: 145, top: '3vh',  left: '50vw', opacity: 0.13, delay: '1.8s',
  },
]

export const metadata: Metadata = {
  title: 'עמותת יהלום — אישור הגעה',
  description: 'מערכת אישור הגעה לאירועי עמותת יהלום',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>

        {/* ══ BG LAYER 1 — Tiling diamond grid ══ */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ backgroundImage: GRID_PATTERN, backgroundSize: '60px 60px', zIndex: 0 }}
        />

        {/* ══ BG LAYER 2 — Central radial red glow (animated) ══ */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:  'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(196,18,48,0.13) 0%, transparent 70%)',
            animation:   'pulse-glow 6s ease-in-out infinite',
            zIndex: 0,
          }}
        />

        {/* ══ BG LAYER 3 — Dark vignette edges ══ */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(0,0,0,0.85) 100%)',
            zIndex: 0,
          }}
        />

        {/* ══ BG LAYER 4 — Yahalom unit photos in diamond frames ══ */}
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none diamond-bg-layer"
          aria-hidden="true"
          style={{ zIndex: 0 }}
        >
          {DIAMONDS.map((d, i) => (
            <div
              key={i}
              className="absolute diamond-frame"
              style={{
                top:            d.top,
                left:           d.left,
                width:          d.size + BORDER * 2,
                height:         d.size + BORDER * 2,
                transform:      'translate(-50%, -50%)',
                opacity:        d.opacity,
                animationDelay: d.delay,
              }}
            >
              {/* Red tactical border ring */}
              <div style={{
                position:   'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(196,18,48,0.7), rgba(139,13,34,0.55))',
                clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }} />
              {/* Inner highlight edge */}
              <div style={{
                position:   'absolute', inset: BORDER - 1,
                background: 'rgba(255,255,255,0.10)',
                clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }} />
              {/* Photo */}
              <div style={{
                position:           'absolute',
                top: BORDER, left: BORDER, right: BORDER, bottom: BORDER,
                backgroundImage:    `url("${d.src}")`,
                backgroundSize:     'cover',
                backgroundPosition: 'center',
                filter:             'brightness(0.52) saturate(0.55) contrast(1.05)',
                clipPath:           'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }} />
              {/* Atmospheric vignette over photo */}
              <div style={{
                position:   'absolute',
                top: BORDER, left: BORDER, right: BORDER, bottom: BORDER,
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,8,15,0.68) 100%)',
                clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }} />
              {/* Vertex accent dots */}
              {[
                { top: -3,    left: '50%',  transform: 'translateX(-50%)' },
                { bottom: -3, left: '50%',  transform: 'translateX(-50%)' },
                { top: '50%', left: -3,     transform: 'translateY(-50%)' },
                { top: '50%', right: -3,    transform: 'translateY(-50%)' },
              ].map((s, j) => (
                <div key={j} style={{
                  position: 'absolute', ...s,
                  width: 5, height: 5,
                  background: 'rgba(196,18,48,0.95)',
                  borderRadius: '50%',
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* ══ BG LAYER 5 — Floating diamond particles ══ */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute bottom-[-20px]"
              style={{
                left:            p.left,
                width:           p.size,
                height:          p.size,
                backgroundColor: `rgba(196,18,48,${p.opacity})`,
                transform:       'rotate(45deg)',
                animation:       `floatUp ${p.dur}s ${p.delay}s infinite linear`,
              }}
            />
          ))}
        </div>

        {/* ── Page content sits above all background layers ── */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>

      </body>
    </html>
  )
}
