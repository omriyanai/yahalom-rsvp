# עמותת יהלום — RSVP System (yahalom-rsvp)

## Project Identity
- **App name:** Yahalom Association RSVP & Mentoring Portal
- **Hebrew name:** עמותת יהלום — תוכנית מנטורינג
- **Purpose:** Event RSVP system for the Yahalom unit alumni mentoring program
- **Language:** Hebrew (RTL, `dir="rtl"`, `lang="he"`)
- **Font:** Heebo (Google Fonts), all weights 300–800

## Live URLs
- **Production:** https://yahalom-rsvp-omri-yanai-s-projects.vercel.app/
- **Local dev:** http://localhost:3000
- **GitHub repo:** https://github.com/omriyanai/yahalom-rsvp.git

## Tech Stack
- **Framework:** Next.js 14.2.5 (App Router, TypeScript)
- **Styling:** Tailwind CSS v3 + inline styles for complex effects
- **Database:** Google Sheets (via `googleapis` v140)
- **Auth:** Email-based cookie auth (`yahalom_member` cookie, 1-year expiry)
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Node runtime:** All API routes are server-side

## How to Run Locally
```bash
cd /Users/omriyanai/Desktop/my-project
npm run dev
# → http://localhost:3000
```
Preview tool config: `.claude/launch.json` → server name `yahalom-dev`, port 3000.

## How to Deploy
Push to GitHub → Vercel auto-deploys (~60 seconds):
```bash
git add <files>
git commit -m "message"
git push https://omriyanai@github.com/omriyanai/yahalom-rsvp.git main
# Paste GitHub Personal Access Token when prompted for password
```
> ⚠️ No GitHub credentials stored in macOS keychain.
> Create token at: https://github.com/settings/tokens/new (scope: repo)

## Environment Variables (`.env.local`)
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
```
These are set in Vercel dashboard for production. Never commit `.env.local`.

---

## Design System — Full Dark Theme (implemented June 2026)

The entire app uses a unified dark military aesthetic across ALL pages.

### Brand Colors
```
#C41230   — Yahalom red (primary brand, buttons, accents)
#8B0D22   — Dark red (button gradients)
#07080F   — Near-black background (deep space)
#6B7280   — Secondary text
#F9FAFB   — Primary text (white)
#E5E7EB   — Member name in header
#4B5563   — Muted text
```

### Global Background Layers (app/layout.tsx — all pages)
Four fixed layers stacked at `z-index: 0`:
1. **Diamond grid** — SVG tiling pattern (60px repeat), `rgba(196,18,48,0.14)`
2. **Red glow** — Radial gradient `rgba(196,18,48,0.13)`, animated `pulse-glow`
3. **Vignette** — Dark radial mask darkening edges
4. **Particles** — 9 floating rotated-square diamonds, `floatUp` animation

Page content sits at `z-index: 1` above the background.

### Glassmorphic Cards (EventCard, admin cards)
```css
background: rgba(9,11,20,0.84)
backdrop-filter: blur(28px)
border: 1px solid rgba(255,255,255,0.07)
box-shadow: 0 0 60px rgba(196,18,48,0.08), 0 24px 48px rgba(0,0,0,0.6)
```
Each card has SVG tactical L-bracket corners (`rgba(196,18,48,0.45)`) and a
gradient top accent line.

### Header (components/Header.tsx — server component)
```css
background: rgba(9,11,20,0.88)
backdrop-filter: blur(24px)
border-bottom: 1px solid rgba(196,18,48,0.35)
```
- Uses `Logo.png` (transparent) with red drop-shadow glow
- Subtitle split onto two centered lines: "תוכנית מנטורינג" / "אישור הגעה לאירועים"
- Signout link hover: `.signout-link` CSS class in globals.css (server-component safe)
- **No event handlers** — Header is a server component; hover via CSS only

### Buttons
```css
/* Primary (RSVP, login) */
background: linear-gradient(135deg, #C41230, #8B0D22)
box-shadow: 0 0 36px rgba(196,18,48,0.38)
/* + shimmer-slide sweep animation on hover */

/* Yes/attending */
background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.35); color: #4ADE80

