'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SignIn() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'שגיאה בהתחברות')
      } else {
        window.location.reload()
      }
    } catch {
      setError('שגיאה בהתחברות. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !loading && email.trim().length > 0

  return (
    /* Background layers are now in layout.tsx — this just needs the centered card */
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ══════════════════════════════════════
          MAIN CARD
      ══════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-[420px] px-5 py-8">
        <div
          className="relative rounded-[28px] overflow-hidden"
          style={{
            background:        'rgba(9, 11, 20, 0.84)',
            backdropFilter:    'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border:            '1px solid rgba(255,255,255,0.07)',
            boxShadow: [
              '0 0 90px rgba(196,18,48,0.10)',
              '0 40px 80px rgba(0,0,0,0.75)',
              'inset 0 1px 0 rgba(255,255,255,0.07)',
              'inset 0 -1px 0 rgba(0,0,0,0.4)',
            ].join(', '),
          }}
        >

          {/* ── Tactical corner brackets ── */}
          <svg className="absolute top-0 left-0 w-11 h-11 pointer-events-none" viewBox="0 0 44 44" fill="none">
            <path d="M3 22 L3 3 L22 3" stroke="rgba(196,18,48,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="absolute top-0 right-0 w-11 h-11 pointer-events-none" viewBox="0 0 44 44" fill="none">
            <path d="M41 22 L41 3 L22 3" stroke="rgba(196,18,48,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="absolute bottom-0 left-0 w-11 h-11 pointer-events-none" viewBox="0 0 44 44" fill="none">
            <path d="M3 22 L3 41 L22 41" stroke="rgba(196,18,48,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg className="absolute bottom-0 right-0 w-11 h-11 pointer-events-none" viewBox="0 0 44 44" fill="none">
            <path d="M41 22 L41 41 L22 41" stroke="rgba(196,18,48,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* Card inner content */}
          <div className="px-10 pt-12 pb-10">

            {/* ── Logo section ── */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(196,18,48,0.28), transparent 65%)',
                    filter:     'blur(28px)',
                    transform:  'scale(2.0)',
                  }}
                />
                <Image
                  src="/Logo.png"
                  alt="עמותת יהלום"
                  width={210}
                  height={92}
                  style={{
                    height: 'auto',
                    width:  'auto',
                    position: 'relative',
                    filter:
                      'drop-shadow(0 2px 18px rgba(196,18,48,0.55)) drop-shadow(0 1px 5px rgba(0,0,0,0.95))',
                  }}
                  priority
                />
              </div>

              {/* Badge line */}
              <div className="flex items-center gap-3">
                <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, rgba(196,18,48,0.75))' }} />
                <span className="text-[10px] font-bold tracking-[0.28em] uppercase select-none" style={{ color: 'rgba(196,18,48,0.82)' }}>
                  תוכנית מנטורינג
                </span>
                <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.75))' }} />
              </div>
            </div>

            {/* ── Title ── */}
            <div className="text-center mb-8">
              <h1 className="text-[2rem] font-bold leading-tight mb-2" style={{ color: '#F9FAFB', letterSpacing: '-0.01em' }}>
                ברוכים הבאים
              </h1>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.6 }}>
                הזינו את כתובת האימייל שלכם להמשך
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email input */}
              <div className="relative">
                <input
                  id="tour-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="w-full rounded-xl px-4 py-[14px] text-white placeholder-gray-600 focus:outline-none transition-all duration-300 text-left text-sm"
                  placeholder="your@email.com"
                  dir="ltr"
                  autoFocus
                  style={{
                    background: focused ? 'rgba(196,18,48,0.06)' : 'rgba(255,255,255,0.04)',
                    border: focused ? '1px solid rgba(196,18,48,0.55)' : '1px solid rgba(255,255,255,0.09)',
                    boxShadow: focused
                      ? '0 0 0 3px rgba(196,18,48,0.12), inset 0 1px 0 rgba(255,255,255,0.04)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                    caretColor: '#C41230',
                  }}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 transition-colors duration-300" style={{ color: focused ? 'rgba(196,18,48,0.7)' : '#4B5563' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl px-4 py-[11px]"
                  style={{ background: 'rgba(196,18,48,0.09)', border: '1px solid rgba(196,18,48,0.28)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#F87171' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: '#F87171' }}>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                id="tour-login-btn"
                type="submit"
                disabled={!canSubmit}
                className="relative w-full overflow-hidden rounded-xl py-[14px] font-bold text-white text-[1.05rem] transition-all duration-300 group"
                style={{
                  background: canSubmit ? 'linear-gradient(135deg, #C41230 0%, #8B0D22 100%)' : 'rgba(196,18,48,0.22)',
                  boxShadow:  canSubmit ? '0 0 36px rgba(196,18,48,0.38), 0 4px 18px rgba(196,18,48,0.25)' : 'none',
                  cursor:     canSubmit ? 'pointer' : 'not-allowed',
                  opacity:    canSubmit ? 1 : 0.45,
                }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.13) 50%, transparent 100%)', animation: canSubmit ? 'shimmer-slide 1.8s ease infinite' : 'none' }} />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      מחפש...
                    </>
                  ) : (
                    <>
                      כניסה
                      <svg className="w-5 h-5" style={{ transform: 'scaleX(-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* ── Footer disclaimer ── */}
            <div className="mt-8 pt-6 text-center space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-[13px] h-[13px]" style={{ color: '#374151' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>
                <p className="text-xs" style={{ color: '#4B5563' }}>רק מוזמנים רשומים יכולים להיכנס למערכת</p>
              </div>
              <p className="text-[11px]" style={{ color: '#2D3748' }}>תוכנית מנטורינג עמותת יהלום © {new Date().getFullYear()}</p>
            </div>

          </div>{/* /card inner */}
        </div>{/* /card */}

        {/* Small diamond accent below card */}
        <div className="flex justify-center mt-5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polygon points="6,1 11,6 6,11 1,6" fill="none" stroke="rgba(196,18,48,0.4)" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  )
}
