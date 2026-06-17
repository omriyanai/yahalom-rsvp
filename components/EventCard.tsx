'use client'

import { useState } from 'react'
import { CalendarDays, Clock, MapPin, MessageSquare, CalendarPlus, CalendarRange, Navigation2, Check, X } from 'lucide-react'
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

export default function EventCard({ event, member, isFirst, initialAttending }: { event: Event; member: Member; isFirst?: boolean; initialAttending?: 'yes' | 'no' | null }) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(initialAttending != null)
  const [attending, setAttending] = useState<'yes' | 'no' | null>(initialAttending ?? null)
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
    <div
      id={isFirst ? 'tour-event-card' : undefined}
      className="relative rounded-2xl overflow-hidden liquid-glass"
    >
      {/* Top gradient accent line */}
      <div
        className="h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(196,18,48,0.8) 30%, #C41230 50%, rgba(196,18,48,0.8) 70%, transparent 100%)' }}
      />

      {/* ── Tactical corner brackets ── */}
      <svg className="absolute top-0 left-0 w-9 h-9 pointer-events-none" viewBox="0 0 44 44" fill="none">
        <path d="M3 22 L3 3 L22 3" stroke="rgba(196,18,48,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <svg className="absolute top-0 right-0 w-9 h-9 pointer-events-none" viewBox="0 0 44 44" fill="none">
        <path d="M41 22 L41 3 L22 3" stroke="rgba(196,18,48,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <svg className="absolute bottom-0 left-0 w-9 h-9 pointer-events-none" viewBox="0 0 44 44" fill="none">
        <path d="M3 22 L3 41 L22 41" stroke="rgba(196,18,48,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <svg className="absolute bottom-0 right-0 w-9 h-9 pointer-events-none" viewBox="0 0 44 44" fill="none">
        <path d="M41 22 L41 41 L22 41" stroke="rgba(196,18,48,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div className="p-6">
        {/* Event title */}
        <h3 className="text-xl font-bold mb-4 leading-snug" style={{ color: '#F9FAFB' }}>
          {event.name}
        </h3>

        {/* Event details */}
        <div className="space-y-2.5 mb-6 text-[15px]" style={{ color: '#9CA3AF' }}>
          <div className="flex items-center gap-3">
            <CalendarDays size={16} className="flex-shrink-0" style={{ color: '#C41230' }} />
            <span className="font-medium">{formatHebrewDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="flex-shrink-0" style={{ color: '#C41230' }} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="flex-shrink-0" style={{ color: '#C41230' }} />
            <span>{event.location}</span>
          </div>
          {event.description && (
            <div className="flex items-start gap-3 mt-1">
              <MessageSquare size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(196,18,48,0.55)' }} />
              <span className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{event.description}</span>
            </div>
          )}
        </div>

        {/* Navigation & calendar buttons */}
        <div className="flex flex-wrap gap-2.5 mb-5">
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-80"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border:     '1px solid rgba(0,212,255,0.3)',
              color:      '#00D4FF',
            }}
          >
            <Navigation2 size={14} />
            ניווט ב-Waze
          </a>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-80"
            style={{
              background: 'rgba(66,133,244,0.1)',
              border:     '1px solid rgba(66,133,244,0.3)',
              color:      '#6BA3F5',
            }}
          >
            <CalendarPlus size={14} />
            Google Calendar
          </a>
          <a
            href={outlookCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:opacity-80"
            style={{
              background: 'rgba(0,120,212,0.1)',
              border:     '1px solid rgba(0,120,212,0.3)',
              color:      '#5BA3E0',
            }}
          >
            <CalendarRange size={14} />
            Outlook
          </a>
        </div>

        {/* RSVP section */}
        {submitted ? (
          <div
            className="rounded-xl p-5 text-center"
            style={{
              background: attending === 'yes' ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
              border:     `1px solid ${attending === 'yes' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <p className="font-bold text-xl flex items-center justify-center gap-2" style={{ color: attending === 'yes' ? '#4ADE80' : '#6B7280' }}>
              {attending === 'yes'
                ? <><Check size={22} strokeWidth={2.5} /> תודה! נתראה בקרוב</>
                : <><X size={20} strokeWidth={2} /> הרשמנו שלא תגיע. תודה על העדכון</>}
            </p>
          </div>
        ) : !showForm ? (
          <button
            id={isFirst ? 'tour-rsvp-btn' : undefined}
            onClick={() => setShowForm(true)}
            className="relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-white text-lg transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, #C41230 0%, #8B0D22 100%)',
              boxShadow:  '0 0 32px rgba(196,18,48,0.3), 0 4px 16px rgba(196,18,48,0.2)',
            }}
          >
            {/* Shimmer on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.13) 50%, transparent 100%)',
                animation:  'shimmer-slide 1.8s ease infinite',
              }}
            />
            <span className="relative">אישור הגעה לאירוע</span>
          </button>
        ) : (
          <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm text-center mb-3" style={{ color: '#6B7280' }}>האם תגיע?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleQuickRSVP('yes')}
                disabled={loading}
                className="flex-1 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
                style={{
                  background: 'rgba(34,197,94,0.12)',
                  border:     '1px solid rgba(34,197,94,0.35)',
                  color:      '#4ADE80',
                }}
              >
                {loading && attending === 'yes' ? '...' : <span className="flex items-center justify-center gap-2"><Check size={18} strokeWidth={2.5} /> כן, מגיע</span>}
              </button>
              <button
                onClick={() => handleQuickRSVP('no')}
                disabled={loading}
                className="flex-1 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border:     '1px solid rgba(255,255,255,0.1)',
                  color:      '#9CA3AF',
                }}
              >
                {loading && attending === 'no' ? '...' : <span className="flex items-center justify-center gap-2"><X size={18} strokeWidth={2} /> לא מגיע</span>}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
