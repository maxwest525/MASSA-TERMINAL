import { useMemo } from 'react'
import { CommandInput } from '@/components/command/CommandInput'
import { ProjectCard } from '@/components/project/ProjectCard'
import { NeedsAttentionSection } from '@/components/operational/NeedsAttentionSection'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAgentStore } from '@/stores/useAgentStore'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { ArrowRight, Activity, Cpu, FolderKanban, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePage() {
  const projects = useProjectStore((s) => s.getAllProjects())
  const agents = useAgentStore((s) => s.agents)
  const viewMode = useAppStore((s) => s.viewMode)
  const isTerminal = viewMode === 'terminal'

  const activeProjects = projects.filter((p) => p.folder === 'in-progress')
  const workingAgents = useMemo(
    () => Object.values(agents).filter((a) => a.status === 'working'),
    [agents]
  )
  const totalBuildsRunning = useMemo(
    () => projects.reduce((sum, p) => sum + p.builds.filter((b) => b.status === 'running').length, 0),
    [projects]
  )

  // Recent agent activity across all projects
  const recentActivity = useMemo(() => {
    const allOutputs = Object.values(agents).flatMap((agent) =>
      agent.outputs.map((o) => ({ agentName: agent.name, projectId: agent.projectId, ...o }))
    )
    return allOutputs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4)
  }, [agents])

  const projectTitles: Record<string, string> = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p.title])),
    [projects]
  )

  return (
    <div className={clsx('space-y-8', isTerminal && 'max-w-none')}>
      {/* Command surface hero */}
      <div className={clsx(isTerminal ? 'pt-2' : 'pt-6')}>
        {/* System status line */}
        {!isTerminal && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-1.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-massa-accent to-massa-accent2 flex items-center justify-center shadow-lg shadow-massa-accent/20">
                <Zap size={16} className="text-white" />
              </div>
            </div>
            <h1 className="text-center text-[22px] font-semibold text-massa-text mb-1.5 tracking-tight">
              What are we building?
            </h1>
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-massa-ghost">
              <span className="flex items-center gap-1.5">
                <span className="status-dot status-dot-active" />
                {workingAgents.length} agents active
              </span>
              <span className="text-massa-border">·</span>
              <span>{projects.length} projects</span>
              <span className="text-massa-border">·</span>
              <span>{totalBuildsRunning > 0 ? `${totalBuildsRunning} builds running` : 'system ready'}</span>
            </div>
          </div>
        )}

        {isTerminal && (
          <div className="mb-4 space-y-0.5">
            <p className="text-green-500/40 font-mono text-[11px] animate-fade-in" style={{ animationDelay: '0ms' }}>
              [boot] MASSA kernel v0.1.0 loaded
            </p>
            <p className="text-green-500/40 font-mono text-[11px] animate-fade-in" style={{ animationDelay: '100ms' }}>
              [boot] Agent runtime initialized — {Object.keys(agents).length} agents registered
            </p>
            <p className="text-green-500/40 font-mono text-[11px] animate-fade-in" style={{ animationDelay: '200ms' }}>
              [boot] Project store loaded — {projects.length} projects, {activeProjects.length} active
            </p>
            <p className="text-green-500/60 font-mono text-[11px] animate-fade-in" style={{ animationDelay: '300ms' }}>
              [ready] System online. {workingAgents.length} agents working.
            </p>
            <div className="h-3" />
          </div>
        )}

        <CommandInput />
      </div>

      {/* System activity stream */}
      {recentActivity.length > 0 && (
        <div className={clsx(isTerminal ? '' : 'max-w-3xl mx-auto')}>
          <div className={clsx(
            'flex items-center gap-2 mb-2.5',
            isTerminal ? 'text-green-600' : 'text-massa-ghost'
          )}>
            <Activity size={12} />
            <span className="text-[11px] font-medium uppercase tracking-wider">
              {isTerminal ? '> live_activity' : 'System Activity'}
            </span>
          </div>
          <div className={clsx(
            'rounded-lg overflow-hidden',
            isTerminal
              ? 'border border-green-500/10 bg-black'
              : 'bg-massa-surface/40 border border-massa-border/40'
          )}>
            {recentActivity.map((item, idx) => (
              <div
                key={item.id}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-mono',
                  idx < recentActivity.length - 1 && (isTerminal ? 'border-b border-green-500/5' : 'border-b border-massa-border/30'),
                  isTerminal ? 'text-green-600' : 'text-massa-muted'
                )}
              >
                <span className={clsx(
                  'shrink-0 px-1.5 py-0.5 rounded text-[10px]',
                  isTerminal ? 'bg-green-500/10 text-green-500' : 'bg-massa-surface2 text-massa-ghost'
                )}>
                  {projectTitles[item.projectId]?.slice(0, 12) || 'System'}
                </span>
                <span className={isTerminal ? 'text-green-500' : 'text-massa-text/70'}>
                  {item.agentName}
                </span>
                <span className={clsx(
                  'truncate flex-1',
                  isTerminal ? 'text-green-700' : 'text-massa-ghost'
                )}>
                  {item.content.slice(0, 100)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Attention */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={clsx(
            'flex items-center gap-2',
            isTerminal ? 'text-green-500' : 'text-massa-text'
          )}>
            <Cpu size={14} className={isTerminal ? 'text-green-600' : 'text-massa-muted'} />
            <h2 className={clsx(
              'text-sm font-semibold',
              isTerminal && 'font-mono'
            )}>
              {isTerminal ? '> needs_attention' : 'Needs Attention'}
            </h2>
          </div>
          <Link
            to="/needs-attention"
            className="text-xs text-massa-muted hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <NeedsAttentionSection limit={3} />
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={clsx(
            'flex items-center gap-2',
            isTerminal ? 'text-green-500' : 'text-massa-text'
          )}>
            <FolderKanban size={14} className={isTerminal ? 'text-green-600' : 'text-massa-muted'} />
            <h2 className={clsx(
              'text-sm font-semibold',
              isTerminal && 'font-mono'
            )}>
              {isTerminal ? '> active_projects' : 'Active Projects'}
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs text-massa-muted hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            All projects <ArrowRight size={12} />
          </Link>
        </div>
        <div className={clsx(
          'grid gap-3',
          isTerminal ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
        )}>
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
