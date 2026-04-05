import { useAgentStore } from '@/stores/useAgentStore'
import { useAppStore } from '@/stores/useAppStore'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'
import { X, Code, FileText, Package, Terminal } from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  code: Code,
  text: FileText,
  artifact: Package,
  log: Terminal,
}

function timeStr(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function AgentOutputPanel() {
  const { agents, activeAgentId, setActiveAgent } = useAgentStore()
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  if (!activeAgentId || !agents[activeAgentId]) return null

  const agent = agents[activeAgentId]

  return (
    <div className={clsx(
      'glass-panel overflow-hidden animate-slide-up',
      isTerminal && 'border-green-500/20 bg-black/50'
    )}>
      {/* Header */}
      <div className={clsx(
        'flex items-center justify-between px-4 py-3 border-b',
        isTerminal ? 'border-green-500/20' : 'border-massa-border'
      )}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{agent.avatar}</span>
          <div>
            <span className={clsx('text-sm font-semibold', isTerminal && 'text-green-400')}>
              {agent.name}
            </span>
            <p className={clsx('text-xs', isTerminal ? 'text-green-600' : 'text-massa-muted')}>
              {agent.currentTask}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveAgent(null)}
          className="p-1.5 rounded-md text-massa-muted hover:text-massa-text hover:bg-massa-surface2"
        >
          <X size={16} />
        </button>
      </div>

      {/* Outputs */}
      <div className="max-h-80 overflow-y-auto p-4 space-y-3">
        {agent.outputs.length === 0 ? (
          <p className="text-xs text-massa-ghost text-center py-4">No outputs yet</p>
        ) : (
          agent.outputs.map((output) => {
            const Icon = typeIcons[output.type] || Terminal
            return (
              <div key={output.id} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} className={isTerminal ? 'text-green-500' : 'text-massa-muted'} />
                  <Badge variant={output.type === 'code' ? 'accent' : 'default'}>
                    {output.type}
                  </Badge>
                  <span className={clsx('text-[10px]', isTerminal ? 'text-green-700' : 'text-massa-ghost')}>
                    {timeStr(output.timestamp)}
                  </span>
                </div>
                <div
                  className={clsx(
                    'rounded-lg p-3 text-xs font-mono whitespace-pre-wrap',
                    output.type === 'code'
                      ? isTerminal ? 'bg-black border border-green-500/20 text-green-400' : 'bg-massa-bg border border-massa-border text-massa-text'
                      : isTerminal ? 'bg-black/30 text-green-500' : 'bg-massa-surface2/50 text-massa-muted'
                  )}
                >
                  {output.content}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
