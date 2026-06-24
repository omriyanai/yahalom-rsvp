import type { Metadata } from 'next'
import './globals.css'

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpolygon points='30,3 57,30 30,57 3,30' fill='none' stroke='rgba(196%2C18%2C48%2C0.14)' stroke-width='0.6'/%3E%3C/svg%3E")`

const PARTICLES: { left: string; size: number; dur: number; delay: number; opacity: number; anim: string }[] = [
  // small fast
  { left:  '3%', size:  6, dur: 12, delay:  0, opacity: 0.38, anim: 'floatUp' },
  { left:  '8%', size: 10, dur: 18, delay:  5, opacity: 0.30, anim: 'floatUpRight' },
  { left: '14%', size:  7, dur: 14, delay:  2, opacity: 0.42, anim: 'floatUpLeft' },
  { left: '20%', size: 14, dur: 22, delay:  8, opacity: 0.25, anim: 'floatUp' },
  { left: '27%', size:  5, dur: 11, delay:  1, opacity: 0.45, anim: 'floatUpRight' },
  { left: '33%', size:  9, dur: 16, delay: 13, opacity: 0.32, anim: 'floatUpLeft' },
  { left: '39%', size: 12, dur: 20, delay:  4, opacity: 0.28, anim: 'floatUp' },
  { left: '45%', size:  6, dur: 13, delay:  9, opacity: 0.40, anim: 'floatUpRight' },
  { left: '51%', size: 16, dur: 24, delay:  0, opacity: 0.22, anim: 'floatUpLeft' },
  { left: '57%', size:  8, dur: 15, delay:  6, opacity: 0.36, anim: 'floatUp' },
  { left: '63%', size:  5, dur: 10, delay: 11, opacity: 0.44, anim: 'floatUpRight' },
  { left: '68%', size: 11, dur: 19, delay:  3, opacity: 0.30, anim: 'floatUpLeft' },
  { left: '74%', size:  7, dur: 14, delay:  7, opacity: 0.38, anim: 'floatUp' },
  { left: '80%', size: 13, dur: 21, delay:  1, opacity: 0.26, anim: 'floatUpRight' },
  { left: '86%', size:  6, dur: 12, delay: 10, opacity: 0.42, anim: 'floatUpLeft' },
  { left: '91%', size:  9, dur: 17, delay:  4, opacity: 0.34, anim: 'floatUp' },
  { left: '96%', size: 11, dur: 23, delay:  2, opacity: 0.28, anim: 'floatUpRight' },
  // extra scattered
  { left: '11%', size:  4, dur:  9, delay: 14, opacity: 0.50, anim: 'floatUp' },
  { left: '23%', size: 18, dur: 26, delay:  6, opacity: 0.18, anim: 'floatUpLeft' },
  { left: '36%', size:  5, dur: 11, delay: 12, opacity: 0.46, anim: 'floatUp' },
  { left: '48%', size:  8, dur: 15, delay:  0, opacity: 0.38, anim: 'floatUpRight' },
  { left: '60%', size: 15, dur: 25, delay:  8, opacity: 0.20, anim: 'floatUpLeft' },
  { left: '72%', size:  5, dur: 10, delay:  3, opacity: 0.48, anim: 'floatUp' },
  { left: '83%', size:  7, dur: 13, delay: 15, opacity: 0.36, anim: 'floatUpRight' },
  { left: '93%', size: 12, dur: 20, delay:  5, opacity: 0.24, anim: 'floatUpLeft' },
]

export const metadata: Metadata = {
  title: 'עמותת יהל״ם — אישור הגעה',
  description: 'מערכת אישור הגעה לאירועי עמותת יהל״ם',
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
            background: 'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(196,18,48,0.13) 0%, transparent 70%)',
            animation:  'pulse-glow 6s ease-in-out infinite',
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

        {/* ══ BG LAYER 4 — Floating diamond particles ══ */}
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
                boxShadow:       `0 0 ${p.size * 1.5}px rgba(196,18,48,${p.opacity * 0.6})`,
                transform:       'rotate(45deg)',
                animation:       `${p.anim} ${p.dur}s ${p.delay}s infinite linear`,
              }}
            />
          ))}
        </div>

        {/* ── Page content (authenticated pages inject diamond photos above this) ── */}
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>

      </body>
    </html>
  )
}
