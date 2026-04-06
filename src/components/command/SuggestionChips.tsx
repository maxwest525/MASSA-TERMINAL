import { useCommandStore } from '@/stores/useCommandStore'
import { useAppStore } from '@/stores/useAppStore'
import { clsx } from 'clsx'
import { Plus, ArrowUp, HelpCircle, Sparkles } from 'lucide-react'

const typeIcons: Record<string, React.ElementType> = {
  feature: Plus,
  enhancement: ArrowUp,
  optimization: ArrowUp,
  clarification: HelpCircle,
}

const typeColors: Record<string, string> = {
  feature: 'border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40',
  enhancement: 'border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/40',
  optimization: 'border-green-500/20 text-green-400 hover:bg-green-500/10 hover:border-green-500/40',
  clarification: 'border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/40',
}

export function SuggestionChips({ inline = false }: { inline?: boolean }) {
  const { suggestions, inputValue, setInput } = useCommandStore()
  const isTerminal = useAppStore((s) => s.viewMode) === 'terminal'

  if (suggestions.length === 0) return null

  return (
    <div className={clsx('animate-fade-in', !inline && 'mt-3')}>
      <div className={clsx(
        'flex items-center gap-1.5 mb-2',
        isTerminal ? 'text-green-600' : 'text-massa-ghost'
      )}>
        <Sparkles size={10} />
        <span className="text-[11px] font-medium">
          {isTerminal ? '> suggestions:' : 'System suggests'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
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
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border rounded-full transition-all duration-200',
                isTerminal
                  ? 'border-green-500/20 text-green-500 hover:bg-green-500/10 hover:border-green-500/40'
                  : typeColors[suggestion.type] || typeColors.feature
              )}
            >
              <Icon size={10} />
              {suggestion.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
