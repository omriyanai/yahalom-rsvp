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

export const metadata: Metadata = {
  title: 'עמותת יהלום — אישור הגעה',
  description: 'מערכת אישור הגעה לאירועי עמותת יהלום',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>

        {/* ══════════════════════════════════════
            GLOBAL BG LAYER 1 — Tiling diamond grid
        ══════════════════════════════════════ */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ backgroundImage: GRID_PATTERN, backgroundSize: '60px 60px', zIndex: 0 }}
        />

        {/* ══════════════════════════════════════
            GLOBAL BG LAYER 2 — Central radial red glow (animated)
        ══════════════════════════════════════ */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(196,18,48,0.13) 0%, transparent 70%)',
            animation: 'pulse-glow 6s ease-in-out infinite',
            zIndex: 0,
          }}
        />

        {/* ══════════════════════════════════════
            GLOBAL BG LAYER 3 — Dark vignette edges
        ══════════════════════════════════════ */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(0,0,0,0.85) 100%)',
            zIndex: 0,
          }}
        />

        {/* ══════════════════════════════════════
            GLOBAL BG LAYER 4 — Floating diamond particles
        ══════════════════════════════════════ */}
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

        {/* ── Page content sits above the background ── */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>

      </body>
    </html>
  )
}
