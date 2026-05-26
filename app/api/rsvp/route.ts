import { NextResponse } from 'next/server'
import { addRSVP } from '@/lib/googleSheets'

export async function POST(request: Request) {
  try {
    const { eventId, eventName, name, email, attending } = await request.json()

    if (!eventId || !name || !email || !attending) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await addRSVP({ eventId, eventName, name, email, attending })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
