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
  const [nameFocused, setNameFocused]   = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

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

  const inputStyle = (focused: boolean) => ({
    background:  focused ? 'rgba(196,18,48,0.06)' : 'rgba(255,255,255,0.04)',
    border:      focused ? '1px solid rgba(196,18,48,0.5)' : '1px solid rgba(255,255,255,0.09)',
    boxShadow:   focused ? '0 0 0 3px rgba(196,18,48,0.10)' : 'none',
    color:       '#F9FAFB',
    caretColor:  '#C41230',
    borderRadius:'0.75rem',
    padding:     '10px 16px',
    width:       '100%',
    outline:     'none',
    fontSize:    '0.9rem',
    transition:  'all 0.25s',
  } as React.CSSProperties)

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-4 pt-5"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* שם מלא */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>שם מלא</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          style={inputStyle(nameFocused)}
          className="placeholder-gray-600"
          placeholder="ישראל ישראלי"
        />
      </div>

      {/* אימייל */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#9CA3AF' }}>אימייל</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={{ ...inputStyle(emailFocused), direction: 'ltr', textAlign: 'left' }}
          className="placeholder-gray-600"
          placeholder="israel@example.com"
        />
      </div>

      {/* האם תגיע */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#9CA3AF' }}>האם תגיע לאירוע?</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAttending('yes')}
            className="flex-1 py-3 rounded-xl font-bold text-base transition"
            style={
              attending === 'yes'
                ? { background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.5)', color: '#4ADE80' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#6B7280' }
            }
          >
            כן, מגיע ✓
          </button>
          <button
            type="button"
            onClick={() => setAttending('no')}
            className="flex-1 py-3 rounded-xl font-bold text-base transition"
            style={
              attending === 'no'
                ? { background: 'rgba(196,18,48,0.18)', border: '1px solid rgba(196,18,48,0.45)', color: '#F87171' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#6B7280' }
            }
          >
            לא מגיע ✗
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-[11px]"
          style={{ background: 'rgba(196,18,48,0.09)', border: '1px solid rgba(196,18,48,0.28)' }}
        >
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#F87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium" style={{ color: '#F87171' }}>{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="relative flex-1 overflow-hidden rounded-xl py-3 font-bold text-base text-white transition-all duration-300 group disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #C41230 0%, #8B0D22 100%)',
            boxShadow:  '0 0 28px rgba(196,18,48,0.3), 0 4px 14px rgba(196,18,48,0.2)',
            cursor:     loading ? 'not-allowed' : 'pointer',
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)', animation: 'shimmer-slide 1.8s ease infinite' }} />
          <span className="relative">{loading ? 'שולח...' : 'שלח אישור'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-xl font-medium transition"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border:     '1px solid rgba(255,255,255,0.09)',
            color:      '#6B7280',
          }}
        >
          ביטול
        </button>
      </div>
    </form>
  )
}
