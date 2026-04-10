import { clsx } from 'clsx'
import { useAppStore } from '@/stores/useAppStore'
import type { DepthLevel } from '@/types'

const levels: { level: DepthLevel; label: string }[] = [
  { level: 'simple', label: 'Simple' },
  { level: 'standard', label: 'Standard' },
  { level: 'deep', label: 'Deep' },
]

export function DepthToggle() {
  const { depthLevel, setDepthLevel } = useAppStore()

  return (
    <div className="flex items-center gap-1 bg-massa-surface2 rounded-lg p-1">
      {levels.map(({ level, label }) => (
        <button
          key={level}
          onClick={() => setDepthLevel(level)}
          className={clsx(
            'px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200',
            depthLevel === level
              ? 'bg-massa-accent/20 text-teal-300'
              : 'text-massa-muted hover:text-massa-text'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
