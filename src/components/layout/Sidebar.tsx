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
  { label: 'Compliance Journey', icon: 'compass', to: '/app/journey' },
  { label: 'Calendar', icon: 'calendar', to: '/app/calendar' },
  { label: 'Documents', icon: 'folder', to: '/app/documents' },
  { label: 'Settings', icon: 'settings', to: '/app/settings' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 bg-black text-white">
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-white/10">
        <span className="text-lg font-bold tracking-tight">RUCompliant</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-magenta text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <AppIcon name={item.icon} className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Help link at bottom */}
      <div className="px-3 pb-4">
        <NavLink
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <AppIcon name="help-circle" className="w-5 h-5" />
          <span>Help</span>
        </NavLink>
      </div>
    </aside>
  )
}
