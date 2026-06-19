'use client'

import { Download } from 'lucide-react'

export interface ExportRow {
  firstName: string
  lastName: string
  category: string
  attending: boolean | null
  source: string
  adminName?: string
}

function statusLabel(attending: boolean | null) {
  if (attending === true)  return 'מגיע'
  if (attending === false) return 'לא מגיע'
  return 'טרם ענה'
}

function sourceLabel(source: string, adminName?: string) {
  if (source === 'email') return 'אימייל'
  if (source === 'name')  return 'שם'
  if (source === 'admin') return `מנהל (${adminName || ''})`
  return '—'
}

export default function AdminExportButton({
  eventName,
  eventDate,
  rows,
}: {
  eventName: string
  eventDate: string
  rows: ExportRow[]
}) {
  const handleExport = () => {
    // Sort: attending first, then not-attending, then unanswered
    const sorted = [...rows].sort((a, b) => {
      const order = (x: boolean | null) => x === true ? 0 : x === false ? 1 : 2
      return order(a.attending) - order(b.attending)
    })

    const BOM = '﻿' // UTF-8 BOM so Excel/Sheets opens Hebrew correctly
    const header = ['שם פרטי', 'שם משפחה', 'קטגוריה', 'סטטוס', 'מקור'].join(',')
    const csvRows = sorted.map(r => [
      `"${r.firstName}"`,
      `"${r.lastName}"`,
      `"${r.category}"`,
      `"${statusLabel(r.attending)}"`,
      `"${sourceLabel(r.source, r.adminName)}"`,
    ].join(','))

    const csv = BOM + [header, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${eventName} — ${eventDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition hover:opacity-80"
      style={{
        background: 'rgba(196,18,48,0.12)',
        border:     '1px solid rgba(196,18,48,0.3)',
        color:      '#C41230',
      }}
    >
      <Download size={13} strokeWidth={2} />
      ייצוא CSV
    </button>
  )
}
