import { ProjectCard } from '@/components/project/ProjectCard'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAppStore } from '@/stores/useAppStore'
import type { Folder } from '@/types'
import { clsx } from 'clsx'

const folders: { folder: Folder; label: string }[] = [
  { folder: 'in-progress', label: 'In Progress' },
  { folder: 'completed', label: 'Completed' },
  { folder: 'deployed', label: 'Deployed' },
  { folder: 'published', label: 'Published' },
  { folder: 'archived', label: 'Archived' },
  { folder: 'deleted', label: 'Deleted' },
]

export function ProjectListPage() {
  const { activeFolder, setActiveFolder, getProjectsByFolder } = useProjectStore()
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'
  const projects = getProjectsByFolder(activeFolder)

  return (
    <div>
      {/* Folder tabs */}
      <div className={clsx(
        'flex items-center gap-1 mb-6 pb-3 border-b overflow-x-auto',
        isTerminal ? 'border-green-500/20' : 'border-massa-border'
      )}>
        {folders.map(({ folder, label }) => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap',
              activeFolder === folder
                ? isTerminal
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-massa-accent/15 text-indigo-300'
                : isTerminal
                  ? 'text-green-700 hover:text-green-400'
                  : 'text-massa-muted hover:text-massa-text hover:bg-massa-surface2'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <p className={clsx('text-sm', isTerminal ? 'text-green-700' : 'text-massa-muted')}>
            No projects in this folder
          </p>
        </div>
      ) : (
        <div className={clsx(
          'grid gap-4',
          isTerminal ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
