import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import { getMemberFromCookie } from '@/lib/auth'
import Link from 'next/link'
import { ChevronRight, Diamond } from 'lucide-react'

export const dynamic = 'force-dynamic'

const INFO_BLOCKS = [
  {
    title: 'מהי תוכנית המנטורינג?',
    body:  'תוכנית המנטורינג של עמותת יהל"ם מחברת בין אנשי מקצוע מנוסים מהתעשייה הפועלים בתחומים מגוונים במשק, לבין בוגרי יחידת יהל"ם הצעירים הנמצאים בתחילת דרכם האזרחית. המטרה היא להעביר ידע, ניסיון ותמיכה מקצועית ואישית.',
  },
  {
    title: 'המנטורים',
    body:  'המנטורים הם אנשים בעלי ניסיון עשיר ומגוון בשווקים שונים — טכנולוגיה, פיננסים, יזמות, ביטחון, אקדמיה ועוד. הם אנשי מקצוע מובילים מהתעשייה שמביאים עמם שנות ניסיון משמעותיות, רשת קשרים רחבה ויכולת הכוונה מעשית לבוגרי היחידה.',
  },
  {
    title: 'המנטים',
    body:  'המנטים הם לוחמים ובוגרי יחידת יהל"ם — אנשים שסיימו שירות משמעותי ביחידה ומצויים בנקודת מפנה: מעבר לאקדמיה, לתעשייה או להקמת עסק עצמאי. התוכנית מכינה אותם לצעד הבא עם ליווי אישי ומקצועי.',
  },
  {
    title: 'מבנה התוכנית',
    body:  'התוכנית מתנהלת במחזורים שנתיים. בכל מחזור מותאמים זוגות מנטור–מנטי על בסיס תחומי עניין ומטרות משותפות. לצד המפגשים האישיים מתקיימים אירועים קבוצתיים — הרצאות, סיורים, מפגשי רשת ועוד.',
  },
  {
    title: 'ערכי התוכנית',
    body:  'אחווה, מקצועיות ומסירות — ערכי יחידת יהל"ם מנחים גם את תוכנית המנטורינג. אנחנו מאמינים בכוח הקהילה ובהעברת ידע מדור לדור בין אנשי היחידה.',
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
            <ChevronRight size={16} strokeWidth={2} />
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
              <div key={i} className="rounded-2xl p-6 liquid-glass">
                <div className="flex items-center gap-3 mb-3">
                  <Diamond size={9} fill="#C41230" style={{ color: '#C41230', flexShrink: 0 }} />
                  <h3 className="font-bold text-base" style={{ color: '#F9FAFB' }}>{block.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{block.body}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
          תוכנית מנטורינג עמותת יהל״ם © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
