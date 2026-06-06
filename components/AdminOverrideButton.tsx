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
        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition disabled:opacity-50 ${
          currentAttending === true
            ? isAdminOverride
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-700'
        }`}
      >
        {loading === 'מגיע' ? '...' : 'מגיע ✓'}
      </button>
      <button
        onClick={() => set('לא מגיע')}
        disabled={!!loading}
        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition disabled:opacity-50 ${
          currentAttending === false
            ? isAdminOverride
              ? 'bg-red-400 text-white shadow-sm'
              : 'bg-red-100 text-red-600'
            : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
        }`}
      >
        {loading === 'לא מגיע' ? '...' : 'לא מגיע ✗'}
      </button>
    </div>
  )
}
