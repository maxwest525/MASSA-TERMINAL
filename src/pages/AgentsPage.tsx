import { useParams } from 'react-router-dom'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAgentStore } from '@/stores/useAgentStore'
import { useAppStore } from '@/stores/useAppStore'
import { AgentCard } from '@/components/agent/AgentCard'
import { AgentOutputPanel } from '@/components/agent/AgentOutputPanel'
import { clsx } from 'clsx'

export function AgentsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = useProjectStore((s) => (projectId ? s.projects[projectId] : null))
  const agents = useAgentStore((s) => (projectId ? s.getAgentsByProject(projectId) : []))
  const { activeAgentId } = useAgentStore()
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  if (!project) {
    return <div className="text-center py-16 text-massa-muted">Project not found</div>
  }

  return (
    <div className="space-y-6">
      <h2 className={clsx(
        'text-lg font-bold',
        isTerminal && 'text-green-400 font-mono'
      )}>
        {isTerminal ? `> AGENTS [${project.title}]` : `${project.title} — Agents`}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {activeAgentId && <AgentOutputPanel />}
    </div>
  )
}
