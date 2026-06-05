'use client'

import { useState } from 'react'
import RSVPForm from './RSVPForm'
import type { Event, Member } from '@/lib/googleSheets'

function getEndTime(event: Event): { compact: string; iso: string } {
  const [h, m] = event.time.split(':')
  if (event.endtime && event.endtime.includes(':')) {
    const [eh, em] = event.endtime.split(':')
    return {
      compact: `${event.date.replace(/-/g, '')}T${eh}${em}00`,
      iso: `${event.date}T${eh}:${em}:00`,
    }
  }
  const endHour = String(parseInt(h) + 2).padStart(2, '0')
  return {
    compact: `${event.date.replace(/-/g, '')}T${endHour}${m}00`,
    iso: `${event.date}T${endHour}:${m}:00`,
  }
}

function buildGoogleCalendarUrl(event: Event): string {
  const dateClean = event.date.replace(/-/g, '')
  const [h, m] = event.time.split(':')
  const start = `${dateClean}T${h}${m}00`
  const { compact: end } = getEndTime(event)
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.name)}` +
    `&dates=${start}/${end}` +
    `&location=${encodeURIComponent(event.address || event.location)}` +
    `&details=${encodeURIComponent(event.description)}` +
    `&ctz=Asia%2FJerusalem`
  )
}

function buildOutlookCalendarUrl(event: Event): string {
  const [h, m] = event.time.split(':')
  const startIso = `${event.date}T${h}:${m}:00`
  const { iso: endIso } = getEndTime(event)
  return (
    `https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent` +
    `&subject=${encodeURIComponent(event.name)}` +
    `&startdt=${encodeURIComponent(startIso)}` +
    `&enddt=${encodeURIComponent(endIso)}` +
    `&location=${encodeURIComponent(event.address || event.location)}` +
    `&body=${encodeURIComponent(event.description)}`
  )
}

function formatHebrewDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function EventCard({ event, member }: { event: Event; member: Member }) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [loading, setLoading] = useState(false)

  const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(event.address || event.location)}&navigate=yes`
  const googleCalendarUrl = buildGoogleCalendarUrl(event)
  const outlookCalendarUrl = buildOutlookCalendarUrl(event)

  const handleQuickRSVP = async (choice: 'yes' | 'no') => {
    setLoading(true)
    setAttending(choice)
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.name,
          name: `${member.firstName} ${member.lastName}`,
          email: member.email,
          attending: choice,
        }),
      })
      setSubmitted(true)
    } catch {
      setAttending(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="h-1.5 bg-yahalom-red" />

      <div className="p-6">
        <h3 className="text-xl font-bold text-yahalom-dark mb-4 leading-snug">
          {event.name}
        </h3>

        <div className="space-y-2.5 mb-6 text-gray-600 text-[15px]">
          <div className="flex items-center gap-3">
            <span className="text-yahalom-red text-lg">📅</span>
            <span className="font-medium">{formatHebrewDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yahalom-red text-lg">🕐</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yahalom-red text-lg">📍</span>
            <span>{event.location}</span>
          </div>
          {event.description && (
            <div className="flex items-start gap-3 mt-1">
              <span className="text-yahalom-red text-lg mt-0.5">💬</span>
              <span className="text-sm text-gray-500 leading-relaxed">{event.description}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 mb-5">
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#00D4FF] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="22" rx="18" ry="17" fill="white" fillOpacity="0.3"/>
              <path d="M24 5C14.06 5 6 12.61 6 22c0 6.09 3.31 11.43 8.28 14.48L13 43l6.5-2.5C21 41 22.49 41.2 24 41.2c9.94 0 18-7.61 18-17.2S33.94 5 24 5z" fill="white" fillOpacity="0.9"/>
            </svg>
            ניווט ב-Waze
          </a>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
          >
            📆 Google Calendar
          </a>
          <a
            href={outlookCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0078D4] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
          >
            📅 Outlook
          </a>
        </div>

        {submitted ? (
          <div className={`border-2 rounded-xl p-5 text-center ${attending === 'yes' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`font-bold text-xl ${attending === 'yes' ? 'text-green-700' : 'text-gray-500'}`}>
              {attending === 'yes' ? '✓ תודה! נתראה בקרוב 🎉' : 'הרשמנו שלא תגיע. תודה על העדכון'}
            </p>
          </div>
        ) : !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-yahalom-red text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-800 transition shadow-sm"
          >
            אישור הגעה לאירוע
          </button>
        ) : (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500 text-center mb-3">האם תגיע?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleQuickRSVP('yes')}
                disabled={loading}
                className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition disabled:opacity-50 shadow-sm"
              >
                {loading && attending === 'yes' ? '...' : 'כן, מגיע ✓'}
              </button>
              <button
                onClick={() => handleQuickRSVP('no')}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition disabled:opacity-50 shadow-sm"
              >
                {loading && attending === 'no' ? '...' : 'לא מגיע ✗'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
