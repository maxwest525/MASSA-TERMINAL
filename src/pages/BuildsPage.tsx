import { useParams } from 'react-router-dom'
import { useProjectStore } from '@/stores/useProjectStore'
import { useAppStore } from '@/stores/useAppStore'
import { BuildList } from '@/components/project/BuildList'
import { clsx } from 'clsx'

export function BuildsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = useProjectStore((s) => (projectId ? s.projects[projectId] : null))
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  if (!project) {
    return <div className="text-center py-16 text-massa-muted">Project not found</div>
  }

  return (
    <div>
      <h2 className={clsx(
        'text-lg font-bold mb-4',
        isTerminal && 'text-green-400 font-mono'
      )}>
        {isTerminal ? `> BUILDS [${project.title}]` : `${project.title} — Builds`}
      </h2>
      <BuildList builds={project.builds} />
    </div>
  )
}
