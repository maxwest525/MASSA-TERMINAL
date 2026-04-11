import { CommandInput } from '@/components/command/CommandInput'
import { ProjectCard } from '@/components/project/ProjectCard'
import { NeedsAttentionSection } from '@/components/operational/NeedsAttentionSection'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { Zap, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePage() {
  const projects = useProjectStore((s) => s.getAllProjects())
  const viewMode = useAppStore((s) => s.viewMode)
  const isTerminal = viewMode === 'terminal'

  const activeProjects = projects.filter((p) => p.folder === 'in-progress')

  return (
    <div className={clsx('space-y-8', isTerminal && 'max-w-none')}>
      {/* Hero / Command */}
      <div className={clsx('text-center', isTerminal ? 'pt-4' : 'pt-8')}>
        {!isTerminal && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-massa-accent/10 border border-massa-accent/20 mb-4">
              <Zap size={12} className="text-massa-accent" />
              <span className="text-xs text-teal-300 font-medium">AI Operating System</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">What do you want to build?</h1>
            <p className="text-sm text-massa-muted">
              Describe anything — from a simple website to a complex platform. MASSA builds it.
            </p>
          </div>
        )}

        {isTerminal && (
          <div className="text-left mb-4">
            <p className="text-green-500 font-mono text-sm">MASSA Terminal v0.1.0</p>
            <p className="text-green-700 font-mono text-xs">System ready. Enter a build command.</p>
          </div>
        )}

        <CommandInput />
      </div>

      {/* Needs Attention */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={clsx(
            'text-sm font-semibold',
            isTerminal && 'text-green-400 font-mono'
          )}>
            {isTerminal ? '> NEEDS_ATTENTION' : 'Needs Attention'}
          </h2>
          <Link
            to="/needs-attention"
            className="text-xs text-massa-muted hover:text-teal-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <NeedsAttentionSection limit={3} />
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={clsx(
            'text-sm font-semibold',
            isTerminal && 'text-green-400 font-mono'
          )}>
            {isTerminal ? '> ACTIVE_PROJECTS' : 'Active Projects'}
          </h2>
          <Link
            to="/projects"
            className="text-xs text-massa-muted hover:text-teal-300 flex items-center gap-1 transition-colors"
          >
            All projects <ArrowRight size={12} />
          </Link>
        </div>
        <div className={clsx(
          'grid gap-4',
          isTerminal ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}>
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
