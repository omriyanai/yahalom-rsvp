import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import SignIn from '@/components/SignIn'
import { getEvents, getMembers, getAllRSVPs, type Member, type Event } from '@/lib/googleSheets'

export const dynamic = 'force-dynamic'

const CATEGORY_ORDER = ['מנטור', 'מנטי', 'צוות']
const CATEGORY_LABEL: Record<string, string> = {
  'מנטור': 'מנטורים',
  'מנטי':  'מנטיים',
  'צוות':  'צוות',
}

function formatHebrewDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('he-IL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function NameList({ members }: { members: Member[] }) {
  if (members.length === 0) return <p className="text-xs text-gray-300 italic">—</p>
  return (
    <ul className="space-y-0.5">
      {members.map(m => (
        <li key={m.id} className="text-sm text-gray-700">{m.firstName} {m.lastName}</li>
      ))}
    </ul>
  )
}

function CategorySection({ cat, members, latestByEmail }: {
  cat: string
  members: Member[]
  latestByEmail: Map<string, string>
}) {
  const inCat    = members.filter(m => m.category === cat)
  if (inCat.length === 0) return null

  const attending    = inCat.filter(m => latestByEmail.get(m.email.toLowerCase()) === '✓ מגיע')
  const notAttending = inCat.filter(m => latestByEmail.get(m.email.toLowerCase()) === '✗ לא מגיע')
  const noResponse   = inCat.filter(m => !latestByEmail.has(m.email.toLowerCase()))

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <p className="text-xs font-bold text-yahalom-gray uppercase tracking-widest mb-3">
        {CATEGORY_LABEL[cat] || cat}
        <span className="font-normal mr-2 text-gray-400">
          ({attending.length + notAttending.length}/{inCat.length} ענו)
        </span>
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs font-bold text-green-700 mb-2">מגיע ✓ ({attending.length})</p>
          <NameList members={attending} />
        </div>
        <div className="bg-red-50 rounded-xl p-3">
          <p className="text-xs font-bold text-red-600 mb-2">לא מגיע ✗ ({notAttending.length})</p>
          <NameList members={notAttending} />
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-bold text-gray-500 mb-2">טרם ענו ⏳ ({noResponse.length})</p>
          <NameList members={noResponse} />
        </div>
      </div>
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

  if (!member.category) {
    cookieStore.delete('yahalom_member')
    return <SignIn />
  }

  if (member.category !== 'צוות') redirect('/')

  const [events, members, rsvps] = await Promise.all([
    getEvents(), getMembers(), getAllRSVPs(),
  ])

  return (
    <main className="min-h-screen bg-gray-100">
      <Header member={member} />
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-yahalom-dark">סטטוס אישורי הגעה</h2>
          <Link href="/" className="text-sm text-yahalom-red hover:underline font-medium">← חזרה לאירועים</Link>
        </div>

        <div className="space-y-8">
          {events.map((event) => {
            // latest RSVP per email for this event
            const latestByEmail = new Map<string, string>()
            for (const r of rsvps) {
              if (r.eventId === event.id)
                latestByEmail.set(r.email.toLowerCase(), r.attending)
            }

            // which categories are invited to this event
            const invitedCats = event.categories.length > 0
              ? CATEGORY_ORDER.filter(c => event.categories.includes(c))
              : CATEGORY_ORDER

            // filter members to only those invited
            const invitedMembers = members.filter(m =>
              invitedCats.includes(m.category)
            )

            const totalAnswered = invitedMembers.filter(m =>
              latestByEmail.has(m.email.toLowerCase())
            ).length

            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="h-1.5 bg-yahalom-red" />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-yahalom-dark mb-1">{event.name}</h3>
                      <p className="text-sm text-gray-400">{formatHebrewDate(event.date)} | {event.time}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                      {totalAnswered}/{invitedMembers.length} ענו
                    </span>
                  </div>

                  {invitedCats.map(cat => (
                    <CategorySection
                      key={cat}
                      cat={cat}
                      members={invitedMembers}
                      latestByEmail={latestByEmail}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
