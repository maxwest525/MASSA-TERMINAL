import type { PipelineStage } from '@/types'
import { clsx } from 'clsx'
import { Check, Loader2, Circle, X } from 'lucide-react'

const stageIcons: Record<string, React.ElementType> = {
  complete: Check,
  active: Loader2,
  pending: Circle,
  failed: X,
}

export function PipelineView({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-semibold mb-4">Pipeline</h3>
      <div className="flex items-center gap-0">
        {stages.map((stage, idx) => {
          const Icon = stageIcons[stage.status]
          return (
            <div key={stage.name} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                    stage.status === 'complete' && 'bg-massa-success/20 border-massa-success text-massa-success',
                    stage.status === 'active' && 'bg-massa-accent/20 border-massa-accent text-massa-accent',
                    stage.status === 'pending' && 'bg-massa-surface2 border-massa-border text-massa-ghost',
                    stage.status === 'failed' && 'bg-massa-error/20 border-massa-error text-massa-error'
                  )}
                >
                  <Icon
                    size={14}
                    className={clsx(stage.status === 'active' && 'animate-spin')}
                  />
                </div>
                <span
                  className={clsx(
                    'text-[11px] font-medium',
                    stage.status === 'active' ? 'text-indigo-300' : 'text-massa-muted'
                  )}
                >
                  {stage.name}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div
                  className={clsx(
                    'h-0.5 flex-1 mx-1 rounded-full',
                    stage.status === 'complete' ? 'bg-massa-success/50' : 'bg-massa-border'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
