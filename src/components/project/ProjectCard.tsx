import { Link } from 'react-router-dom'
import { useAgentStore } from '@/stores/useAgentStore'
import { useAppStore } from '@/stores/useAppStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types'
import { clsx } from 'clsx'
import { Bot, GitBranch, Clock } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  building: 'accent',
  reviewing: 'warning',
  deploying: 'accent',
  live: 'success',
  paused: 'default',
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ProjectCard({ project }: { project: Project }) {
  const agents = useAgentStore((s) => s.getAgentsByProject(project.id))
  const depthLevel = useAppStore((s) => s.depthLevel)
  const workingAgents = agents.filter((a) => a.status === 'working')
  const activeStage = project.pipeline.find((s) => s.status === 'active')

  return (
    <Link
      to={`/projects/${project.id}`}
      className="glass-panel p-4 hover:border-massa-accent/40 transition-all duration-300 group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm group-hover:text-teal-300 transition-colors">
            {project.title}
          </h3>
          {depthLevel !== 'simple' && (
            <p className="text-xs text-massa-muted mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
        <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
      </div>

      <ProgressBar value={project.progress} className="mb-3" />

      <div className="flex items-center justify-between text-xs text-massa-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Bot size={12} />
            {workingAgents.length > 0 ? (
              <span className="text-teal-300">{workingAgents.length} active</span>
            ) : (
              <span>{agents.length} agents</span>
            )}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            {project.builds.length} builds
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {timeAgo(project.updatedAt)}
        </span>
      </div>

      {depthLevel !== 'simple' && activeStage && (
        <div className="mt-3 pt-3 border-t border-massa-border">
          <div className="flex items-center gap-2">
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
                  stage.status === 'active' ? 'text-teal-300' : 'text-massa-ghost'
                )}>
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Link>
  )
}
