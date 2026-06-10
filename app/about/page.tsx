import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import { getMemberFromCookie } from '@/lib/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const INFO_BLOCKS = [
  {
    emoji: '◆',
    title: 'מהי תוכנית המנטורינג?',
    body:  'תוכנית המנטורינג של עמותת יהל"ם מחברת בין בוגרי יחידת יהל"ם לחיילים ובוגרים צעירים יותר. המטרה היא להעביר ידע, ניסיון ותמיכה מקצועית ואישית.',
  },
  {
    emoji: '◆',
    title: 'מבנה התוכנית',
    body:  'התוכנית מתנהלת במחזורים. בכל מחזור מתאמים מנטורים — בוגרים מנוסים — עם מנטים — חיילים ובוגרים בתחילת דרכם. הפגישות מתקיימות לאורך השנה, לצד אירועים משותפים.',
  },
  {
    emoji: '◆',
    title: 'אירועים',
    body:  'במסגרת התוכנית מתקיימים אירועים קבוצתיים — מפגשי רשת, הרצאות, סיורים וימי פעילות. האירועים מופיעים בלוח האירועים ומאפשרים אישור הגעה דיגיטלי.',
  },
  {
    emoji: '◆',
    title: 'ערכי התוכנית',
    body:  'אחווה, מקצועיות, ומסירות — ערכי יחידת יהל"ם מנחים גם את תוכנית המנטורינג. אנחנו מאמינים בכוח הקהילה ובהעברת ידע מדור לדור.',
  },
]

export default function AboutPage() {
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

          {/* Title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, rgba(196,18,48,0.5))' }} />
            <h2 className="text-2xl font-bold tracking-tight text-center" style={{ color: '#F9FAFB' }}>
              אודות התוכנית
            </h2>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.5))' }} />
          </div>

          <div className="space-y-4">
            {INFO_BLOCKS.map((block, i) => (
              <div key={i} className="rounded-2xl p-6" style={{
                background:     'rgba(9,11,20,0.84)',
                backdropFilter: 'blur(28px)',
                border:         '1px solid rgba(255,255,255,0.07)',
                boxShadow:      '0 0 40px rgba(196,18,48,0.05), 0 16px 32px rgba(0,0,0,0.5)',
              }}>
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ color: '#C41230', fontSize: 10 }}>◆</span>
                  <h3 className="font-bold text-base" style={{ color: '#F9FAFB' }}>{block.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{block.body}</p>
              </div>
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
