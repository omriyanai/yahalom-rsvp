import Header from '@/components/Header'
import EventCard from '@/components/EventCard'
import { getEvents } from '@/lib/googleSheets'

export const revalidate = 300

export default async function Home() {
  let events: Awaited<ReturnType<typeof getEvents>> = []

  try {
    events = await getEvents()
  } catch (e) {
    console.error('Failed to load events:', e)
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-yahalom-dark text-center mb-8 tracking-tight">
          אירועים קרובים
        </h2>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400 text-lg">אין אירועים קרובים כרגע</p>
            <p className="text-gray-300 text-sm mt-2">בקרוב יתווספו אירועים חדשים</p>
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-gray-400 text-xs pb-8 mt-4">
        עמותת יהלום © {new Date().getFullYear()}
      </footer>
    </main>
  )
}
