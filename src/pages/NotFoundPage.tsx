import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <p className="text-6xl font-bold text-massa-ghost mb-4">404</p>
      <p className="text-massa-muted mb-6">Page not found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-massa-accent text-massa-bg rounded-lg hover:bg-teal-400 transition-colors text-sm font-medium"
      >
        Back to Home
      </Link>
    </div>
  )
}
