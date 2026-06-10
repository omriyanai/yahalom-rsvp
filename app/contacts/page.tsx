import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import { getMemberFromCookie } from '@/lib/auth'
import { getMembers } from '@/lib/googleSheets'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  'מנטור': '🎓 מנטורים',
  'מנטי':  '⭐ מנטים',
  'צוות':  '🛡️ צוות',
}

export default async function ContactsPage() {
  const member = getMemberFromCookie()
  if (!member) redirect('/')

  let members: Awaited<ReturnType<typeof getMembers>> = []
  try {
    members = await getMembers()
  } catch (e) {
    console.error('Failed to load members:', e)
  }

  // Group by category
  const grouped = members.reduce<Record<string, typeof members>>((acc, m) => {
    const cat = m.category || 'אחר'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(m)
    return acc
  }, {})

  const categoryOrder = ['מנטור', 'מנטי', 'צוות']
  const sortedCategories = [
    ...categoryOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !categoryOrder.includes(c)),
  ]

  return (
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header member={member} />

        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Back */}
          <Link href="/" className="inline-flex items-center gap-2 mb-7 text-sm transition-colors"
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
              דף קשר מחזור נוכחי
            </h2>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.5))' }} />
          </div>

          {/* Contact groups */}
          <div className="space-y-6">
            {sortedCategories.map(cat => (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold" style={{ color: '#C41230' }}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h3>
                  <div className="flex-1 h-px" style={{ background: 'rgba(196,18,48,0.25)' }} />
                  <span className="text-xs" style={{ color: '#4B5563' }}>{grouped[cat].length} חברים</span>
                </div>

                {/* Members list */}
                <div className="rounded-2xl overflow-hidden" style={{
                  background:     'rgba(9,11,20,0.84)',
                  backdropFilter: 'blur(28px)',
                  border:         '1px solid rgba(255,255,255,0.07)',
                  boxShadow:      '0 0 40px rgba(196,18,48,0.05), 0 16px 32px rgba(0,0,0,0.5)',
                }}>
                  {grouped[cat].map((m, idx) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between px-5 py-4"
                      style={{
                        borderBottom: idx < grouped[cat].length - 1
                          ? '1px solid rgba(255,255,255,0.05)'
                          : 'none',
                      }}
                    >
                      {/* Avatar + name */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(196,18,48,0.12)',
                            border:     '1px solid rgba(196,18,48,0.25)',
                            color:      '#C41230',
                            fontSize:   14,
                            fontWeight: 700,
                          }}>
                          {m.firstName?.[0]}{m.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#F9FAFB' }}>
                            {m.firstName} {m.lastName}
                          </p>
                          {m.phone
                            ? <p className="text-xs" style={{ color: '#9CA3AF' }} dir="ltr">{m.phone}</p>
                            : <p className="text-xs" style={{ color: '#4B5563' }}>{m.email}</p>
                          }
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {/* Phone */}
                        {m.phone && (
                          <a
                            href={`tel:${m.phone}`}
                            className="flex items-center justify-center w-9 h-9 rounded-xl transition-opacity hover:opacity-80"
                            style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)' }}
                            title={`התקשר ל-${m.firstName}`}
                          >
                            <svg className="w-4 h-4" style={{ color: '#4ADE80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        )}
                        {/* Email */}
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center justify-center w-9 h-9 rounded-xl transition-opacity hover:opacity-80"
                          style={{ background: 'rgba(196,18,48,0.10)', border: '1px solid rgba(196,18,48,0.2)' }}
                          title={`שלח אימייל ל-${m.firstName}`}
                        >
                          <svg className="w-4 h-4" style={{ color: '#C41230' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="rounded-2xl p-10 text-center" style={{
                background: 'rgba(9,11,20,0.84)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ color: '#6B7280' }}>לא נמצאו משתתפים</p>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
          תוכנית מנטורינג עמותת יהלום © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
