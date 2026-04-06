import { Link } from 'react-router-dom'
import { useAgentStore } from '@/stores/useAgentStore'
import { useAppStore } from '@/stores/useAppStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types'
import { clsx } from 'clsx'
import { Bot, GitBranch, Clock, Cpu } from 'lucide-react'

const statusVariant: Record<string, 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  building: 'accent',
  reviewing: 'warning',
  deploying: 'accent',
  live: 'success',
  paused: 'default',
}

const statusBorderColor: Record<string, string> = {
  planning: 'border-l-blue-400/40',
  building: 'border-l-indigo-400/60',
  reviewing: 'border-l-yellow-400/50',
  deploying: 'border-l-indigo-400/60',
  live: 'border-l-green-400/50',
  paused: 'border-l-massa-ghost/30',
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
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'
  const workingAgents = agents.filter((a) => a.status === 'working')
  const activeStage = project.pipeline.find((s) => s.status === 'active')

  // First working agent's current task
  const liveTask = workingAgents.length > 0 ? workingAgents[0] : null

  return (
    <Link
      to={`/projects/${project.id}`}
      className={clsx(
        'block rounded-lg border transition-all duration-200 group overflow-hidden',
        isTerminal
          ? 'bg-black border-green-500/15 hover:border-green-500/30'
          : [
              'bg-massa-surface/70 border-massa-border/60 hover:border-massa-accent/30',
              'border-l-[3px]',
              statusBorderColor[project.status],
            ]
      )}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between mb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={clsx(
                'font-semibold text-sm group-hover:text-indigo-300 transition-colors',
                isTerminal && 'text-green-400 font-mono'
              )}>
                {project.title}
              </h3>
              <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
            </div>
            {depthLevel !== 'simple' && (
              <p className={clsx(
                'text-xs mt-1 line-clamp-1',
                isTerminal ? 'text-green-700' : 'text-massa-muted'
              )}>
                {project.description}
              </p>
            )}
          </div>
        </div>

        <ProgressBar value={project.progress} className="mb-2.5" />

        <div className={clsx(
          'flex items-center justify-between text-xs',
          isTerminal ? 'text-green-600' : 'text-massa-muted'
        )}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Bot size={11} />
              {workingAgents.length > 0 ? (
                <span className={isTerminal ? 'text-green-400' : 'text-indigo-300'}>
                  {workingAgents.length} active
                </span>
              ) : (
                <span>{agents.length} agents</span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <GitBranch size={11} />
              {project.builds.length}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(project.updatedAt)}
          </span>
        </div>

        {/* Pipeline dots — compact */}
        {depthLevel !== 'simple' && activeStage && (
          <div className={clsx(
            'mt-2.5 pt-2.5 border-t flex items-center gap-1.5',
            isTerminal ? 'border-green-500/10' : 'border-massa-border/40'
          )}>
            {project.pipeline.map((stage) => (
              <div key={stage.name} className="flex items-center gap-0.5">
                <div
                  className={clsx(
                    'w-1.5 h-1.5 rounded-full',
                    stage.status === 'complete' && 'bg-massa-success',
                    stage.status === 'active' && 'bg-massa-accent animate-pulse',
                    stage.status === 'pending' && (isTerminal ? 'bg-green-900' : 'bg-massa-surface2'),
                    stage.status === 'failed' && 'bg-massa-error'
                  )}
                />
                <span className={clsx(
                  'text-[9px] font-mono',
                  stage.status === 'active'
                    ? isTerminal ? 'text-green-400' : 'text-indigo-300'
                    : isTerminal ? 'text-green-800' : 'text-massa-ghost/50'
                )}>
                  {stage.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Live agent task line */}
        {liveTask && depthLevel !== 'simple' && (
          <div className={clsx(
            'mt-2 flex items-center gap-1.5 text-[11px] font-mono',
            isTerminal ? 'text-green-600' : 'text-massa-ghost'
          )}>
            <Cpu size={9} className="shrink-0" />
            <span className="truncate">{liveTask.name}: {liveTask.currentTask}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
