'use client'

import { useState, useEffect } from 'react'
import { Joyride, STATUS } from 'react-joyride'
import type { EventData, Step, TooltipRenderProps } from 'react-joyride'

const TOUR_KEY_LOGIN = 'yahalom_tour_login_v1'
const TOUR_KEY_MAIN  = 'yahalom_tour_main_v1'

// ── Custom Hebrew tooltip ───────────────────────────────────────────────────
function HebrewTooltip({
  continuous, index, step, backProps, closeProps, primaryProps, skipProps, tooltipProps, size,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      dir="rtl"
      style={{
        background:     'rgba(9,11,20,0.97)',
        border:         '1px solid rgba(196,18,48,0.45)',
        borderRadius:   16,
        padding:        '22px 24px 18px',
        maxWidth:       320,
        boxShadow:      '0 0 48px rgba(196,18,48,0.22), 0 20px 48px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        fontFamily:     'inherit',
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* top accent line */}
      <div style={{
        position:   'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #C41230, transparent)',
      }} />

      {/* step counter */}
      <div style={{
        fontSize: 11, color: 'rgba(196,18,48,0.85)',
        marginBottom: 8, fontWeight: 600, letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          display: 'inline-block', width: 18, height: 18, borderRadius: '50%',
          background: 'rgba(196,18,48,0.15)', border: '1px solid rgba(196,18,48,0.4)',
          textAlign: 'center', lineHeight: '18px', fontSize: 10, color: '#C41230',
        }}>
          {index + 1}
        </span>
        שלב {index + 1} מתוך {size}
      </div>

      {/* title */}
      {step.title && (
        <div style={{ fontSize: 17, fontWeight: 700, color: '#F9FAFB', marginBottom: 10, lineHeight: 1.4 }}>
          {step.title as React.ReactNode}
        </div>
      )}

      {/* body */}
      <div style={{ fontSize: 15, color: '#D1D5DB', lineHeight: 1.65, marginBottom: 20 }}>
        {step.content as React.ReactNode}
      </div>

      {/* buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <button
          {...skipProps}
          style={{
            background: 'transparent', border: 'none',
            color: '#6B7280', fontSize: 13, cursor: 'pointer', padding: '6px 0',
          }}
        >
          דלג על הסיור
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          {index > 0 && (
            <button
              {...backProps}
              style={{
                background:   'rgba(255,255,255,0.06)',
                border:       '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '8px 16px',
                color: '#9CA3AF', fontSize: 14, cursor: 'pointer',
              }}
            >
              ← חזור
            </button>
          )}
          <button
            {...(continuous ? primaryProps : closeProps)}
            style={{
              background:   'linear-gradient(135deg, #C41230, #8B0D22)',
              border:       'none',
              borderRadius: 8, padding: '8px 20px',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow:    '0 0 20px rgba(196,18,48,0.4)',
            }}
          >
            {continuous && index < size - 1 ? 'הבא ←' : 'סיום ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Steps ───────────────────────────────────────────────────────────────────
const LOGIN_STEPS: Step[] = [
  {
    target:     'body',
    placement:  'center',
    skipBeacon: true,
    title:      '👋 ברוכים הבאים לתוכנית המנטורינג של עמותת יהלום!',
    content:    'בואו נעשה סיור קצר שיעזור לכם להתחיל. זה ייקח פחות מדקה.',
  },
  {
    target:     '#tour-email',
    placement:  'bottom',
    skipBeacon: true,
    title:      '📧 כניסה עם אימייל',
    content:    'הזינו את כתובת האימייל הרשומה שלכם בעמותה. אין צורך בסיסמה.',
  },
  {
    target:     '#tour-login-btn',
    placement:  'top',
    skipBeacon: true,
    title:      '🔑 לחצו להיכנס',
    content:    'לחצו על "כניסה" — המערכת תזהה אתכם ותיכנס אוטומטית.',
  },
]

const MAIN_STEPS: Step[] = [
  {
    target:     'body',
    placement:  'center',
    skipBeacon: true,
    title:      '🎉 כניסה בוצעה בהצלחה!',
    content:    'עכשיו אתם בפנים. בואו נסביר מה רואים כאן.',
  },
  {
    target:     '#tour-events-list',
    placement:  'top',
    skipBeacon: true,
    title:      '📅 האירועים שלכם',
    content:    'כאן מופיעים כל האירועים הקרובים הרלוונטיים עבורכם לפי הקטגוריה שלכם.',
  },
  {
    target:     '#tour-event-card',
    placement:  'top',
    skipBeacon: true,
    title:      '🃏 כרטיסיית אירוע',
    content:    'כל כרטיסייה מציגה שם, תאריך, שעה ומיקום. אפשר גם לנווט ישירות דרך Waze.',
  },
  {
    target:     '#tour-rsvp-btn',
    placement:  'top',
    skipBeacon: true,
    title:      '✅ אישור הגעה',
    content:    'לחצו כאן כדי לאשר או לדחות את ההגעה. ניתן לשנות את התשובה בכל עת לפני האירוע.',
  },
]

// ── Component ───────────────────────────────────────────────────────────────
export default function TourGuide({ phase }: { phase: 'login' | 'main' }) {
  const [run, setRun] = useState(false)

  useEffect(() => {
    const key = phase === 'login' ? TOUR_KEY_LOGIN : TOUR_KEY_MAIN
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setRun(true), 900)
      return () => clearTimeout(t)
    }
  }, [phase])

  const handleEvent = (data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      const key = phase === 'login' ? TOUR_KEY_LOGIN : TOUR_KEY_MAIN
      localStorage.setItem(key, 'done')
      setRun(false)
    }
  }

  return (
    <Joyride
      steps={phase === 'login' ? LOGIN_STEPS : MAIN_STEPS}
      run={run}
      continuous
      tooltipComponent={HebrewTooltip}
      onEvent={handleEvent}
      options={{
        overlayColor:    'rgba(7,8,15,0.72)',
        spotlightPadding: 8,
      }}
    />
  )
}
