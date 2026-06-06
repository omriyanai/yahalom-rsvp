import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import SignIn from '@/components/SignIn'
import { getEvents, getMembers, getAllRSVPs, getAdminOverrides, type Member, type Event, type RSVPRecord, type AdminOverride } from '@/lib/googleSheets'

export const dynamic = 'force-dynamic'

const norm = (s: string) => s.trim().replace(/\s+/g, ' ')

type MatchType = 'email' | 'name' | 'admin' | 'none'

interface AuditRow {
  member: Member
  rsvp: RSVPRecord | null
  matchType: MatchType
  status: string
  adminName?: string
}

function buildAudit(members: Member[], rsvps: RSVPRecord[], overrides: AdminOverride[], eventId: string): AuditRow[] {
  const eventRSVPs = rsvps.filter(r => r.eventId === eventId)

  const byEmail = new Map<string, RSVPRecord>()
  const byName  = new Map<string, RSVPRecord>()
  for (const r of eventRSVPs) {
    if (r.email) byEmail.set(norm(r.email).toLowerCase(), r)
    if (r.name)  byName.set(norm(r.name), r)
  }

  return members.map(m => {
    const emailKey = norm(m.email).toLowerCase()
    const nameKey  = norm(`${m.firstName} ${m.lastName}`)

    // Admin override wins
    const override = [...overrides].reverse().find(o =>
      o.eventId === eventId && (
        norm(o.memberEmail).toLowerCase() === emailKey ||
        norm(o.memberName) === nameKey
      )
    )
    if (override) return {
      member: m, rsvp: null, matchType: 'admin',
      status: override.attending, adminName: override.adminName,
    }

    const byEmailMatch = byEmail.get(emailKey)
    if (byEmailMatch) return { member: m, rsvp: byEmailMatch, matchType: 'email', status: byEmailMatch.attending }

    const byNameMatch = byName.get(nameKey)
    if (byNameMatch) return { member: m, rsvp: byNameMatch, matchType: 'name', status: byNameMatch.attending }

    return { member: m, rsvp: null, matchType: 'none', status: '' }
  })
}

function statusLabel(attending: string) {
  if (!attending) return { label: 'טרם ענה', cls: 'bg-gray-100 text-gray-500' }
  if (attending.includes('לא מגיע')) return { label: 'לא מגיע ✗', cls: 'bg-red-100 text-red-600' }
  if (attending.includes('מגיע'))    return { label: 'מגיע ✓',    cls: 'bg-green-100 text-green-700' }
  return { label: attending, cls: 'bg-gray-100 text-gray-500' }
}

