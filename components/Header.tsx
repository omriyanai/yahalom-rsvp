import Image from 'next/image'
import type { Member } from '@/lib/googleSheets'

export default function Header({ member }: { member?: Member }) {
  return (
    <header className="bg-white shadow-sm border-b-4 border-yahalom-red">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-2">
        <Image
          src="/Logo.jpg"
          alt="עמותת יהלום"
          width={220}
          height={96}
          style={{ height: 'auto', maxHeight: '90px', width: 'auto' }}
          priority
        />
        <p className="text-yahalom-gray text-sm font-medium tracking-wide">
          תוכנית מנטורינג | אישור הגעה לאירועים
        </p>
        {member && (
          <div className="flex items-center gap-3 mt-1">
            <span className="text-yahalom-dark font-semibold text-sm">
              שלום, {member.firstName} {member.lastName} 👋
            </span>
            <a href="/admin" className="text-xs text-yahalom-red hover:underline transition font-medium">
              רשימות נוכחות
            </a>
            <a href="/api/signout" className="text-xs text-gray-400 hover:text-yahalom-red underline transition">
              התנתקות
            </a>
          </div>
        )}
      </div>
    </header>
  )
}
