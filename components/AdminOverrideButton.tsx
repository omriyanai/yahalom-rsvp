'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  eventId: string
  memberEmail: string
  memberName: string
  currentAttending: boolean | null
  isAdminOverride: boolean
}

export default function AdminOverrideButton({
  eventId, memberEmail, memberName, currentAttending, isAdminOverride,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const set = async (attending: string) => {
    setLoading(attending)
    try {
      await fetch('/api/admin-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, memberEmail, memberName, attending }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-1.5 shrink-0">
      <button
        onClick={() => set('מגיע')}
        disabled={!!loading}
        className="text-xs px-2.5 py-1 rounded-lg font-medium transition disabled:opacity-50"
        style={
          currentAttending === true
            ? isAdminOverride
              ? { background: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.5)', color: '#4ADE80' }
              : { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC' }
            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#4B5563' }
        }
      >
        {loading === 'מגיע' ? '...' : 'מגיע ✓'}
      </button>
      <button
        onClick={() => set('לא מגיע')}
        disabled={!!loading}
        className="text-xs px-2.5 py-1 rounded-lg font-medium transition disabled:opacity-50"
        style={
          currentAttending === false
            ? isAdminOverride
              ? { background: 'rgba(196,18,48,0.25)', border: '1px solid rgba(196,18,48,0.5)', color: '#F87171' }
              : { background: 'rgba(196,18,48,0.12)', border: '1px solid rgba(196,18,48,0.3)', color: '#FCA5A5' }
            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#4B5563' }
        }
      >
        {loading === 'לא מגיע' ? '...' : 'לא מגיע ✗'}
      </button>
    </div>
  )
}
