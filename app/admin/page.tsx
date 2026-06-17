import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
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

  const eventRSVPs = rsvps.filter(r => r.eventId.trim() === eventId.trim())
  const memberName = norm(`${member.firstName} ${member.lastName}`)
  const memberEmail = norm(member.email).toLowerCase()

  // Use last RSVP per person (sheet is chronological, last = most recent)
  const byEmail = [...eventRSVPs].reverse().find(r => norm(r.email).toLowerCase() === memberEmail)
  if (byEmail) return {
    attending: byEmail.attending.includes('מגיע') && !byEmail.attending.includes('לא'),
    source: 'email',
  }

  const byName = [...eventRSVPs].reverse().find(r => norm(r.name) === memberName)
  if (byName) return {
    attending: byName.attending.includes('מגיע') && !byName.attending.includes('לא'),
    source: 'name',
  }

  return { attending: null, source: 'none' }
}

function StatusBadge({ status }: { status: MemberStatus }) {
  if (status.attending === null) {
    return <span className="text-xs" style={{ color: '#4B5563' }}>טרם ענה ⏳</span>
  }
  if (status.attending) {
    return (
      <span className="text-xs font-medium" style={{ color: '#4ADE80' }}>
        ✓ מגיע
        {status.source === 'admin' && (
          <span className="mr-1 font-normal" style={{ color: '#86EFAC' }}>(ע&quot;י {status.adminName} 👤)</span>
        )}
      </span>
    )
  }
  return (
    <span className="text-xs font-medium" style={{ color: '#F87171' }}>
      ✗ לא מגיע
      {status.source === 'admin' && (
        <span className="mr-1 font-normal" style={{ color: '#FCA5A5' }}>(ע&quot;י {status.adminName} 👤)</span>
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
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <div className="relative" style={{ zIndex: 2 }}>
      <Header member={admin} />
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ background: '#C41230' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#F9FAFB' }}>סטטוס אישורי הגעה</h2>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/audit"
              className="text-sm font-medium transition hover:opacity-80"
              style={{ color: '#D4A017' }}
            >
              🔍 בדיקת נתונים
            </Link>
            <Link
              href="/"
              className="text-sm font-medium transition hover:opacity-80"
              style={{ color: '#C41230' }}
            >
              → חזרה לאירועים
            </Link>
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
              <div
                key={event.id}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background:           'rgba(9,11,20,0.84)',
                  backdropFilter:       'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border:               '1px solid rgba(255,255,255,0.07)',
                  boxShadow:            '0 0 50px rgba(196,18,48,0.07), 0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                {/* Top accent line */}
                <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,18,48,0.8) 30%, #C41230 50%, rgba(196,18,48,0.8) 70%, transparent 100%)' }} />

                {/* Corner brackets */}
                <svg className="absolute top-0 left-0 w-8 h-8 pointer-events-none" viewBox="0 0 44 44" fill="none">
                  <path d="M3 22 L3 3 L22 3" stroke="rgba(196,18,48,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="absolute top-0 right-0 w-8 h-8 pointer-events-none" viewBox="0 0 44 44" fill="none">
                  <path d="M41 22 L41 3 L22 3" stroke="rgba(196,18,48,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none" viewBox="0 0 44 44" fill="none">
                  <path d="M3 22 L3 41 L22 41" stroke="rgba(196,18,48,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none" viewBox="0 0 44 44" fill="none">
                  <path d="M41 22 L41 41 L22 41" stroke="rgba(196,18,48,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#F9FAFB' }}>{event.name}</h3>
                      <p className="text-sm" style={{ color: '#4B5563' }}>{formatHebrewDate(event.date)} | {event.time}</p>
                    </div>
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#6B7280' }}
                    >
                      {totalAnswered}/{invitedMembers.length} ענו
                    </span>
                  </div>

                  {invitedCats.map(cat => {
                    const catMembers = invitedMembers.filter(m => m.category === cat)
                    if (catMembers.length === 0) return null
                    const catAnswered = catMembers.filter(m => statuses.get(m.id)?.attending !== null).length

                    return (
                      <div key={cat} className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
                          {CATEGORY_LABEL[cat] || cat}
                          <span className="font-normal mr-2" style={{ color: '#374151' }}>({catAnswered}/{catMembers.length} ענו)</span>
                        </p>
                        <div className="space-y-2">
                          {catMembers.map(m => {
                            const st = statuses.get(m.id)!
                            return (
                              <div
                                key={m.id}
                                className="flex items-center justify-between gap-3 py-1.5 last:border-0"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                              >
                                <span className="font-medium text-sm min-w-[120px]" style={{ color: '#E5E7EB' }}>
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
      </div>
    </main>
  )
}
