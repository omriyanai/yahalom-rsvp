/**
 * DiamondPhotoBackground
 * ──────────────────────
 * Decorative fixed layer shown only on authenticated pages (not login).
 * Uses publicly released IDF/Yahalom unit photos from Wikimedia Commons
 * (originally published on the IDF official Flickr — public domain / CC).
 *
 * Each photo is clipped into a diamond (rotated-square) frame with a thin
 * red tactical border, matching the existing diamond motif in the design.
 * The layer sits between the background grid and the page content.
 */

interface Diamond {
  src:     string
  size:    number   // outer diamond size in px
  top:     string   // viewport-relative CSS value
  left:    string   // viewport-relative CSS value
  opacity: number   // base opacity (0–1)
  delay:   string   // animation-delay
}

/* ── 7 Yahalom unit photos, Wikimedia Commons (CC / public domain) ── */
const DIAMONDS: Diamond[] = [
  /* Right column — three diamonds flanking content on the right */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Flickr_-_Israel_Defense_Forces_-_Sayeret_%22Yahalom%22.jpg/600px-Flickr_-_Israel_Defense_Forces_-_Sayeret_%22Yahalom%22.jpg',
    size:    270, top: '8vh',  left: '72vw', opacity: 0.20, delay: '0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flickr_-_Israel_Defense_Forces_-_Yahalom_Training_in_Close_Quarters_%284%29.jpg/600px-Flickr_-_Israel_Defense_Forces_-_Yahalom_Training_in_Close_Quarters_%284%29.jpg',
    size:    185, top: '45vh', left: '80vw', opacity: 0.15, delay: '2.2s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Operation-Northern-Shield-3.jpg/600px-Operation-Northern-Shield-3.jpg',
    size:    245, top: '76vh', left: '70vw', opacity: 0.18, delay: '4.1s',
  },

  /* Left column — three diamonds flanking content on the left */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Flickr_-_Israel_Defense_Forces_-_Yahalom_Training_in_Close_Quarters_%281%29.jpg/600px-Flickr_-_Israel_Defense_Forces_-_Yahalom_Training_in_Close_Quarters_%281%29.jpg',
    size:    235, top: '16vh', left: '5vw',  opacity: 0.16, delay: '1.1s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Operation-Northern-Shield-1.jpg/600px-Operation-Northern-Shield-1.jpg',
    size:    200, top: '54vh', left: '-1vw', opacity: 0.14, delay: '3.0s',
  },
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Yahalom-Sapir-Unit-01.jpg/600px-Yahalom-Sapir-Unit-01.jpg',
    size:    185, top: '84vh', left: '7vw',  opacity: 0.16, delay: '5.3s',
  },

  /* Lone accent diamond — upper center, very subtle */
  {
    src:     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/YAHLOM_SOLIDER_2024.jpg/600px-YAHLOM_SOLIDER_2024.jpg',
    size:    145, top: '3vh',  left: '50vw', opacity: 0.11, delay: '1.8s',
  },
]

const BORDER = 9   // px — thickness of the red diamond border ring

export default function DiamondPhotoBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none diamond-bg-layer"
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
          {/* ── Red tactical border ring ── */}
          <div style={{
            position: 'absolute',
            inset:    0,
            background: 'linear-gradient(135deg, rgba(196,18,48,0.65), rgba(139,13,34,0.5))',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />

          {/* ── Thin inner highlight line (bright top edge) ── */}
          <div style={{
            position:  'absolute',
            inset:     BORDER - 1,
            background: 'rgba(255,255,255,0.12)',
            clipPath:  'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />

          {/* ── The photo itself ── */}
          <div style={{
            position:           'absolute',
            top:                BORDER,
            left:               BORDER,
            right:              BORDER,
            bottom:             BORDER,
            backgroundImage:    `url("${d.src}")`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            filter:             'brightness(0.48) saturate(0.55) contrast(1.05)',
            clipPath:           'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />

          {/* ── Dark atmospheric vignette over the photo ── */}
          <div style={{
            position: 'absolute',
            top:      BORDER,
            left:     BORDER,
            right:    BORDER,
            bottom:   BORDER,
            background: [
              'radial-gradient(ellipse at center, transparent 35%, rgba(7,8,15,0.72) 100%)',
              'rgba(7,8,15,0.28)',
            ].join(', '),
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }} />

          {/* ── Tiny corner tick marks at each diamond vertex ── */}
          {/* Top vertex */}
          <div style={{
            position:  'absolute',
            top:       -3,
            left:      '50%',
            transform: 'translateX(-50%)',
            width:     4, height: 4,
            background: 'rgba(196,18,48,0.9)',
            borderRadius: '50%',
          }} />
          {/* Bottom vertex */}
          <div style={{
            position:  'absolute',
            bottom:    -3,
            left:      '50%',
            transform: 'translateX(-50%)',
            width:     4, height: 4,
            background: 'rgba(196,18,48,0.9)',
            borderRadius: '50%',
          }} />
          {/* Left vertex */}
          <div style={{
            position:  'absolute',
            left:      -3,
            top:       '50%',
            transform: 'translateY(-50%)',
            width:     4, height: 4,
            background: 'rgba(196,18,48,0.9)',
            borderRadius: '50%',
          }} />
          {/* Right vertex */}
          <div style={{
            position:  'absolute',
            right:     -3,
            top:       '50%',
            transform: 'translateY(-50%)',
            width:     4, height: 4,
            background: 'rgba(196,18,48,0.9)',
            borderRadius: '50%',
          }} />
        </div>
      ))}
    </div>
  )
}
