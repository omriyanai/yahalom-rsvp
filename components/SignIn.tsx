'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'שגיאה בהתחברות')
      } else {
        window.location.reload()
      }
    } catch {
      setError('שגיאה בהתחברות. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/Logo.jpg"
            alt="עמותת יהלום"
            width={180}
            height={79}
            style={{ height: 'auto', width: 'auto' }}
            priority
          />
          <p className="text-yahalom-gray text-sm mt-3 font-medium">תוכנית מנטורינג</p>
        </div>

        <h1 className="text-xl font-bold text-yahalom-dark text-center mb-1">ברוכים הבאים</h1>
        <p className="text-gray-400 text-sm text-center mb-6">הזינו את כתובת האימייל שלכם</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yahalom-red transition text-left"
            placeholder="your@email.com"
            dir="ltr"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-yahalom-red text-white py-3 rounded-xl font-bold text-lg hover:bg-red-800 transition disabled:opacity-50 shadow-sm"
          >
            {loading ? 'מחפש...' : 'כניסה'}
          </button>
        </form>
      </div>

      <p className="text-gray-400 text-xs mt-6 text-center">
        רק מוזמנים רשומים יכולים להיכנס למערכת
      </p>
    </div>
  )
}
