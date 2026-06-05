import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getMemberByEmail } from '@/lib/googleSheets'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'חסר אימייל' }, { status: 400 })

    const member = await getMemberByEmail(email.trim())
    if (!member) {
      return NextResponse.json({ error: 'כתובת האימייל לא נמצאת ברשימה' }, { status: 404 })
    }

    const cookieStore = cookies()
    cookieStore.set('yahalom_member', JSON.stringify(member), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'שגיאה בהתחברות' }, { status: 500 })
  }
}
