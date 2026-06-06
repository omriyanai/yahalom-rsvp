import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import SignIn from '@/components/SignIn'
import AdminOverrideButton from '@/components/AdminOverrideButton'
import {
  getEvents, getMembers, getAllRSVPs, getAdminOverrides,
  type Member, type RSVPRecord, type AdminOverride,
} from '@/lib/googleSheets'

export const dynamic = 'force-dynamic'

const CATEGORY_ORDER = ['מנטור', 'מנטי', 'צוות']
const CATEGORY_LABEL: Record<string, string> = { 'מנטור': 'מנטורים', 'מנטי': 'מנטיים', 'צוות': 'צוות' }

const norm = (s: string) => s.trim().replace(/\s+/g, ' ')

function formatHebrewDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('he-IL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

type StatusSource = 'email' | 'name' | 'admin' | 'none'
interface MemberStatus {
  attending: boolean | null
  source: StatusSource
  adminName?: string
}

function computeStatus(
  member: Member,
  rsvps: RSVPRecord[],
  overrides: AdminOverride[],
  eventId: string
): MemberStatus {
  // Admin override wins — take latest (last entry)
  const override = [...overrides].reverse().find(o =>
    o.eventId === eventId && (
      norm(o.memberEmail).toLowerCase() === norm(member.email).toLowerCase() ||
      norm(o.memberName) === norm(`${member.firstName} ${member.lastName}`)
    )
  )
  if (override) return {
    attending: override.attending === 'מגיע',
    source: 'admin',
    adminName: override.adminName,
  }

  // Member RSVP — email match first
  const eventRSVPs = rsvps.filter(r => r.eventId === eventId)
  const byEmail = eventRSVPs.find(r => norm(r.email).toLowerCase() === norm(member.email).toLowerCase())
  if (byEmail) return {
    attending: byEmail.attending.includes('מגיע') && !byEmail.attending.includes('לא'),
    source: 'email',
  }

  // Name match fallback
  const byName = eventRSVPs.find(r => norm(r.name) === norm(`${member.firstName} ${member.lastName}`))
  if (byName) return {
    attending: byName.attending.includes('מגיע') && !byName.attending.includes('לא'),
    source: 'name',
  }

  return { attending: null, source: 'none' }
}

function StatusBadge({ status }: { status: MemberStatus }) {
  if (status.attending === null) {
    return <span className="text-xs text-gray-400">טרם ענה ⏳</span>
  }
  if (status.attending) {
    return (
      <span className="text-xs text-green-700 font-medium">
        ✓ מגיע
        {status.source === 'admin' && (
          <span className="mr-1 text-green-500 font-normal">(ע"י {status.adminName} 👤)</span>
        )}
      </span>
    )
  }
  return (
    <span className="text-xs text-red-500 font-medium">
      ✗ לא מגיע
      {status.source === 'admin' && (
        <span className="mr-1 text-red-400 font-normal">(ע"י {status.adminName} 👤)</span>
      )}
    </span>
  )
}

export default async function AdminPage() {
  const cookieStore = cookies()
  const memberCookie = cookieStore.get('yahalom_member')
  if (!memberCookie) return <SignIn />

  let admin: Member
  try { admin = JSON.parse(memberCookie.value) }
  catch { return <SignIn /> }

  if (!admin.category) { cookieStore.delete('yahalom_member'); return <SignIn /> }
  if (admin.category !== 'צוות') redirect('/')

  const [events, members, rsvps, overrides] = await Promise.all([
    getEvents(), getMembers(), getAllRSVPs(), getAdminOverrides(),
  ])

  return (
    <main className="min-h-screen bg-gray-100">
      <Header member={admin} />
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-yahalom-dark">סטטוס אישורי הגעה</h2>
          <div className="flex gap-4">
            <Link href="/admin/audit" className="text-sm text-yellow-600 hover:underline font-medium">🔍 בדיקת נתונים</Link>
            <Link href="/" className="text-sm text-yahalom-red hover:underline font-medium">← חזרה לאירועים</Link>
          </div>
        </div>

        <div className="space-y-8">
          {events.map((event) => {
            const invitedCats = event.categories.length > 0
              ? CATEGORY_ORDER.filter(c => event.categories.includes(c))
              : CATEGORY_ORDER
            const invitedMembers = members.filter(m => invitedCats.includes(m.category))

            const statuses = new Map(invitedMembers.map(m => [
              m.id, computeStatus(m, rsvps, overrides, event.id)
            ]))

            const totalAnswered = invitedMembers.filter(m => statuses.get(m.id)?.attending !== null).length

            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                <div className="h-1.5 bg-yahalom-red" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-yahalom-dark mb-1">{event.name}</h3>
                      <p className="text-sm text-gray-400">{formatHebrewDate(event.date)} | {event.time}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                      {totalAnswered}/{invitedMembers.length} ענו
                    </span>
                  </div>

                  {invitedCats.map(cat => {
                    const catMembers = invitedMembers.filter(m => m.category === cat)
                    if (catMembers.length === 0) return null
                    const catAnswered = catMembers.filter(m => statuses.get(m.id)?.attending !== null).length

                    return (
                      <div key={cat} className="border-t border-gray-100 pt-4 mt-4">
                        <p className="text-xs font-bold text-yahalom-gray uppercase tracking-widest mb-3">
                          {CATEGORY_LABEL[cat] || cat}
                          <span className="font-normal mr-2 text-gray-400">({catAnswered}/{catMembers.length} ענו)</span>
                        </p>
                        <div className="space-y-2">
                          {catMembers.map(m => {
                            const st = statuses.get(m.id)!
                            return (
                              <div key={m.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
                                <span className="font-medium text-sm text-yahalom-dark min-w-[120px]">
                                  {m.firstName} {m.lastName}
                                </span>
                                <span className="flex-1">
                                  <StatusBadge status={st} />
                                </span>
                                <AdminOverrideButton
                                  eventId={event.id}
                                  memberEmail={m.email}
                                  memberName={`${m.firstName} ${m.lastName}`}
                                  currentAttending={st.attending}
                                  isAdminOverride={st.source === 'admin'}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
