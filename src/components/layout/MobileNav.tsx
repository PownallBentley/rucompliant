import { NavLink } from 'react-router-dom'
import { AppIcon } from '@/components/ui'
import type { IconKey } from '@/components/ui/AppIcon'

interface NavItem {
  label: string
  icon: IconKey
  to: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'layout-dashboard', to: '/app/dashboard' },
  { label: 'Journey', icon: 'compass', to: '/app/journey' },
  { label: 'Calendar', icon: 'calendar', to: '/app/calendar' },
  { label: 'Documents', icon: 'folder', to: '/app/documents' },
  { label: 'Settings', icon: 'settings', to: '/app/settings' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black" style={{ height: 'calc(64px + env(safe-area-inset-bottom))' }}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-magenta' : 'text-white/60'
              }`
            }
          >
            <AppIcon name={item.icon} className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
      {/* Safe area spacer */}
      <div className="pb-safe-bottom" />
    </nav>
  )
}