/* No/not attending */
background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #9CA3AF
```

### Form Inputs (RSVPForm, SignIn)
```css
background: rgba(255,255,255,0.04)          /* unfocused */
background: rgba(196,18,48,0.06)            /* focused */
border: 1px solid rgba(255,255,255,0.09)    /* unfocused */
border: 1px solid rgba(196,18,48,0.55)      /* focused */
box-shadow: 0 0 0 3px rgba(196,18,48,0.12)  /* focus ring */
caret-color: #C41230
```

### Logo
- **Always use `Logo.png`** (transparent background) — never `Logo.jpg`
- Applied via CSS: `filter: drop-shadow(0 2px 18px rgba(196,18,48,0.55))`

---

## Diamond Photo Background (authenticated pages only)

### Component: `components/DiamondPhotoBackground.tsx`
- **Server component** (no `'use client'`)
- `position: fixed`, `z-index: 1` — sits above global bg, below page content (`z-index: 2`)
- Only rendered in authenticated pages (page.tsx, admin/page.tsx, admin/audit/page.tsx)
- **NOT shown on login page** — login shows `<SignIn />` without this component

### Usage in authenticated pages
```tsx
<main className="min-h-screen">
  <DiamondPhotoBackground />           {/* fixed, z-index: 1 */}
  <div className="relative" style={{ zIndex: 2 }}>
    <Header member={member} />
    {/* page content */}
  </div>
</main>
```

### Photos
8 diamonds scattered randomly across the full viewport (top-left, top-right,
upper-middle both sides, center both sides, lower-right, lower-left).

All photos are public domain / CC BY-SA 3.0 — IDF official Flickr via Wikimedia Commons.
**Direct file URLs only** (no `/thumb/` paths — those return HTTP 400):
```
https://upload.wikimedia.org/wikipedia/commons/4/49/Yahlom_soliders_2025.jpg
https://upload.wikimedia.org/wikipedia/commons/1/17/Yahlom_soliders_excercise.jpg
https://upload.wikimedia.org/wikipedia/commons/8/8e/Yahalom-Sapir-Unit-02.jpg
https://upload.wikimedia.org/wikipedia/commons/d/d1/Operation-Northern-Shield-1.jpg
https://upload.wikimedia.org/wikipedia/commons/6/60/Operation-Northern-Shield-3.jpg
https://upload.wikimedia.org/wikipedia/commons/a/af/Yahalom-Sapir-Unit-01.jpg
https://upload.wikimedia.org/wikipedia/commons/e/e1/YAHLOM_SOLIDER_2024.jpg
```

### Diamond frame anatomy
Each frame has 4 stacked layers (all clipped to `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`):
1. Outer red border ring: `linear-gradient(135deg, rgba(196,18,48,0.80), rgba(139,13,34,0.65))`
2. Inner highlight: `rgba(255,255,255,0.10)` (1px inside border)
3. Photo: `brightness(0.75) saturate(0.7) contrast(1.1)` filter
4. Vignette: `radial-gradient(ellipse, transparent 30%, rgba(7,8,15,0.60) 100%)`
+ 4 red vertex accent dots at each diamond tip

### CSS animation (globals.css)
```css
@keyframes diamond-breathe {
  0%, 100% { transform: translate(-50%,-50%) scale(1);    filter: drop-shadow(0 0 10px rgba(196,18,48,0.22)); }
  50%       { transform: translate(-50%,-50%) scale(1.028); filter: drop-shadow(0 0 22px rgba(196,18,48,0.44)); }
}
.diamond-frame { animation: diamond-breathe 9s ease-in-out infinite; }
```

---

## File Structure
```
my-project/
├── app/
│   ├── layout.tsx              # RootLayout — global bg layers (grid, glow, vignette, particles)
│   ├── page.tsx                # Home — cookie check → SignIn OR events dashboard + DiamondPhotoBackground
│   ├── globals.css             # Tailwind + Heebo + dark body bg + all @keyframes + .signout-link + .diamond-frame
│   └── api/
│       ├── auth/route.ts       # POST: email → lookup member → set cookie
│       ├── rsvp/route.ts       # POST: save RSVP to Google Sheets
│       ├── signout/route.ts    # POST: clear cookie
│       └── admin-override/route.ts  # POST: admin manually sets RSVP
│   admin/
│       ├── page.tsx            # Admin dashboard — attendance list per event + DiamondPhotoBackground
│       └── audit/page.tsx      # Data audit — RSVP match quality report + DiamondPhotoBackground
├── components/
│   ├── SignIn.tsx               # Login page — centered glassmorphic card (no diamond bg)
│   ├── Header.tsx               # Top nav — Logo.png, two-line subtitle, member info (SERVER COMPONENT)
│   ├── EventCard.tsx            # Event card — glassmorphic, corner brackets, RSVP buttons
│   ├── RSVPForm.tsx             # RSVP form — dark inputs, red gradient submit
│   ├── AdminOverrideButton.tsx  # Admin: manually set member attendance (CLIENT COMPONENT)
│   └── DiamondPhotoBackground.tsx  # 8 Yahalom unit photos in diamond frames (authenticated only)
├── lib/
│   └── googleSheets.ts         # All Google Sheets read/write logic
└── public/
    ├── Logo.jpg                 # Original logo (white bg) — DO NOT USE in components
    └── Logo.png                 # Transparent logo — ALWAYS USE THIS
