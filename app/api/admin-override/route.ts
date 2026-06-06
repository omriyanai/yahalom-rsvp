import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { addAdminOverride } from '@/lib/googleSheets'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const memberCookie = cookieStore.get('yahalom_member')
    if (!memberCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = JSON.parse(memberCookie.value)
    if (admin.category !== 'צוות') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { eventId, memberEmail, memberName, attending } = await request.json()
    if (!eventId || !memberName || !attending) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await addAdminOverride({
      eventId,
      memberEmail: memberEmail || '',
      memberName,
      attending,
      adminName: `${admin.firstName} ${admin.lastName}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin override error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
