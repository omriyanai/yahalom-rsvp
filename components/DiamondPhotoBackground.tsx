/**
 * DiamondPhotoBackground
 * ──────────────────────
 * Decorative fixed layer — shown on ALL pages (authenticated + login).
 * Photos hug the left/right edges of the viewport so they never overlap
 * the centered page content or the login box.
 *
 * Layout (left column + right column, 3 each, + 1 bottom accent):
 *
 *                          [R1 — top-right]
 *   [L1 — upper-left]
 *                          [R2 — mid-right]
 *   [L2 — mid-left]
 *                          [R3 — lower-right]
 *   [L3 — lower-left]
 *             [B — bottom center-left]
 */

const BORDER = 10   // px — red border ring thickness

interface Diamond {
  src:     string
  size:    number
  top:     string
  left:    string
  opacity: number
  delay:   string
}

const DIAMONDS: Diamond[] = [
  /* ── Right column ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/4/49/Yahlom_soliders_2025.jpg',
    size:    200, top: '8vh',  left: '80vw', opacity: 0.42, delay: '0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/8/8e/Yahalom-Sapir-Unit-02.jpg',
    size:    185, top: '42vh', left: '84vw', opacity: 0.38, delay: '2.0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/6/60/Operation-Northern-Shield-3.jpg',
    size:    200, top: '76vh', left: '79vw', opacity: 0.40, delay: '4.0s',
  },

  /* ── Left column ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/1/17/Yahlom_soliders_excercise.jpg',
    size:    195, top: '20vh', left: '8vw',  opacity: 0.38, delay: '1.0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/d/d1/Operation-Northern-Shield-1.jpg',
    size:    185, top: '54vh', left: '4vw',  opacity: 0.36, delay: '3.0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/a/af/Yahalom-Sapir-Unit-01.jpg',
    size:    190, top: '86vh', left: '9vw',  opacity: 0.38, delay: '5.0s',
  },

  /* ── Small bottom accent (partially off-screen) ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/e/e1/YAHLOM_SOLIDER_2024.jpg',
    size:    155, top: '96vh', left: '50vw', opacity: 0.30, delay: '1.5s',
  },
]

export default function DiamondPhotoBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none diamond-bg-layer"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {DIAMONDS.map((d, i) => {
        const box = d.size + BORDER * 2
        return (
          <div
            key={i}
            className="absolute diamond-frame"
            style={{
              top:            d.top,
              left:           d.left,
              width:          box,
              height:         box,
              transform:      'translate(-50%, -50%)',
              opacity:        d.opacity,
              animationDelay: d.delay,
            }}
          >
            {/* Red border ring */}
            <div style={{
              position:   'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(196,18,48,0.70), rgba(139,13,34,0.55))',
              clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />

            {/* Inner highlight */}
            <div style={{
              position: 'absolute', inset: BORDER - 1,
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
              filter:             'brightness(0.70) saturate(0.65) contrast(1.05)',
              clipPath:           'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />

            {/* Vignette */}
            <div style={{
              position: 'absolute',
              top: BORDER, left: BORDER, right: BORDER, bottom: BORDER,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,8,15,0.65) 100%)',
              clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />

            {/* Vertex dots */}
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
        )
      })}
    </div>
  )
}
