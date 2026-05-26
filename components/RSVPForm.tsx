'use client'

import { useState } from 'react'

interface RSVPFormProps {
  eventId: string
  eventName: string
  onSuccess: () => void
  onCancel: () => void
}

export default function RSVPForm({ eventId, eventName, onSuccess, onCancel }: RSVPFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !attending) {
      setError('נא למלא את כל השדות')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, eventName, name, email, attending }),
      })
      if (!res.ok) throw new Error()
      onSuccess()
    } catch {
      setError('אירעה שגיאה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 pt-5 space-y-4 mt-2">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">שם מלא</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:ring-2 focus:ring-yahalom-red transition"
          placeholder="ישראל ישראלי"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">אימייל</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yahalom-red transition"
          placeholder="israel@example.com"
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">האם תגיע לאירוע?</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAttending('yes')}
            className={`flex-1 py-3 rounded-xl font-bold text-base border-2 transition ${
              attending === 'yes'
                ? 'bg-green-500 border-green-500 text-white shadow-sm'
                : 'border-gray-200 text-gray-600 hover:border-green-400 hover:bg-green-50'
            }`}
          >
            כן, מגיע ✓
          </button>
          <button
            type="button"
            onClick={() => setAttending('no')}
            className={`flex-1 py-3 rounded-xl font-bold text-base border-2 transition ${
              attending === 'no'
                ? 'bg-red-400 border-red-400 text-white shadow-sm'
                : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            לא מגיע ✗
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-yahalom-red text-white py-3 rounded-xl font-bold text-base hover:bg-red-800 transition disabled:opacity-50 shadow-sm"
        >
          {loading ? 'שולח...' : 'שלח אישור'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition font-medium"
        >
          ביטול
        </button>
      </div>
    </form>
  )
}
