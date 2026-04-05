import { NeedsAttentionSection } from '@/components/operational/NeedsAttentionSection'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'

export function ApprovalsPage() {
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  return (
    <div>
      <h2 className={clsx(
        'text-lg font-bold mb-4',
        isTerminal && 'text-green-400 font-mono'
      )}>
        {isTerminal ? '> APPROVALS' : 'Approvals'}
      </h2>
      <NeedsAttentionSection />
    </div>
  )
}
