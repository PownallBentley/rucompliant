import { NavLink, useNavigate } from 'react-router-dom'
import { AppIcon } from '@/components/ui'
import type { IconKey } from '@/components/ui/AppIcon'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { signOut } from '@/services/authService'

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
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { avatarUrl, firstName, lastName } = useProfileStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 bg-black text-white">
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-white/10">
        <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center mr-3">
          <span className="text-primary font-extrabold text-sm leading-none">R</span>
        </div>
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

      {/* Bottom section: Help + User */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-4">
        <NavLink
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <AppIcon name="help-circle" className="w-5 h-5" />
          <span>Help</span>
        </NavLink>

        {/* User + Sign out */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <NavLink to="/app/settings" className="w-8 h-8 rounded-full bg-magenta/20 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-primary transition-all overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary uppercase">
                {firstName ? `${firstName.charAt(0)}${lastName?.charAt(0) || ''}` : user?.email?.charAt(0) || '?'}
              </span>
            )}
          </NavLink>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/80 truncate">
              {user?.email || 'Account'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-white/40 hover:text-white transition-colors"
            title="Sign out"
          >
            <AppIcon name="log-out" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
