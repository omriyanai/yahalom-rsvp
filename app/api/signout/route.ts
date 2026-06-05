import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = cookies()
  cookieStore.delete('yahalom_member')
  const origin = new URL(request.url).origin
  return NextResponse.redirect(new URL('/', origin))
}
