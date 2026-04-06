import { clsx } from 'clsx'
import { useAppStore } from '@/stores/useAppStore'
import type { ViewMode } from '@/types'
import { LayoutDashboard, Terminal, Grid3X3, FileCode, Network } from 'lucide-react'

const modes: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'chassis', icon: LayoutDashboard, label: 'Chassis' },
  { mode: 'terminal', icon: Terminal, label: 'Terminal' },
  { mode: 'mission-control', icon: Grid3X3, label: 'Mission' },
  { mode: 'blueprint', icon: FileCode, label: 'Blueprint' },
  { mode: 'orchestrator', icon: Network, label: 'Orchestr.' },
]

export function ViewModeSelector() {
  const { viewMode, setViewMode } = useAppStore()
  const isTerminal = viewMode === 'terminal'
  const activeLabel = modes.find((m) => m.mode === viewMode)?.label || ''

  return (
    <div className="flex items-center gap-2">
      <div className={clsx(
        'flex items-center gap-0.5 rounded-lg p-0.5',
        isTerminal ? 'bg-green-500/5 border border-green-500/15' : 'bg-massa-surface2'
      )}>
        {modes.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            title={label}
            className={clsx(
              'p-1.5 rounded-md transition-all duration-200 relative',
              viewMode === mode
                ? isTerminal
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-massa-accent text-white shadow-sm shadow-massa-accent/30'
                : isTerminal
                  ? 'text-green-700 hover:text-green-400 hover:bg-green-500/10'
                  : 'text-massa-muted hover:text-massa-text hover:bg-massa-border/20'
            )}
          >
            <Icon size={13} />
          </button>
        ))}
      </div>
      <span className={clsx(
        'text-[11px] font-medium hidden sm:block',
        isTerminal ? 'text-green-600 font-mono' : 'text-massa-ghost'
      )}>
        {activeLabel}
      </span>
    </div>
  )
}
