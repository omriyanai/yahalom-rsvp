import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import { getMemberFromCookie } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function CommunityPage() {
  const member = getMemberFromCookie()
  if (!member) redirect('/')

  return (
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header member={member} />

        <div className="max-w-2xl mx-auto px-4 py-10">

          <Link href="/" className="inline-flex items-center gap-2 mb-7 text-sm"
            style={{ color: '#6B7280' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            חזרה לתפריט
          </Link>

          {/* Coming soon card */}
          <div className="rounded-2xl p-10 text-center" style={{
            background:     'rgba(9,11,20,0.84)',
            backdropFilter: 'blur(28px)',
            border:         '1px solid rgba(255,255,255,0.07)',
            boxShadow:      '0 0 60px rgba(196,18,48,0.07), 0 24px 48px rgba(0,0,0,0.6)',
          }}>
            {/* Animated diamond */}
            <div className="flex justify-center mb-6">
              <div style={{
                width: 64, height: 64,
                background: 'linear-gradient(135deg, rgba(196,18,48,0.3), rgba(139,13,34,0.2))',
                border: '1px solid rgba(196,18,48,0.4)',
                transform: 'rotate(45deg)',
                animation: 'pulse-glow 3s ease-in-out infinite',
                boxShadow: '0 0 30px rgba(196,18,48,0.25)',
              }} />
            </div>

            <h2 className="text-2xl font-bold mb-3" style={{ color: '#F9FAFB' }}>
              🤝 קהילת המנטורינג של יהל&quot;ם
            </h2>
            <p className="text-lg mb-2" style={{ color: '#C41230', fontWeight: 600 }}>
              הדף בבנייה
            </p>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              אנחנו עובדים על משהו מיוחד. בקרוב תוכלו להתחבר לקהילת בוגרי יהל&quot;ם ולעשות רשת מנטורינג רחבה יותר.
            </p>
          </div>
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
          תוכנית מנטורינג עמותת יהלום © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
