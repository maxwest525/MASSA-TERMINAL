import { useCommandStore } from '@/stores/useCommandStore'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { Plus, ArrowUp, HelpCircle } from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  feature: Plus,
  enhancement: ArrowUp,
  optimization: ArrowUp,
  clarification: HelpCircle,
}

const typeColors: Record<string, string> = {
  feature: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10',
  enhancement: 'border-teal-500/30 text-teal-400 hover:bg-teal-500/10',
  optimization: 'border-green-500/30 text-green-400 hover:bg-green-500/10',
  clarification: 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10',
}

export function SuggestionChips() {
  const { suggestions, inputValue, setInput } = useCommandStore()
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  if (suggestions.length === 0) return null

  return (
    <div className="mt-3 animate-fade-in">
      <div className={clsx('text-xs mb-2', isTerminal ? 'text-green-600' : 'text-massa-muted')}>
        Suggestions based on your input:
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const Icon = typeIcons[suggestion.type] || Plus
          return (
            <button
              key={suggestion.id}
              onClick={() => {
                const addition = suggestion.label.replace(/^[+↑?]\s*/, '')
                setInput(inputValue + ' with ' + addition.toLowerCase())
              }}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-full transition-all duration-200',
                isTerminal
                  ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                  : typeColors[suggestion.type] || typeColors.feature
              )}
            >
              <Icon size={12} />
              {suggestion.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
