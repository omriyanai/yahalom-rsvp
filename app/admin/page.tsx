import { cookies } from 'next/headers'
import Link from 'next/link'
import Header from '@/components/Header'
import SignIn from '@/components/SignIn'
import { getEvents, getMembers, getAllRSVPs, type Member } from '@/lib/googleSheets'

export const dynamic = 'force-dynamic'

function formatHebrewDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('he-IL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function Group({ title, members, bg, text }: {
  title: string
  members: Member[]
  bg: string
  text: string
}) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <p className={`font-bold text-sm mb-3 ${text}`}>
        {title} <span className="font-normal">({members.length})</span>
      </p>
      {members.length === 0 ? (
        <p className="text-xs text-gray-400">—</p>
      ) : (
        <ul className="space-y-1">
          {members.map((m) => (
            <li key={m.id} className="text-sm text-gray-700">
              {m.firstName} {m.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default async function AdminPage() {
  const cookieStore = cookies()
  const memberCookie = cookieStore.get('yahalom_member')
  if (!memberCookie) return <SignIn />

  let member: Member
  try { member = JSON.parse(memberCookie.value) }
  catch { return <SignIn /> }

  const [events, members, rsvps] = await Promise.all([
    getEvents(), getMembers(), getAllRSVPs(),
  ])

  return (
    <main className="min-h-screen bg-gray-100">
      <Header member={member} />
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-yahalom-dark">סטטוס אישורי הגעה</h2>
          <Link href="/" className="text-sm text-yahalom-red hover:underline font-medium">
            ← חזרה לאירועים
          </Link>
        </div>

        <div className="space-y-8">
          {events.map((event) => {
            // Take the latest RSVP per email per event
            const latestByEmail = new Map<string, string>()
            for (const r of rsvps) {
              if (r.eventId === event.id) {
                latestByEmail.set(r.email.toLowerCase(), r.attending)
              }
            }

            const attending   = members.filter(m => latestByEmail.get(m.email.toLowerCase()) === '✓ מגיע')
            const notAttending = members.filter(m => latestByEmail.get(m.email.toLowerCase()) === '✗ לא מגיע')
            const noResponse  = members.filter(m => !latestByEmail.has(m.email.toLowerCase()))

            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="h-1.5 bg-yahalom-red" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-yahalom-dark mb-1">{event.name}</h3>
                  <p className="text-sm text-gray-400 mb-5">
                    {formatHebrewDate(event.date)} | {event.time}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Group title="מגיע ✓"       members={attending}    bg="bg-green-50"  text="text-green-700" />
                    <Group title="לא מגיע ✗"    members={notAttending} bg="bg-red-50"    text="text-red-600"  />
                    <Group title="טרם ענו ⏳"   members={noResponse}  bg="bg-gray-50"   text="text-gray-500" />
                  </div>

                  <p className="text-xs text-gray-300 mt-4 text-left">
                    {attending.length + notAttending.length} / {members.length} ענו
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
