/**
 * DiamondPhotoBackground
 * ──────────────────────
 * Decorative fixed layer — shown on all authenticated pages.
 * Diamond sizes use min(px, 19vw) so they shrink proportionally
 * on browser zoom and never overlap.
 */

interface Diamond {
  src:     string
  size:    number
  top:     string
  left:    string
  opacity: number
  delay:   string
}

const DIAMONDS: Diamond[] = [
  /* ── Top row ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/4/49/Yahlom_soliders_2025.jpg',
    size:    260, top: '6vh',  left: '9vw',  opacity: 0.42, delay: '0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/e/e1/YAHLOM_SOLIDER_2024.jpg',
    size:    240, top: '4vh',  left: '52vw', opacity: 0.38, delay: '1.2s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/8/8e/Yahalom-Sapir-Unit-02.jpg',
    size:    260, top: '7vh',  left: '84vw', opacity: 0.40, delay: '2.4s',
  },

  /* ── Upper-middle row ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/1/17/Yahlom_soliders_excercise.jpg',
    size:    270, top: '32vh', left: '22vw', opacity: 0.38, delay: '0.6s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/6/60/Operation-Northern-Shield-3.jpg',
    size:    270, top: '30vh', left: '72vw', opacity: 0.40, delay: '1.8s',
  },

  /* ── Center row ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/d/d1/Operation-Northern-Shield-1.jpg',
    size:    280, top: '54vh', left: '4vw',  opacity: 0.38, delay: '3.0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/2/21/Operation-Northern-Shield-2.jpg',
    size:    280, top: '52vh', left: '88vw', opacity: 0.38, delay: '4.2s',
  },

  /* ── Lower-middle row ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/a/af/Yahalom-Sapir-Unit-01.jpg',
    size:    270, top: '74vh', left: '30vw', opacity: 0.38, delay: '1.4s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/8/8d/Operation-Northern-Shield-5.jpg',
    size:    270, top: '76vh', left: '63vw', opacity: 0.38, delay: '2.8s',
  },

  /* ── Bottom row ── */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/d/d7/Yahalom-Sapir-Unit-03.jpg',
    size:    260, top: '93vh', left: '14vw', opacity: 0.36, delay: '0.4s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/5/5a/Talon-EOD-robot--Independence-Day-2018-IZE-136.jpg',
    size:    260, top: '94vh', left: '79vw', opacity: 0.36, delay: '3.6s',
  },
]

const BORDER_RING = 10 // px — used only for the vw-capped size formula

export default function DiamondPhotoBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none diamond-bg-layer"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    >
      {DIAMONDS.map((d, i) => {
        const box = d.size + BORDER_RING * 2
        // Responsive: shrink to 19vw on small/zoomed viewports, capped at box px
        const outerSize = `min(${box}px, 19vw)`

        return (
          <div
            key={i}
            className="absolute diamond-frame"
            style={{
              top:            d.top,
              left:           d.left,
              width:          outerSize,
              height:         outerSize,
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
              position: 'absolute', inset: '3.2%',
              background: 'rgba(255,255,255,0.10)',
              clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />

            {/* Photo */}
            <div style={{
              position:           'absolute',
              inset:              '3.5%',
              backgroundImage:    `url("${d.src}")`,
              backgroundSize:     'cover',
              backgroundPosition: 'center',
              filter:             'brightness(0.70) saturate(0.65) contrast(1.05) blur(1px)',
              clipPath:           'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />

            {/* Vignette */}
            <div style={{
              position: 'absolute',
              inset:    '3.5%',
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,8,15,0.65) 100%)',
              clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }} />

            {/* Vertex dots — percentage-based so they scale with the diamond */}
            {[
              { top: '-1%',  left: '50%',  transform: 'translateX(-50%)' },
              { bottom: '-1%', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%',  left: '-1%',  transform: 'translateY(-50%)' },
              { top: '50%',  right: '-1%', transform: 'translateY(-50%)' },
            ].map((s, j) => (
              <div key={j} style={{
                position: 'absolute', ...s,
                width: 'max(4px, 1.5%)', height: 'max(4px, 1.5%)',
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
