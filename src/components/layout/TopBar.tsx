import { useAppStore } from '@/stores/useAppStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { ViewModeSelector } from '@/components/ui/ViewModeSelector'
import { DepthToggle } from '@/components/ui/DepthToggle'
import { Breadcrumbs } from './Breadcrumbs'
import { Menu, Bell } from 'lucide-react'

export function TopBar() {
  const { toggleSidebar, viewMode, sidebarOpen } = useAppStore()
  const unresolvedCount = useNotificationStore((s) => s.getUnresolvedCount())

  return (
    <header className="h-12 bg-massa-surface border-b border-massa-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {(!sidebarOpen || viewMode === 'terminal') && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-massa-muted hover:text-massa-text hover:bg-massa-surface2 transition-colors"
          >
            <Menu size={16} />
          </button>
        )}
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        <DepthToggle />
        <ViewModeSelector />
        <button className="relative p-1.5 rounded-md text-massa-muted hover:text-massa-text hover:bg-massa-surface2 transition-colors">
          <Bell size={16} />
          {unresolvedCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-massa-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unresolvedCount > 9 ? '9+' : unresolvedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
