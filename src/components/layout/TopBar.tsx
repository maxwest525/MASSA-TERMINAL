import { useAppStore } from '@/stores/useAppStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { ViewModeSelector } from '@/components/ui/ViewModeSelector'
import { DepthToggle } from '@/components/ui/DepthToggle'
import { Breadcrumbs } from './Breadcrumbs'
import { clsx } from 'clsx'
import { Menu, Bell } from 'lucide-react'

export function TopBar() {
  const { toggleSidebar, viewMode, sidebarOpen } = useAppStore()
  const unresolvedCount = useNotificationStore((s) => s.getUnresolvedCount())
  const isTerminal = viewMode === 'terminal'

  return (
    <header className={clsx(
      'h-11 flex items-center justify-between px-4 shrink-0 transition-colors duration-200',
      isTerminal
        ? 'bg-[#050505] border-b border-green-500/10'
        : 'bg-massa-surface border-b border-massa-border/60'
    )}>
      <div className="flex items-center gap-3">
        {(!sidebarOpen || isTerminal) && (
          <button
            onClick={toggleSidebar}
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              isTerminal
                ? 'text-green-600 hover:text-green-400 hover:bg-green-500/10'
                : 'text-massa-muted hover:text-massa-text hover:bg-massa-surface2'
            )}
          >
            <Menu size={16} />
          </button>
        )}
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        {/* Hide depth toggle in terminal mode */}
        {!isTerminal && <DepthToggle />}
        <ViewModeSelector />
        {!isTerminal && (
          <button className="relative p-1.5 rounded-md text-massa-muted hover:text-massa-text hover:bg-massa-surface2 transition-colors">
            <Bell size={16} />
            {unresolvedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-massa-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unresolvedCount > 9 ? '9+' : unresolvedCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
