import Image from 'next/image'
import { Hand } from 'lucide-react'
import type { Member } from '@/lib/googleSheets'

export default function Header({ member, showAdminLink }: { member?: Member; showAdminLink?: boolean }) {
  return (
    <header
      style={{
        background:           'rgba(9, 11, 20, 0.88)',
        backdropFilter:       'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom:         '1px solid rgba(196,18,48,0.35)',
        boxShadow:            '0 4px 32px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(196,18,48,0.15)',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col items-center gap-0">

        {/* Logo — transparent PNG floats on dark */}
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(196,18,48,0.18), transparent 70%)',
              filter:     'blur(20px)',
              transform:  'scale(2.2)',
            }}
          />
          <Image
            src="/logo2.png"
            alt="עמותת יהל״ם"
            width={280}
            height={120}
            style={{
              height:   'auto',
              width:    '260px',
              position: 'relative',
              filter:   'drop-shadow(0 2px 14px rgba(196,18,48,0.5)) drop-shadow(0 1px 4px rgba(0,0,0,0.9))',
            }}
            priority
          />
        </div>

        {/* Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-px w-10 flex-shrink-0" style={{ background: 'linear-gradient(to right, transparent, rgba(196,18,48,0.6))' }} />
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase select-none" style={{ color: 'rgba(196,18,48,0.75)' }}>
            תוכנית מנטורינג
          </p>
          <div className="h-px w-10 flex-shrink-0" style={{ background: 'linear-gradient(to left, transparent, rgba(196,18,48,0.6))' }} />
        </div>

        {/* Member info */}
        {member && (
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: '#E5E7EB' }}>
              שלום, {member.firstName} {member.lastName}
              <Hand size={15} style={{ color: '#C41230' }} strokeWidth={1.8} />
            </span>
            {member.category === 'צוות' && showAdminLink && (
              <a
                href="/admin"
                className="transition hover:underline"
                style={{ color: '#C41230', fontSize: '0.75rem', fontWeight: 600 }}
              >
                רשימות נוכחות
              </a>
            )}
            <a
              href="/api/signout"
              className="signout-link underline transition"
              style={{ fontSize: '0.75rem' }}
            >
              התנתקות
            </a>
          </div>
        )}
      </div>
    </header>
  )
}
