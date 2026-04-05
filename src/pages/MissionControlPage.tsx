import { useProjectStore } from '@/stores/useProjectStore'
import { useAgentStore } from '@/stores/useAgentStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Bot, Zap, Activity } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  building: 'accent',
  reviewing: 'warning',
  deploying: 'accent',
  live: 'success',
  paused: 'default',
}

export function MissionControlPage() {
  const projects = useProjectStore((s) => s.getAllProjects())
  const agentStore = useAgentStore()

  const totalAgents = Object.values(agentStore.agents).filter((a) => a.status === 'working').length

  return (
    <div>
      {/* Header stats */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-massa-accent" />
          <span className="text-sm font-semibold">Mission Control</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-massa-muted">
          <span>{projects.length} projects</span>
          <span>{totalAgents} agents working</span>
          <span className="flex items-center gap-1">
            <span className="status-dot status-dot-active" />
            System active
          </span>
        </div>
      </div>

      {/* Project grid - 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => {
          const agents = agentStore.getAgentsByProject(project.id)
          const workingAgents = agents.filter((a) => a.status === 'working')
          const activeStage = project.pipeline.find((s) => s.status === 'active')

          return (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="glass-panel p-5 hover:border-massa-accent/40 transition-all group"
            >
              {/* Project header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-massa-muted mt-1">{project.description}</p>
                </div>
                <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-4">
                <ProgressBar value={project.progress} size="md" className="flex-1" />
                <span className="text-sm font-mono font-semibold">{project.progress}%</span>
              </div>

              {/* Pipeline stages */}
              <div className="flex items-center gap-2 mb-4">
                {project.pipeline.map((stage) => (
                  <div key={stage.name} className="flex items-center gap-1">
                    <div
                      className={clsx(
                        'w-2 h-2 rounded-full',
                        stage.status === 'complete' && 'bg-massa-success',
                        stage.status === 'active' && 'bg-massa-accent animate-pulse',
                        stage.status === 'pending' && 'bg-massa-surface2',
                        stage.status === 'failed' && 'bg-massa-error'
                      )}
                    />
                    <span className={clsx(
                      'text-[10px]',
                      stage.status === 'active' ? 'text-indigo-300' : 'text-massa-ghost'
                    )}>
                      {stage.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Agents */}
              <div className="flex items-center gap-3 pt-3 border-t border-massa-border">
                <Bot size={14} className="text-massa-muted" />
                <div className="flex items-center gap-2 flex-1">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-1.5">
                      <span className="text-sm">{agent.avatar}</span>
                      <span className={clsx(
                        'text-xs',
                        agent.status === 'working' ? 'text-indigo-300' : 'text-massa-ghost'
                      )}>
                        {agent.name}
                      </span>
                      <span
                        className={clsx(
                          'status-dot',
                          agent.status === 'working' && 'status-dot-building',
                          agent.status === 'complete' && 'status-dot-active',
                          agent.status === 'idle' && 'status-dot-idle',
                          agent.status === 'blocked' && 'status-dot-failed'
                        )}
                      />
                    </div>
                  ))}
                </div>
                {workingAgents.length > 0 && (
                  <span className="text-xs text-indigo-300">
                    {workingAgents.length} active
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
