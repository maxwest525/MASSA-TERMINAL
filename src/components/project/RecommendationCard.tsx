import type { Recommendation } from '@/types'
import { clsx } from 'clsx'
import { Lightbulb, AlertTriangle, TrendingUp, Eye, X } from 'lucide-react'

const typeConfig: Record<Recommendation['type'], { icon: React.ElementType; color: string }> = {
  suggestion: { icon: Lightbulb, color: 'text-blue-400' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400' },
  optimization: { icon: TrendingUp, color: 'text-green-400' },
  insight: { icon: Eye, color: 'text-indigo-400' },
}

interface Props {
  recommendation: Recommendation
  onDismiss?: () => void
}

export function RecommendationCard({ recommendation, onDismiss }: Props) {
  if (recommendation.dismissed) return null

  const config = typeConfig[recommendation.type]
  const Icon = config.icon

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-massa-surface2/50 hover:bg-massa-surface2 transition-colors group">
      <Icon size={16} className={clsx('mt-0.5 shrink-0', config.color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{recommendation.title}</span>
          <span
            className={clsx(
              'text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold',
              recommendation.priority === 'high' && 'bg-red-500/15 text-red-400',
              recommendation.priority === 'medium' && 'bg-yellow-500/15 text-yellow-400',
              recommendation.priority === 'low' && 'bg-massa-surface2 text-massa-ghost'
            )}
          >
            {recommendation.priority}
          </span>
        </div>
        <p className="text-xs text-massa-muted mt-0.5">{recommendation.description}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded text-massa-ghost hover:text-massa-text opacity-0 group-hover:opacity-100 transition-all"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
