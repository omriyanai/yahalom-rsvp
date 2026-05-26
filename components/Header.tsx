import Image from 'next/image'

export default function Header() {
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
          תכנית חונכות | אישור הגעה לאירועים
        </p>
      </div>
    </header>
  )
}
