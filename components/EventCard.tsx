'use client'

import { useState } from 'react'
import RSVPForm from './RSVPForm'
import type { Event } from '@/lib/googleSheets'

function buildCalendarUrl(event: Event): string {
  const dateClean = event.date.replace(/-/g, '')
  const [h, m] = event.time.split(':')
  const endHour = String(parseInt(h) + 2).padStart(2, '0')
  const start = `${dateClean}T${h}${m}00`
  const end = `${dateClean}T${endHour}${m}00`
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.name)}` +
    `&dates=${start}/${end}` +
    `&location=${encodeURIComponent(event.address || event.location)}` +
    `&details=${encodeURIComponent(event.description)}` +
    `&ctz=Asia%2FJerusalem`
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

export default function EventCard({ event }: { event: Event }) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(event.address || event.location)}&navigate=yes`
  const calendarUrl = buildCalendarUrl(event)

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
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm"
          >
            📆 הוסף ליומן
          </a>
        </div>

        {submitted ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center">
            <p className="text-green-700 font-bold text-xl">✓ תודה! נתראה בקרוב</p>
          </div>
        ) : (
          <>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-yahalom-red text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-800 transition shadow-sm"
              >
                אישור הגעה לאירוע
              </button>
            ) : (
              <RSVPForm
                eventId={event.id}
                eventName={event.name}
                onSuccess={() => setSubmitted(true)}
                onCancel={() => setShowForm(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
