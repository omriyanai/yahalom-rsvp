import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

// ─── Members ──────────────────────────────────────────────

export interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  category: string  // מנטור | מנטי | צוות
  phone?: string    // column F (optional)
}

function parseMembers(rows: string[][]): Member[] {
  return rows
    .filter((row) => row[0])
    .map((row) => ({
      id:        row[0] || '',
      firstName: row[1] || '',
      lastName:  row[2] || '',
      email:     (row[3] || '').trim(),
      category:  (row[4] || '').trim(),
      phone:     (row[5] || '').trim() || undefined,
    }))
}

export async function getMembers(): Promise<Member[]> {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Members!A2:F200',   // extended to column F for phone
  })
  return parseMembers(response.data.values || [])
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Members!A2:F200',
  })
  const row = (response.data.values || []).find(
    (r) => r[3]?.toLowerCase() === email.toLowerCase()
  )
  if (!row) return null
  return parseMembers([row])[0]
}

// ─── Events ───────────────────────────────────────────────

export interface Event {
  id: string
  name: string
  date: string
  time: string
  endtime: string
  location: string
  address: string
  description: string
  categories: string[]  // e.g. ['מנטור', 'מנטי']
}

export async function getEvents(): Promise<Event[]> {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Events!A2:J200',
  })

  const rows = response.data.values || []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return rows
    .filter((row) => {
      if (!row[0] || !row[2]) return false
      if (row[7] === 'FALSE') return false
      return new Date(row[2]) >= today
    })
    .sort((a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime())
    .map((row) => ({
      id:          row[0] || '',
      name:        row[1] || '',
      date:        row[2] || '',
      time:        row[3] || '',
      location:    row[4] || '',
      address:     row[5] || '',
      description: row[6] || '',
      endtime:     row[8] || '',
      categories:  row[9] ? row[9].split(',').map((c: string) => c.trim()).filter(Boolean) : [],
    }))
}

// ─── Admin Overrides ──────────────────────────────────────

export interface AdminOverride {
  timestamp: string
  eventId: string
  memberEmail: string
  memberName: string
  attending: string   // 'מגיע' | 'לא מגיע'
  adminName: string
}

export async function getAdminOverrides(): Promise<AdminOverride[]> {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'AdminOverrides!A2:F2000',
  })
  return (response.data.values || [])
    .filter(row => row[1])
    .map(row => ({
      timestamp:   row[0] || '',
      eventId:     (row[1] || '').trim(),
      memberEmail: (row[2] || '').trim(),
      memberName:  (row[3] || '').trim(),
      attending:   (row[4] || '').trim(),
      adminName:   (row[5] || '').trim(),
    }))
}

export async function addAdminOverride(data: {
  eventId: string
  memberEmail: string
  memberName: string
  attending: string
  adminName: string
}) {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'AdminOverrides!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[ timestamp, data.eventId, data.memberEmail, data.memberName, data.attending, data.adminName ]],
    },
  })
}

// ─── RSVPs ────────────────────────────────────────────────

export interface RSVPRecord {
  eventId: string
  name: string
  email: string
  attending: string
}

export async function getAllRSVPs(): Promise<RSVPRecord[]> {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'RSVPs!A2:F2000',
  })
  return (response.data.values || [])
    .filter((row) => row[1])
    .map((row) => ({
      eventId:   (row[1] || '').trim(),
      name:      (row[3] || '').trim(),
      email:     (row[4] || '').trim(),
      attending: (row[5] || '').trim(),
    }))
}

export async function addRSVP(data: {
  eventId: string
  eventName: string
  name: string
  email: string
  attending: string
}) {
  const auth = await getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'RSVPs!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        timestamp,
        data.eventId,
        data.eventName,
        data.name,
        data.email,
        data.attending === 'yes' ? '✓ מגיע' : '✗ לא מגיע',
      ]],
    },
  })
}
