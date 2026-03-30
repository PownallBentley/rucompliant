import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto max-w-content px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}
