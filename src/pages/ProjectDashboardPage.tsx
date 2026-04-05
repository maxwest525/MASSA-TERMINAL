import { useParams, Link } from 'react-router-dom'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAgentStore } from '@/stores/useAgentStore'
import { useAppStore } from '@/stores/useAppStore'
import { PipelineView } from '@/components/project/PipelineView'
import { BuildList } from '@/components/project/BuildList'
import { RecommendationCard } from '@/components/project/RecommendationCard'
import { AgentCard } from '@/components/agent/AgentCard'
import { AgentOutputPanel } from '@/components/agent/AgentOutputPanel'
import { NeedsAttentionSection } from '@/components/operational/NeedsAttentionSection'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { clsx } from 'clsx'
import { Bot, GitBranch, Eye, CheckSquare } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  building: 'accent',
  reviewing: 'warning',
  deploying: 'accent',
  live: 'success',
  paused: 'default',
}

export function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = useProjectStore((s) => (projectId ? s.projects[projectId] : null))
  const agents = useAgentStore((s) => (projectId ? s.getAgentsByProject(projectId) : []))
  const { activeAgentId } = useAgentStore()
  const { depthLevel, viewMode } = useAppStore()
  const isTerminal = viewMode === 'terminal'

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-massa-muted">Project not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={clsx(
        'glass-panel p-5',
        isTerminal && 'bg-black border-green-500/20'
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className={clsx('text-xl font-bold', isTerminal && 'text-green-400 font-mono')}>
                {project.title}
              </h1>
              <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
            </div>
            <p className={clsx('text-sm', isTerminal ? 'text-green-600' : 'text-massa-muted')}>
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/projects/${project.id}/builds`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-massa-surface2 text-massa-muted rounded-lg hover:text-massa-text transition-colors"
            >
              <GitBranch size={12} /> Builds
            </Link>
            <Link
              to={`/projects/${project.id}/agents`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-massa-surface2 text-massa-muted rounded-lg hover:text-massa-text transition-colors"
            >
              <Bot size={12} /> Agents
            </Link>
            <Link
              to={`/projects/${project.id}/preview`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-massa-accent/15 text-indigo-300 rounded-lg hover:bg-massa-accent/25 transition-colors"
            >
              <Eye size={12} /> Preview
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar value={project.progress} size="md" />
          </div>
          <span className={clsx(
            'text-sm font-mono font-semibold',
            isTerminal ? 'text-green-400' : 'text-massa-text'
          )}>
            {project.progress}%
          </span>
        </div>
      </div>

      {/* Pipeline */}
      <PipelineView stages={project.pipeline} />

      {/* Main grid */}
      <div className={clsx(
        'grid gap-6',
        viewMode === 'orchestrator' ? 'grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'
      )}>
        {/* Agents column */}
        <div className="space-y-4">
          <h3 className={clsx(
            'text-sm font-semibold',
            isTerminal && 'text-green-400 font-mono'
          )}>
            {isTerminal ? '> AGENTS' : 'Agents'}
          </h3>
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Builds column */}
        <div>
          <BuildList builds={project.builds} />
        </div>

        {/* Intelligence column */}
        <div className="space-y-4">
          {/* Attention items for this project */}
          <div>
            <h3 className={clsx(
              'text-sm font-semibold mb-3',
              isTerminal && 'text-green-400 font-mono'
            )}>
              {isTerminal ? '> ATTENTION' : 'Needs Attention'}
            </h3>
            <NeedsAttentionSection projectId={project.id} limit={3} />
          </div>

          {/* Recommendations */}
          {depthLevel !== 'simple' && project.recommendations.length > 0 && (
            <div>
              <h3 className={clsx(
                'text-sm font-semibold mb-3',
                isTerminal && 'text-green-400 font-mono'
              )}>
                {isTerminal ? '> RECOMMENDATIONS' : 'Continuous Intelligence'}
              </h3>
              <div className="space-y-2">
                {project.recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent output panel */}
      {activeAgentId && <AgentOutputPanel />}
    </div>
  )
}
