import type { Agent } from '@/types'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAppStore } from '@/stores/useAppStore'
import { useAgentStore } from '@/stores/useAgentStore'
import { clsx } from 'clsx'

const statusColors: Record<Agent['status'], string> = {
  working: 'status-dot-building',
  idle: 'status-dot-idle',
  blocked: 'status-dot-failed',
  complete: 'status-dot-active',
}

export function AgentCard({ agent }: { agent: Agent }) {
  const depthLevel = useAppStore((s) => s.depthLevel)
  const { setActiveAgent, activeAgentId } = useAgentStore()
  const isActive = activeAgentId === agent.id
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  return (
    <button
      onClick={() => setActiveAgent(isActive ? null : agent.id)}
      className={clsx(
        'w-full text-left p-3 rounded-lg transition-all duration-200',
        isActive
          ? isTerminal
            ? 'bg-green-500/10 border border-green-500/30'
            : 'bg-massa-accent/10 border border-massa-accent/30'
          : isTerminal
            ? 'bg-black/30 border border-green-500/10 hover:border-green-500/20'
            : 'bg-massa-surface2/50 hover:bg-massa-surface2 border border-transparent'
      )}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-lg">{agent.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={clsx('text-sm font-medium', isTerminal && 'text-green-400')}>
              {agent.name}
            </span>
            <span className={clsx('status-dot', statusColors[agent.status])} />
          </div>
          <p className={clsx(
            'text-xs truncate mt-0.5',
            isTerminal ? 'text-green-600' : 'text-massa-muted'
          )}>
            {agent.currentTask}
          </p>
        </div>
        <span className={clsx(
          'text-xs font-mono',
          isTerminal ? 'text-green-500' : 'text-massa-ghost'
        )}>
          {agent.progress}%
        </span>
      </div>

      <ProgressBar
        value={agent.progress}
        color={isTerminal ? 'bg-green-500' : undefined}
      />

      {depthLevel === 'deep' && agent.outputs.length > 0 && (
        <div className={clsx(
          'mt-2 pt-2 border-t',
          isTerminal ? 'border-green-500/10' : 'border-massa-border'
        )}>
          <p className={clsx(
            'text-[11px] font-mono truncate',
            isTerminal ? 'text-green-700' : 'text-massa-ghost'
          )}>
            {'>'} {agent.outputs[agent.outputs.length - 1].content.slice(0, 80)}
          </p>
        </div>
      )}
    </button>
  )
}
