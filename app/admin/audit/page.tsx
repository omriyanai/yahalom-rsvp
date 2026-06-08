import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import SignIn from '@/components/SignIn'
import DiamondPhotoBackground from '@/components/DiamondPhotoBackground'
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

function statusLabel(attending: string): { label: string; color: string; bg: string; border: string } {
  if (!attending)                       return { label: 'טרם ענה',   color: '#4B5563', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' }
  if (attending.includes('לא מגיע'))    return { label: 'לא מגיע ✗', color: '#F87171', bg: 'rgba(196,18,48,0.1)',   border: 'rgba(196,18,48,0.25)'   }
  if (attending.includes('מגיע'))       return { label: 'מגיע ✓',    color: '#4ADE80', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)'   }
  return                                       { label: attending,   color: '#6B7280', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' }
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

  const orphaned = rsvps.filter(r => {
    const emailKey = norm(r.email).toLowerCase()
    const nameKey  = norm(r.name)
    return !members.some(m =>
      norm(m.email).toLowerCase() === emailKey ||
      norm(`${m.firstName} ${m.lastName}`) === nameKey
    )
  })

  return (
    <main className="min-h-screen">
      <DiamondPhotoBackground />
      <div className="relative" style={{ zIndex: 2 }}>
      <Header member={member} />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ background: '#D4A017' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#F9FAFB' }}>בדיקת נתונים</h2>
          </div>
          <Link href="/admin" className="text-sm font-medium transition hover:opacity-80" style={{ color: '#C41230' }}>
            → חזרה לרשימות
          </Link>
        </div>
        <p className="text-sm mb-8 mr-4" style={{ color: '#4B5563' }}>
          בדיקת התאמה בין אישורי הגעה לחברי המערכת — מאפשר זיהוי אי-התאמות
        </p>

        {/* Legend */}
        <div className="flex gap-5 mb-6 flex-wrap">
          {[
            { color: '#4ADE80', label: 'התאמה לפי אימייל' },
            { color: '#FACC15', label: 'התאמה לפי שם בלבד ⚠️' },
            { color: '#60A5FA', label: 'אושר ע"י מנהל 👤' },
            { color: '#F87171', label: 'לא אותר אישור' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs" style={{ color: '#6B7280' }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>

        {events.map(event => {
          const rows = buildAudit(members, rsvps, overrides, event.id)
          const warnings = rows.filter(r => r.matchType === 'name').length
          const missing  = rows.filter(r => r.matchType === 'none').length

          return (
            <div
              key={event.id}
              className="relative rounded-2xl overflow-hidden mb-8"
              style={{
                background:           'rgba(9,11,20,0.84)',
                backdropFilter:       'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border:               '1px solid rgba(255,255,255,0.07)',
                boxShadow:            '0 0 50px rgba(196,18,48,0.07), 0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Top accent */}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg" style={{ color: '#F9FAFB' }}>{event.name}</h3>
                  <div className="flex gap-2">
                    {warnings > 0 && (
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)', color: '#FACC15' }}
                      >
                        ⚠️ {warnings} התאמה לפי שם
                      </span>
                    )}
                    {missing > 0 && (
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(196,18,48,0.1)', border: '1px solid rgba(196,18,48,0.3)', color: '#F87171' }}
                      >
                        ✗ {missing} ללא אישור
                      </span>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="text-xs text-right"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', color: '#4B5563' }}
                      >
                        {['שם', 'קטגוריה', 'אימייל במערכת', 'אימייל ב-RSVP', 'התאמה', 'סטטוס'].map(h => (
                          <th key={h} className="pb-2 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(row => {
                        const { label, color, bg, border } = statusLabel(row.status)
                        const emailMismatch = row.matchType === 'name' &&
                          row.rsvp?.email &&
                          norm(row.rsvp.email).toLowerCase() !== norm(row.member.email).toLowerCase()

                        return (
                          <tr key={row.member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td className="py-2 font-medium" style={{ color: '#E5E7EB' }}>
                              {row.member.firstName} {row.member.lastName}
                            </td>
                            <td className="py-2" style={{ color: '#6B7280' }}>{row.member.category}</td>
                            <td className="py-2 text-xs" dir="ltr" style={{ color: '#4B5563' }}>{row.member.email}</td>
                            <td
                              className="py-2 text-xs"
                              dir="ltr"
                              style={{ color: emailMismatch ? '#FACC15' : '#4B5563', fontWeight: emailMismatch ? 600 : 400 }}
                            >
                              {row.rsvp?.email || '—'}
                              {emailMismatch && ' ⚠️'}
                            </td>
                            <td className="py-2">
                              {row.matchType === 'email' && <span className="text-xs font-medium" style={{ color: '#4ADE80' }}>✓ אימייל</span>}
                              {row.matchType === 'name'  && <span className="text-xs font-medium" style={{ color: '#FACC15' }}>⚠ שם</span>}
                              {row.matchType === 'admin' && <span className="text-xs font-medium" style={{ color: '#60A5FA' }}>👤 {row.adminName}</span>}
                              {row.matchType === 'none'  && <span className="text-xs" style={{ color: '#374151' }}>—</span>}
                            </td>
                            <td className="py-2">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ color, background: bg, border: `1px solid ${border}` }}
                              >
                                {label}
                              </span>
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

        {/* Orphaned RSVPs */}
        {orphaned.length > 0 && (
          <div
            className="relative rounded-2xl overflow-hidden mt-4"
            style={{
              background:           'rgba(9,11,20,0.84)',
              backdropFilter:       'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border:               '1px solid rgba(234,179,8,0.2)',
              boxShadow:            '0 0 40px rgba(234,179,8,0.05), 0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(234,179,8,0.6) 30%, #FACC15 50%, rgba(234,179,8,0.6) 70%, transparent 100%)' }} />
            <div className="p-6">
              <h3 className="font-bold mb-1" style={{ color: '#FACC15' }}>
                אישורים שלא הותאמו לאף חבר ({orphaned.length})
              </h3>
              <p className="text-xs mb-4" style={{ color: '#78716C' }}>
                אנשים שמילאו אישור אך לא נמצאים ברשימת החברים — בדוק אם יש שגיאת כתיב באימייל או שם
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-right" style={{ borderBottom: '1px solid rgba(234,179,8,0.15)', color: '#78716C' }}>
                    {['שם שהוזן', 'אימייל שהוזן', 'אירוע', 'סטטוס'].map(h => (
                      <th key={h} className="pb-2 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orphaned.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(234,179,8,0.08)' }}>
                      <td className="py-2 font-medium" style={{ color: '#E5E7EB' }}>{r.name}</td>
                      <td className="py-2 text-xs" dir="ltr" style={{ color: '#FACC15' }}>{r.email}</td>
                      <td className="py-2 text-xs" style={{ color: '#6B7280' }}>{r.eventId}</td>
                      <td className="py-2 text-xs" style={{ color: '#9CA3AF' }}>{r.attending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
      </div>{/* /z-index wrapper */}
    </main>
  )
}
