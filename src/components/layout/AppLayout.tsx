import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'


export default function AppLayout() {
  return (
    <div className="min-h-screen bg-page">
      <Sidebar />
      <MobileNav />

      {/* Main content area — offset for sidebar on desktop, bottom nav on mobile */}
      <main className="lg:ml-60 pb-20 lg:pb-0 min-h-screen">
        <div className="mx-auto max-w-content px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>

      {/* Floating "Ask Advisor" button */}
      <button
        type="button"
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 flex items-center gap-2 bg-magenta text-white px-4 py-3 rounded-full font-semibold text-sm hover:bg-magenta-500 transition-colors"
        onClick={() => {
          // Placeholder — will open AI Advisor in Phase 3
        }}
      >
        <span>Ask Advisor</span>
      </button>
    </div>
  )
}
