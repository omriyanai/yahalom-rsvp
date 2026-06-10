import { cookies } from 'next/headers'
import type { Member } from './googleSheets'

export function getMemberFromCookie(): Member | null {
  try {
    const memberCookie = cookies().get('yahalom_member')
    if (!memberCookie) return null
    const member = JSON.parse(memberCookie.value) as Member
    if (!member.category) return null
    return member
  } catch {
    return null
  }
}
