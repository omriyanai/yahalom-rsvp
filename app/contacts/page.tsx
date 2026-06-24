import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import { getMemberFromCookie } from '@/lib/auth'
import { getMembers } from '@/lib/googleSheets'
import Link from 'next/link'
import { GraduationCap, Star, Shield, Phone, Mail, ChevronRight, type LucideIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, { label: string; icon: LucideIcon }> = {
  'מנטור': { label: 'מנטורים', icon: GraduationCap },
  'מנטי':  { label: 'מנטים',   icon: Star },
  'צוות':  { label: 'צוות',    icon: Shield },
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
            <ChevronRight size={16} strokeWidth={2} />
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
            {sortedCategories.map(cat => {
              const catInfo = CATEGORY_LABELS[cat]
              const CatIcon = catInfo?.icon
              return (
              <div key={cat}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#C41230' }}>
                    {CatIcon && <CatIcon size={18} strokeWidth={1.8} />}
                    {catInfo?.label ?? cat}
                  </h3>
                  <div className="flex-1 h-px" style={{ background: 'rgba(196,18,48,0.25)' }} />
                  <span className="text-xs" style={{ color: '#4B5563' }}>{grouped[cat].length} חברים</span>
                </div>

                {/* Members list */}
                <div className="rounded-2xl overflow-hidden liquid-glass">
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
                          <p className="text-xs" style={{ color: '#4B5563' }}>{m.email}</p>
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
                            <Phone size={15} strokeWidth={1.8} style={{ color: '#4ADE80' }} />
                          </a>
                        )}
                        {/* Email */}
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center justify-center w-9 h-9 rounded-xl transition-opacity hover:opacity-80"
                          style={{ background: 'rgba(196,18,48,0.10)', border: '1px solid rgba(196,18,48,0.2)' }}
                          title={`שלח אימייל ל-${m.firstName}`}
                        >
                          <Mail size={15} strokeWidth={1.8} style={{ color: '#C41230' }} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

            {members.length === 0 && (
              <div className="rounded-2xl p-10 text-center liquid-glass">
                <p style={{ color: '#6B7280' }}>לא נמצאו משתתפים</p>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
          תוכנית מנטורינג עמותת יהל״ם © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
