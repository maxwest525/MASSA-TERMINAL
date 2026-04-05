import { Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/stores/useProjectStore'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const location = useLocation()
  const projects = useProjectStore((s) => s.projects)

  const segments = location.pathname.split('/').filter(Boolean)

  const crumbs: { label: string; path: string }[] = [{ label: 'Home', path: '/' }]

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const path = '/' + segments.slice(0, i + 1).join('/')

    if (seg === 'projects') {
      crumbs.push({ label: 'Projects', path })
    } else if (seg === 'mission-control') {
      crumbs.push({ label: 'Mission Control', path })
    } else if (seg === 'needs-attention') {
      crumbs.push({ label: 'Needs Attention', path })
    } else if (seg === 'approvals') {
      crumbs.push({ label: 'Approvals', path })
    } else if (seg === 'builds') {
      crumbs.push({ label: 'Builds', path })
    } else if (seg === 'agents') {
      crumbs.push({ label: 'Agents', path })
    } else if (seg === 'preview') {
      crumbs.push({ label: 'Preview', path })
    } else if (projects[seg]) {
      crumbs.push({ label: projects[seg].title, path })
    }
  }

  if (crumbs.length <= 1) return null

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight size={12} className="text-massa-ghost" />}
          {idx === crumbs.length - 1 ? (
            <span className="text-massa-text font-medium flex items-center gap-1">
              {idx === 0 && <Home size={12} />}
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-massa-muted hover:text-massa-text transition-colors flex items-center gap-1"
            >
              {idx === 0 && <Home size={12} />}
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
