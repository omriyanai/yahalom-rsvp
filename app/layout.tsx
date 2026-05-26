import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'עמותת יהלום — אישור הגעה',
  description: 'מערכת אישור הגעה לאירועי עמותת יהלום',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
