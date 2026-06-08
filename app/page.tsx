import { cookies } from 'next/headers'
import Header from '@/components/Header'
import EventCard from '@/components/EventCard'
import SignIn from '@/components/SignIn'
import { getEvents, type Member } from '@/lib/googleSheets'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const cookieStore = cookies()
  const memberCookie = cookieStore.get('yahalom_member')

  if (!memberCookie) return <SignIn />

  let member: Member
  try {
    member = JSON.parse(memberCookie.value)
  } catch {
    return <SignIn />
  }

  // If cookie is old (missing category), force re-login to get fresh data
  if (!member.category) {
    cookieStore.delete('yahalom_member')
    return <SignIn />
  }

  let events: Awaited<ReturnType<typeof getEvents>> = []
  try {
    const all = await getEvents()
    events = all.filter(e =>
      member.category === 'צוות' ||   // staff sees everything
      e.categories.length === 0 ||     // no filter set = everyone
      e.categories.includes(member.category)
    )
  } catch (e) {
    console.error('Failed to load events:', e)
  }

  return (
    <main className="min-h-screen">
      <Header member={member} />

        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Page title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, rgba(196,18,48,0.5))' }} />
            <h2 className="text-2xl font-bold tracking-tight text-center" style={{ color: '#F9FAFB' }}>
              אירועים קרובים
            </h2>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.5))' }} />
          </div>

          {events.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                background:           'rgba(9,11,20,0.84)',
                backdropFilter:       'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border:               '1px solid rgba(255,255,255,0.07)',
                boxShadow:            '0 0 40px rgba(196,18,48,0.07), 0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>אין אירועים קרובים כרגע</p>
              <p style={{ color: '#374151', fontSize: '0.875rem', marginTop: '0.5rem' }}>בקרוב יתווספו אירועים חדשים</p>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} member={member} />
              ))}
            </div>
          )}
        </div>

        <footer className="text-center text-xs pb-8 mt-4" style={{ color: '#374151' }}>
        עמותת יהלום © {new Date().getFullYear()}
      </footer>
    </main>
  )
}
