import { NeedsAttentionSection } from '@/components/operational/NeedsAttentionSection'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { AlertCircle } from 'lucide-react'

export function NeedsAttentionPage() {
  const unresolvedCount = useNotificationStore((s) => s.getUnresolvedCount())
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle size={20} className={isTerminal ? 'text-green-400' : 'text-massa-accent'} />
        <h2 className={clsx(
          'text-lg font-bold',
          isTerminal && 'text-green-400 font-mono'
        )}>
          {isTerminal ? '> NEEDS_ATTENTION' : 'Needs Attention'}
        </h2>
        <span className="text-xs bg-massa-error/20 text-red-400 px-2 py-0.5 rounded-full">
          {unresolvedCount} unresolved
        </span>
      </div>
      <NeedsAttentionSection />
    </div>
  )
}
