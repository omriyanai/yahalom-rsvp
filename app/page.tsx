import Link from 'next/link'
import SignIn from '@/components/SignIn'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import TourGuide from '@/components/TourGuide'
import { getMemberFromCookie } from '@/lib/auth'
import { CalendarDays, PhoneCall, Users, BookOpen, ChevronLeft, LockKeyhole, type LucideIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

const SECTIONS: Array<{
  icon: LucideIcon
  title: string
  subtitle: string
  href: string
  active: boolean
}> = [
  {
    icon:     CalendarDays,
    title:    'אירועי תוכנית מנטורינג מחזור נוכחי',
    subtitle: 'אישור הגעה לאירועים הקרובים',
    href:     '/events',
    active:   true,
  },
  {
    icon:     PhoneCall,
    title:    'דף קשר מחזור נוכחי',
    subtitle: 'פרטי קשר של משתתפי התוכנית',
    href:     '/contacts',
    active:   true,
  },
  {
    icon:     Users,
    title:    'קהילת המנטורינג של יהל"ם',
    subtitle: 'הדף בבנייה — בקרוב!',
    href:     '/community',
    active:   false,
  },
  {
    icon:     BookOpen,
    title:    'אודות התוכנית',
    subtitle: 'מידע על תוכנית המנטורינג',
    href:     '/about',
    active:   true,
  },
]

export default function Home() {
  const member = getMemberFromCookie()

  if (!member) return (
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <div className="relative" style={{ zIndex: 2 }}><SignIn /></div>
      <TourGuide phase="login" />
    </main>
  )

  return (
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <TourGuide phase="main" />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header member={member} />

        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Page title */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, rgba(196,18,48,0.5))' }} />
            <h2 className="text-2xl font-bold tracking-tight text-center" style={{ color: '#F9FAFB' }}>
              תפריט ראשי
            </h2>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.5))' }} />
          </div>
          <p className="text-center text-sm mb-10" style={{ color: '#6B7280' }}>
            שלום, {member.firstName}! מה תרצה לעשות היום?
          </p>

          {/* 4 navigation cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none liquid-glass"
                style={{
                  opacity: s.active ? 1 : 0.5,
                  cursor:  s.active ? 'pointer' : 'default',
                  pointerEvents: s.active ? 'auto' : 'none',
                }}
              >
                {/* Top accent line (only active) */}
                {s.active && (
                  <div className="h-[2px]" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(196,18,48,0.8) 40%, #C41230 60%, rgba(196,18,48,0.8) 80%, transparent 100%)',
                  }} />
                )}

                {/* Corner brackets */}
                <svg className="absolute top-0 right-0 w-8 h-8 pointer-events-none" viewBox="0 0 44 44" fill="none">
                  <path d="M41 22 L41 3 L22 3" stroke="rgba(196,18,48,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none" viewBox="0 0 44 44" fill="none">
                  <path d="M3 22 L3 41 L22 41" stroke="rgba(196,18,48,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {/* Hover shimmer */}
                {s.active && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(196,18,48,0.04), transparent 60%)' }}
                  />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* Icon */}
                      <div className="mb-3">
                        <s.icon size={26} style={{ color: s.active ? '#C41230' : '#4B5563' }} strokeWidth={1.6} />
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base leading-snug mb-2" style={{ color: '#F9FAFB' }}>
                        {s.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm" style={{ color: s.active ? '#9CA3AF' : '#6B7280' }}>
                        {s.subtitle}
                      </p>
                    </div>

                    {/* Arrow */}
                    {s.active && (
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'rgba(196,18,48,0.15)',
                          border:     '1px solid rgba(196,18,48,0.3)',
                        }}
                      >
                        <ChevronLeft size={16} style={{ color: '#C41230' }} strokeWidth={2.2} />
                      </div>
                    )}

                    {/* Lock icon for inactive */}
                    {!s.active && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <LockKeyhole size={15} style={{ color: '#4B5563' }} strokeWidth={1.8} />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
          תוכנית מנטורינג עמותת יהלום © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
