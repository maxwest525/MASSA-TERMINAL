import { NavLink, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAppStore } from '@/stores/useAppStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import type { Folder } from '@/types'
import {
  Home,
  FolderKanban,
  Rocket,
  AlertCircle,
  CheckCircle2,
  Archive,
  Trash2,
  Cloud,
  Globe,
  Bot,
  Zap,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const folderConfig: { folder: Folder; icon: React.ElementType; label: string }[] = [
  { folder: 'in-progress', icon: Rocket, label: 'In Progress' },
  { folder: 'completed', icon: CheckCircle2, label: 'Completed' },
  { folder: 'deployed', icon: Cloud, label: 'Deployed' },
  { folder: 'published', icon: Globe, label: 'Published' },
  { folder: 'archived', icon: Archive, label: 'Archived' },
  { folder: 'deleted', icon: Trash2, label: 'Deleted' },
]

const navLink = 'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200'
const navLinkActive = 'bg-massa-accent/15 text-teal-300'
const navLinkInactive = 'text-massa-muted hover:text-massa-text hover:bg-massa-surface2'

export function Sidebar() {
  const { sidebarOpen, viewMode } = useAppStore()
  const { activeFolder, setActiveFolder, getProjectsByFolder } = useProjectStore()
  const unresolvedCount = useNotificationStore((s) => s.getUnresolvedCount())
  const [foldersExpanded, setFoldersExpanded] = useState(true)
  const navigate = useNavigate()

  if (!sidebarOpen || viewMode === 'terminal') return null

  return (
    <aside className="w-60 h-full bg-massa-surface border-r border-massa-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-massa-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-massa-accent/90 flex items-center justify-center">
            <Zap size={14} className="text-massa-bg" />
          </div>
          <span className="font-semibold text-sm tracking-wide">MASSA</span>
          <span className="text-xs text-massa-muted font-mono">v0.1</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) => clsx(navLink, isActive ? navLinkActive : navLinkInactive)}
        >
          <Home size={16} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => clsx(navLink, isActive ? navLinkActive : navLinkInactive)}
        >
          <FolderKanban size={16} />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/mission-control"
          className={({ isActive }) => clsx(navLink, isActive ? navLinkActive : navLinkInactive)}
        >
          <Bot size={16} />
          <span>Mission Control</span>
        </NavLink>

        <NavLink
          to="/needs-attention"
          className={({ isActive }) => clsx(navLink, isActive ? navLinkActive : navLinkInactive)}
        >
          <AlertCircle size={16} />
          <span>Needs Attention</span>
          {unresolvedCount > 0 && (
            <span className="ml-auto text-xs bg-massa-error/20 text-red-400 px-1.5 py-0.5 rounded-full">
              {unresolvedCount}
            </span>
          )}
        </NavLink>

        {/* Project folders */}
        <div className="pt-4">
          <button
            onClick={() => setFoldersExpanded(!foldersExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-massa-muted w-full hover:text-massa-text transition-colors"
          >
            {foldersExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Project Folders
          </button>

          {foldersExpanded && (
            <div className="mt-1 space-y-0.5">
              {folderConfig.map(({ folder, icon: Icon, label }) => {
                const count = getProjectsByFolder(folder).length
                return (
                  <button
                    key={folder}
                    onClick={() => {
                      setActiveFolder(folder)
                      navigate('/projects')
                    }}
                    className={clsx(
                      navLink,
                      'w-full',
                      activeFolder === folder ? 'bg-massa-surface2 text-massa-text' : 'text-massa-muted hover:text-massa-text hover:bg-massa-surface2'
                    )}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                    {count > 0 && (
                      <span className="ml-auto text-xs text-massa-ghost">{count}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-3 border-t border-massa-border">
        <div className="text-xs text-massa-ghost">
          <span className="status-dot status-dot-active mr-2" />
          System Active
        </div>
      </div>
    </aside>
  )
}