export default async function AuditPage() {
  const cookieStore = cookies()
  const memberCookie = cookieStore.get('yahalom_member')
  if (!memberCookie) return <SignIn />

  let member: Member
  try { member = JSON.parse(memberCookie.value) }
  catch { return <SignIn /> }

  if (!member.category) { cookieStore.delete('yahalom_member'); return <SignIn /> }
  if (member.category !== 'צוות') redirect('/')

  const [events, members, rsvps, overrides] = await Promise.all([
    getEvents(), getMembers(), getAllRSVPs(), getAdminOverrides(),
  ])

  // Also find RSVPs that don't match ANY member (orphaned)
  const orphaned = rsvps.filter(r => {
    const emailKey = norm(r.email).toLowerCase()
    const nameKey  = norm(r.name)
    return !members.some(m =>
      norm(m.email).toLowerCase() === emailKey ||
      norm(`${m.firstName} ${m.lastName}`) === nameKey
    )
  })

  return (
    <main className="min-h-screen bg-gray-100">
      <Header member={member} />
      <div className="max-w-4xl mx-auto px-4 py-10">

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-yahalom-dark">בדיקת נתונים</h2>
          <Link href="/admin" className="text-sm text-yahalom-red hover:underline font-medium">← חזרה לרשימות</Link>
        </div>
        <p className="text-sm text-gray-400 mb-8">
          בדיקת התאמה בין אישורי הגעה לחברי המערכת — מאפשר זיהוי אי-התאמות
        </p>

        {/* Legend */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-green-400 inline-block"/> התאמה לפי אימייל</span>
          <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"/> התאמה לפי שם בלבד ⚠️</span>
          <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"/> אושר ע"י מנהל 👤</span>
          <span className="flex items-center gap-1.5 text-xs"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"/> לא אותר אישור</span>
        </div>

        {events.map(event => {
          const rows = buildAudit(members, rsvps, overrides, event.id)
          const warnings = rows.filter(r => r.matchType === 'name').length
          const missing  = rows.filter(r => r.matchType === 'none').length

          return (
            <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-8">
              <div className="h-1.5 bg-yahalom-red" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-yahalom-dark text-lg">{event.name}</h3>
                  <div className="flex gap-2">
                    {warnings > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                        ⚠️ {warnings} התאמה לפי שם
                      </span>
                    )}
                    {missing > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                        ✗ {missing} ללא אישור
                      </span>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs text-gray-400 text-right">
                        <th className="pb-2 font-medium">שם</th>
                        <th className="pb-2 font-medium">קטגוריה</th>
                        <th className="pb-2 font-medium">אימייל במערכת</th>
                        <th className="pb-2 font-medium">אימייל ב-RSVP</th>
                        <th className="pb-2 font-medium">התאמה</th>
                        <th className="pb-2 font-medium">סטטוס</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(row => {
                        const { label, cls } = statusLabel(row.status)
                        const emailMismatch = row.matchType === 'name' &&
                          row.rsvp?.email &&
                          norm(row.rsvp.email).toLowerCase() !== norm(row.member.email).toLowerCase()

                        return (
                          <tr key={row.member.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-2 font-medium text-yahalom-dark">
                              {row.member.firstName} {row.member.lastName}
                            </td>
                            <td className="py-2 text-gray-500">{row.member.category}</td>
                            <td className="py-2 text-gray-400 text-xs" dir="ltr">{row.member.email}</td>
                            <td className={`py-2 text-xs ${emailMismatch ? 'text-yellow-600 font-medium' : 'text-gray-400'}`} dir="ltr">
                              {row.rsvp?.email || '—'}
                              {emailMismatch && ' ⚠️'}
                            </td>
                            <td className="py-2">
                              {row.matchType === 'email' && <span className="text-xs text-green-600 font-medium">✓ אימייל</span>}
                              {row.matchType === 'name'  && <span className="text-xs text-yellow-600 font-medium">⚠ שם</span>}
                              {row.matchType === 'admin' && <span className="text-xs text-blue-600 font-medium">👤 {row.adminName}</span>}
                              {row.matchType === 'none'  && <span className="text-xs text-red-400">—</span>}
                            </td>
                            <td className="py-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        })}

        {/* Orphaned RSVPs — in sheet but not matched to any member */}
        {orphaned.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-4">
            <h3 className="font-bold text-orange-700 mb-3">
              אישורים שלא הותאמו לאף חבר ({orphaned.length})
            </h3>
            <p className="text-xs text-orange-500 mb-3">
              אנשים שמילאו אישור אך לא נמצאים ברשימת החברים — בדוק אם יש שגיאת כתיב באימייל או שם
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-orange-400 text-right border-b border-orange-200">
                  <th className="pb-2 font-medium">שם שהוזן</th>
                  <th className="pb-2 font-medium">אימייל שהוזן</th>
                  <th className="pb-2 font-medium">אירוע</th>
                  <th className="pb-2 font-medium">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {orphaned.map((r, i) => (
                  <tr key={i} className="border-b border-orange-100 last:border-0">
                    <td className="py-2 font-medium text-orange-800">{r.name}</td>
                    <td className="py-2 text-orange-600 text-xs" dir="ltr">{r.email}</td>
                    <td className="py-2 text-orange-500 text-xs">{r.eventId}</td>
                    <td className="py-2">
                      <span className="text-xs">{r.attending}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  )
}
