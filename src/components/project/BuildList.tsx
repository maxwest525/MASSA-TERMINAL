import type { Build } from '@/types'
import { useAppStore } from '@/stores/useAppStore'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'
import { CheckCircle2, Loader2, Clock, XCircle } from 'lucide-react'

const statusConfig: Record<Build['status'], { icon: React.ElementType; variant: 'success' | 'accent' | 'default' | 'error' }> = {
  success: { icon: CheckCircle2, variant: 'success' },
  running: { icon: Loader2, variant: 'accent' },
  queued: { icon: Clock, variant: 'default' },
  failed: { icon: XCircle, variant: 'error' },
}

function formatDuration(secs: number): string {
  if (secs === 0) return 'running...'
  if (secs < 60) return `${secs}s`
  return `${Math.floor(secs / 60)}m ${secs % 60}s`
}

export function BuildList({ builds }: { builds: Build[] }) {
  const depthLevel = useAppStore((s) => s.depthLevel)

  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-semibold mb-3">Builds</h3>
      <div className="space-y-2">
        {builds.map((build) => {
          const config = statusConfig[build.status]
          const Icon = config.icon
          return (
            <div
              key={build.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-massa-surface2/50 hover:bg-massa-surface2 transition-colors"
            >
              <Icon
                size={16}
                className={clsx(
                  build.status === 'success' && 'text-massa-success',
                  build.status === 'running' && 'text-massa-accent animate-spin',
                  build.status === 'queued' && 'text-massa-muted',
                  build.status === 'failed' && 'text-massa-error'
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium">{build.version}</span>
                  <Badge variant={config.variant}>{build.status}</Badge>
                </div>
                {depthLevel === 'deep' && build.logs.length > 0 && (
                  <div className="mt-1.5 space-y-0.5">
                    {build.logs.map((log, i) => (
                      <p key={i} className="text-[11px] font-mono text-massa-ghost">
                        {'>'} {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs text-massa-ghost font-mono">{formatDuration(build.duration)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