```

---

## Data Model (Google Sheets)

### Members sheet (`Members!A2:E200`)
| A: id | B: firstName | C: lastName | D: email | E: category |
|-------|-------------|------------|---------|------------|
| Categories: `מנטור` | `מנטי` | `צוות` (staff — sees everything) |

### Events sheet (`Events!A2:J200`)
| A: id | B: name | C: date | D: time | E: location | F: address | G: description | H: active(TRUE/FALSE) | I: endtime | J: categories(comma-sep) |

### RSVPs sheet (`RSVPs!A2:F2000`)
| A: timestamp | B: eventId | C: eventName | D: name | E: email | F: attending (✓ מגיע / ✗ לא מגיע) |

### AdminOverrides sheet (`AdminOverrides!A2:F2000`)
| A: timestamp | B: eventId | C: memberEmail | D: memberName | E: attending | F: adminName |

---

## Auth Flow
1. User enters email on `/` (SignIn page)
2. `POST /api/auth` → looks up email in Members sheet (case-insensitive)
3. On match → sets `yahalom_member` cookie (JSON: {id, firstName, lastName, email, category})
4. Cookie missing `category` field → force re-login (handles old cookies)
5. Cookie expires in 1 year

## Access Control
- **No cookie** → shows SignIn (login card, no diamond bg)
- **מנטור / מנטי** → sees events matching their category + uncategorized events
- **צוות** (staff) → sees all events + admin link in header
- Admin pages: `/admin` and `/admin/audit` — redirect to `/` if not צוות

## Cache / No-Cache Headers
`next.config.js` sets `Cache-Control: no-store, no-cache, must-revalidate` on all routes.

## Key Animations (globals.css)
- `floatUp` — diamond particles float from bottom to top
- `pulse-glow` — red radial glow pulses slowly
- `shimmer-slide` — button shimmer sweep on hover
- `diamond-breathe` — photo diamonds scale + glow pulse (9s, offset per diamond)

## CSS Classes (globals.css)
- `.signout-link` / `.signout-link:hover` — header signout link hover color (used instead of onMouseEnter to keep Header a server component)
- `.diamond-frame` — applies `diamond-breathe` animation to each photo diamond
- `.diamond-bg-layer` — container for diamond photos (opacity 0.85 on screens ≤900px)

## Important Notes
- App is fully RTL — all layouts use `dir="rtl"`, text is right-aligned by default
- `export const dynamic = 'force-dynamic'` on `app/page.tsx` — never statically cached
- RSVP matching: by email OR full name (handles old manual RSVPs)
- Admin override takes precedence over self-RSVP in attendance lists
- Timestamps use `he-IL` locale, `Asia/Jerusalem` timezone
- **Header is a server component** — never add event handlers (onMouseEnter etc.) to it
- **Wikimedia `/thumb/` URLs return HTTP 400** — always use direct file URLs for images
- **Diamond photos use `position: fixed; z-index: 1`** inside layout's `z-index: 1` stacking context; page content must be `position: relative; z-index: 2` to sit above them
