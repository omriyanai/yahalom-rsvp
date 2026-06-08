/**
 * DiamondPhotoBackground — authenticated pages only (not shown on login).
 * Photos: IDF/Yahalom official releases via Wikimedia Commons (CC BY-SA 3.0).
 * Uses position:fixed so diamonds stay in place as page scrolls.
 */

const BORDER = 10

const DIAMONDS: {
  src: string; size: number; top: string; left: string; opacity: number; delay: string
}[] = [
  /* ── Scattered randomly across the full background ── */

  // Top-left
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/4/49/Yahlom_soliders_2025.jpg',
    size: 340, top: '5vh',  left: '7vw',  opacity: 0.52, delay: '0s',
  },
  // Top-right
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/1/17/Yahlom_soliders_excercise.jpg',
    size: 290, top: '3vh',  left: '72vw', opacity: 0.48, delay: '1.5s',
  },
  // Right, upper-middle
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/8/8e/Yahalom-Sapir-Unit-02.jpg',
    size: 310, top: '32vh', left: '83vw', opacity: 0.50, delay: '3.2s',
  },
  // Left, upper-middle (bleeds off edge for drama)
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/d/d1/Operation-Northern-Shield-1.jpg',
    size: 270, top: '26vh', left: '2vw',  opacity: 0.46, delay: '0.8s',
  },
  // Right, center
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/6/60/Operation-Northern-Shield-3.jpg',
    size: 260, top: '55vh', left: '78vw', opacity: 0.48, delay: '2.4s',
  },
  // Left, center
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/a/af/Yahalom-Sapir-Unit-01.jpg',
    size: 280, top: '50vh', left: '10vw', opacity: 0.50, delay: '4.8s',
  },
  // Right, lower
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/e/e1/YAHLOM_SOLIDER_2024.jpg',
    size: 320, top: '76vh', left: '70vw', opacity: 0.50, delay: '1.2s',
  },
  // Left, lower (bleeds off edge)
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/4/49/Yahlom_soliders_2025.jpg',
    size: 270, top: '80vh', left: '4vw',  opacity: 0.46, delay: '3.6s',
  },
]

export default function DiamondPhotoBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
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
            background: 'linear-gradient(135deg, rgba(196,18,48,0.80), rgba(139,13,34,0.65))',
            clipPath:   'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />
          {/* Inner highlight */}
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
            filter:             'brightness(0.75) saturate(0.7) contrast(1.1)',
            clipPath:           'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />
          {/* Atmospheric vignette */}
          <div style={{
            position:   'absolute',
            top: BORDER, left: BORDER, right: BORDER, bottom: BORDER,
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(7,8,15,0.60) 100%)',
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
              width: 6, height: 6,
              background: 'rgba(196,18,48,0.95)',
              borderRadius: '50%',
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}
