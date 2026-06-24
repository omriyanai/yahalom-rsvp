import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import EventCard from '@/components/EventCard'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
import { getMemberFromCookie } from '@/lib/auth'
import { getEvents, getAllRSVPs, getAdminOverrides } from '@/lib/googleSheets'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const member = getMemberFromCookie()
  if (!member) redirect('/')

  let events: Awaited<ReturnType<typeof getEvents>> = []
  let rsvpMap: Record<string, 'yes' | 'no'> = {}

  try {
    const [all, allRsvps, allOverrides] = await Promise.all([
      getEvents(),
      getAllRSVPs(),
      getAdminOverrides(),
    ])

    events = all.filter(e =>
      member.category === 'צוות' ||
      e.categories.length === 0 ||
      e.categories.includes(member.category)
    )

    const memberEmail = member.email.toLowerCase()
    const memberName = `${member.firstName} ${member.lastName}`

    // Build map from self-RSVPs
    for (const r of allRsvps) {
      if (r.email.toLowerCase() === memberEmail || r.name === memberName) {
        rsvpMap[r.eventId] = r.attending.includes('✓') ? 'yes' : 'no'
      }
    }

    // Admin overrides take precedence
    for (const o of allOverrides) {
      if (o.memberEmail.toLowerCase() === memberEmail) {
        rsvpMap[o.eventId] = o.attending === 'מגיע' ? 'yes' : 'no'
      }
    }
  } catch (e) {
    console.error('Failed to load events:', e)
  }

  return (
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Header member={member} showAdminLink={member.category === 'צוות'} />

        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 mb-7 text-sm transition-colors"
            style={{ color: '#6B7280' }}>
            <ChevronRight size={16} strokeWidth={2} />
            חזרה לתפריט
          </Link>

          {/* Title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, rgba(196,18,48,0.5))' }} />
            <h2 className="text-2xl font-bold tracking-tight text-center" style={{ color: '#F9FAFB' }}>
              אירועים קרובים
            </h2>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.5))' }} />
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl p-10 text-center liquid-glass">
              <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>אין אירועים קרובים כרגע</p>
              <p style={{ color: '#374151', fontSize: '0.875rem', marginTop: '0.5rem' }}>בקרוב יתווספו אירועים חדשים</p>
            </div>
          ) : (
            <div id="tour-events-list" className="space-y-8">
              {events.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  member={member}
                  isFirst={i === 0}
                  initialAttending={rsvpMap[event.id] ?? null}
                />
              ))}
            </div>
          )}
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
          תוכנית מנטורינג עמותת יהל״ם © {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
