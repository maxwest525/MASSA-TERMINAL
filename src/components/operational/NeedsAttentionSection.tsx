import { useNotificationStore } from '@/stores/useNotificationStore'
import type { AttentionItem } from '@/stores/useNotificationStore'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Cloud,
  Plug,
  ArrowRight,
} from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  'approval-needed': CheckCircle,
  'build-failed': XCircle,
  'agent-blocked': AlertTriangle,
  'review-ready': Eye,
  'deploy-ready': Cloud,
  'integration-needed': Plug,
}

const severityVariant: Record<string, 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  critical: 'error',
}

interface Props {
  limit?: number
  projectId?: string
}

export function NeedsAttentionSection({ limit, projectId }: Props) {
  const { attentionItems, resolveItem } = useNotificationStore()

  let items = attentionItems.filter((i) => !i.resolved)
  if (projectId) items = items.filter((i) => i.projectId === projectId)
  if (limit) items = items.slice(0, limit)

  if (items.length === 0) {
    return (
      <div className="glass-panel p-4 text-center">
        <p className="text-sm text-massa-muted">All clear - nothing needs attention</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const Icon = typeIcons[item.type] || AlertTriangle
        return (
          <div
            key={item.id}
            className={clsx(
              'glass-panel p-3 flex items-center gap-3 group transition-all hover:border-massa-accent/30',
              item.severity === 'critical' && 'border-red-500/20'
            )}
          >
            <Icon
              size={16}
              className={clsx(
                item.severity === 'critical' && 'text-massa-error',
                item.severity === 'warning' && 'text-massa-warning',
                item.severity === 'info' && 'text-massa-accent'
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.title}</span>
                <Badge variant={severityVariant[item.severity]}>{item.type.replace(/-/g, ' ')}</Badge>
              </div>
              <p className="text-xs text-massa-muted mt-0.5">{item.description}</p>
              <span className="text-[10px] text-massa-ghost">{item.projectTitle}</span>
            </div>
            <button
              onClick={() => resolveItem(item.id)}
              className="shrink-0 px-3 py-1.5 text-xs font-medium bg-massa-accent/15 text-indigo-300 rounded-lg hover:bg-massa-accent/25 transition-colors opacity-0 group-hover:opacity-100"
            >
              Resolve
            </button>
          </div>
        )
      })}

      {!limit && items.length === 0 && (
        <p className="text-sm text-massa-ghost text-center py-6">Nothing needs attention</p>
      )}

      {limit && attentionItems.filter((i) => !i.resolved).length > limit && (
        <Link
          to="/needs-attention"
          className="flex items-center justify-center gap-1 text-xs text-massa-muted hover:text-indigo-300 transition-colors py-2"
        >
          View all <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}
