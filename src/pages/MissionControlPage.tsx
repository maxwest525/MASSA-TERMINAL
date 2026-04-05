import { useMemo } from 'react'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAgentStore } from '@/stores/useAgentStore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Bot, Activity, Cpu, GitBranch, Play } from 'lucide-react'

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

  const totalAgents = useMemo(
    () => Object.values(agentStore.agents).filter((a) => a.status === 'working').length,
    [agentStore.agents]
  )
  const totalBuildsRunning = useMemo(
    () => projects.reduce((sum, p) => sum + p.builds.filter((b) => b.status === 'running').length, 0),
    [projects]
  )
  const totalBuilds = useMemo(
    () => projects.reduce((sum, p) => sum + p.builds.length, 0),
    [projects]
  )

  return (
    <div>
      {/* Global stats bar */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-massa-border/40">
        <div className="flex items-center gap-2 mr-2">
          <Activity size={16} className="text-massa-accent" />
          <span className="text-sm font-semibold">Mission Control</span>
        </div>
        <div className="flex items-center gap-1 flex-1">
          {[
            { label: 'PROJECTS', value: projects.length, color: 'text-massa-text' },
            { label: 'AGENTS', value: `${totalAgents} active`, color: totalAgents > 0 ? 'text-indigo-300' : 'text-massa-muted' },
            { label: 'BUILDS', value: totalBuildsRunning > 0 ? `${totalBuildsRunning} running` : `${totalBuilds} total`, color: totalBuildsRunning > 0 ? 'text-massa-accent' : 'text-massa-muted' },
            { label: 'UPTIME', value: '4h 23m', color: 'text-massa-muted' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 bg-massa-surface2/50 rounded-md">
              <span className="text-[10px] font-mono uppercase tracking-wider text-massa-ghost">{stat.label}</span>
              <span className={clsx('text-xs font-mono font-semibold', stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-massa-ghost">
          <span className="status-dot status-dot-active" />
          <span className="font-mono">ONLINE</span>
        </div>
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => {
          const agents = agentStore.getAgentsByProject(project.id)
          const workingAgents = agents.filter((a) => a.status === 'working')
          const activeStage = project.pipeline.find((s) => s.status === 'active')
          const hasRunningBuild = project.builds.some((b) => b.status === 'running')
          const isActive = project.status === 'building' || project.status === 'reviewing' || project.status === 'deploying'

          // Latest agent output for this project
          const latestOutput = agents
            .flatMap((a) => a.outputs.map((o) => ({ agentName: a.name, ...o })))
            .sort((a, b) => b.timestamp - a.timestamp)[0]

          return (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={clsx(
                'glass-panel overflow-hidden transition-all duration-300 group relative',
                isActive && 'border-t-2 border-t-massa-accent/50',
                !isActive && project.status === 'live' && 'border-t-2 border-t-massa-success/40',
              )}
            >
              {/* Active build pulse indicator */}
              {hasRunningBuild && (
                <div className="absolute top-3 right-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-massa-accent opacity-50" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-massa-accent" />
                  </span>
                </div>
              )}

              <div className="p-5">
                {/* Project header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-semibold group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>
                    <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
                    {activeStage && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-massa-accent">
                        <Play size={9} className="fill-current" />
                        {activeStage.name}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-massa-muted mb-4 line-clamp-1">{project.description}</p>

                {/* Progress */}
                <div className="flex items-center gap-3 mb-4">
                  <ProgressBar value={project.progress} size="md" className="flex-1" />
                  <span className="text-sm font-mono font-semibold tabular-nums">{project.progress}%</span>
                </div>

                {/* Pipeline stages */}
                <div className="flex items-center gap-1.5 mb-4">
                  {project.pipeline.map((stage, idx) => (
                    <div key={stage.name} className="flex items-center gap-1 flex-1">
                      <div className="flex flex-col items-center gap-0.5 flex-1">
                        <div
                          className={clsx(
                            'w-full h-1 rounded-full transition-all',
                            stage.status === 'complete' && 'bg-massa-success/60',
                            stage.status === 'active' && 'bg-massa-accent animate-pulse',
                            stage.status === 'pending' && 'bg-massa-surface2',
                            stage.status === 'failed' && 'bg-massa-error/60'
                          )}
                        />
                        <span className={clsx(
                          'text-[9px] font-mono',
                          stage.status === 'active' ? 'text-indigo-300' : 'text-massa-ghost/60'
                        )}>
                          {stage.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agents row */}
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-massa-border/40">
                  <Bot size={12} className="text-massa-ghost shrink-0" />
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center gap-1 shrink-0">
                        <span className="text-xs">{agent.avatar}</span>
                        <span className={clsx(
                          'text-[11px]',
                          agent.status === 'working' ? 'text-indigo-300' : 'text-massa-ghost'
                        )}>
                          {agent.name}
                        </span>
                        <span
                          className={clsx(
                            'status-dot !w-1.5 !h-1.5',
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
                    <span className="text-[11px] text-indigo-300 font-mono shrink-0">
                      {workingAgents.length} active
                    </span>
                  )}
                </div>

                {/* Live activity line */}
                {latestOutput ? (
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <Cpu size={10} className="text-massa-ghost shrink-0" />
                    <span className="text-massa-ghost shrink-0">{latestOutput.agentName}:</span>
                    <span className="text-massa-muted truncate">{latestOutput.content.slice(0, 80)}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-massa-ghost">
                    <GitBranch size={10} />
                    <span>{project.builds.length} builds</span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
