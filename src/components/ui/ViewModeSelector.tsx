import { clsx } from 'clsx'
import { useAppStore } from '@/stores/useAppStore'
import type { ViewMode } from '@/types'
import { LayoutDashboard, Terminal, Grid3X3, FileCode, Network } from 'lucide-react'

const modes: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'chassis', icon: LayoutDashboard, label: 'Chassis' },
  { mode: 'terminal', icon: Terminal, label: 'Terminal' },
  { mode: 'mission-control', icon: Grid3X3, label: 'Mission Control' },
  { mode: 'blueprint', icon: FileCode, label: 'Blueprint' },
  { mode: 'orchestrator', icon: Network, label: 'Orchestrator' },
]

export function ViewModeSelector() {
  const { viewMode, setViewMode } = useAppStore()

  return (
    <div className="flex items-center gap-1 bg-massa-surface2 rounded-lg p-1">
      {modes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          title={label}
          className={clsx(
            'p-1.5 rounded-md transition-all duration-200',
            viewMode === mode
              ? 'bg-massa-accent text-massa-bg shadow-md'
              : 'text-massa-muted hover:text-massa-text hover:bg-massa-border/30'
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  )
}
